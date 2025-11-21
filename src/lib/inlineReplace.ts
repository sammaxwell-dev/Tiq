/**
 * Inline Text Replacement with Typewriter Animation
 * Replaces selected text in the DOM with animated translation
 */

export interface SelectionInfo {
  range: Range;
  text: string;
  originalNode: Node;
  startOffset: number;
  endOffset: number;
  containerElement: HTMLElement;
}

export interface ReplacementHandle {
  element: HTMLSpanElement;
  restore: () => void;
}

/**
 * Captures the current text selection with all necessary context
 */
export function captureSelection(): SelectionInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0).cloneRange();
  const text = selection.toString().trim();

  if (!text) return null;

  // Find the common ancestor element
  const container = range.commonAncestorContainer;
  const containerElement = container.nodeType === Node.ELEMENT_NODE
    ? container as HTMLElement
    : container.parentElement!;

  return {
    range,
    text,
    originalNode: range.startContainer,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    containerElement,
  };
}

/**
 * Computes the effective styles of the parent element to preserve appearance
 */
function getComputedStyles(element: HTMLElement): Partial<CSSStyleDeclaration> {
  const computed = window.getComputedStyle(element);
  return {
    fontSize: computed.fontSize,
    fontFamily: computed.fontFamily,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    color: computed.color,
    lineHeight: computed.lineHeight,
    letterSpacing: computed.letterSpacing,
  };
}

/**
 * Creates a wrapper span that will contain the animated replacement text
 */
function createReplacementSpan(selectionInfo: SelectionInfo): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'gpt-translate-inline-replacement';

  // Apply computed styles from parent to maintain visual consistency
  const styles = getComputedStyles(selectionInfo.containerElement);
  Object.assign(span.style, {
    fontSize: styles.fontSize,
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    fontStyle: styles.fontStyle,
    color: styles.color,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    display: 'inline',
    margin: '0',
    padding: '0',
    border: 'none',
    background: 'transparent',
    whiteSpace: 'pre-wrap', // Preserve whitespace like original text
  });

  return span;
}

/**
 * Replaces the selected text with a span element in the DOM
 * Handles text node splitting if the selection is partial
 */
export function replaceSelectionWithElement(selectionInfo: SelectionInfo): ReplacementHandle {
  const { range } = selectionInfo;
  const span = createReplacementSpan(selectionInfo);

  // Store original content for restoration
  const originalContent = range.cloneContents();
  const originalParent = range.startContainer.parentNode!;
  const originalNextSibling = range.startContainer.nextSibling;

  // Delete the selected content and insert our span
  range.deleteContents();
  range.insertNode(span);

  // Clear selection to avoid visual artifacts
  window.getSelection()?.removeAllRanges();

  // Return handle with restore function
  return {
    element: span,
    restore: () => {
      // Remove the span and restore original content
      if (span.parentNode) {
        span.parentNode.removeChild(span);

        // Re-insert original content
        if (originalNextSibling) {
          originalParent.insertBefore(originalContent, originalNextSibling);
        } else {
          originalParent.appendChild(originalContent);
        }
      }
    },
  };
}

/**
 * Animates text with typewriter effect
 * @param element Target element to render text into
 * @param text Full text to animate
 * @param speed Characters per millisecond (default ~25ms per char)
 * @param onComplete Callback when animation finishes
 * @returns Cancel function
 */
export function animateTypewriter(
  element: HTMLElement,
  text: string,
  speed: number = 25,
  onComplete?: () => void
): () => void {
  let currentIndex = 0;
  let intervalId: NodeJS.Timeout | null = null;
  let isCancelled = false;

  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = `
    display: inline;
    animation: gpt-translate-blink 1s infinite;
    margin-left: 1px;
  `;

  // Inject blink animation if not already present
  if (!document.getElementById('gpt-translate-blink-style')) {
    const style = document.createElement('style');
    style.id = 'gpt-translate-blink-style';
    style.textContent = `
      @keyframes gpt-translate-blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  element.appendChild(cursor);

  const typeNextChar = () => {
    if (isCancelled) {
      return;
    }

    if (currentIndex < text.length) {
      // Insert character before cursor
      const char = text[currentIndex];
      const textNode = document.createTextNode(char);
      element.insertBefore(textNode, cursor);
      currentIndex++;
    } else {
      // Animation complete
      if (intervalId) {
        clearInterval(intervalId);
      }
      // Remove cursor
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      if (onComplete) {
        onComplete();
      }
    }
  };

  intervalId = setInterval(typeNextChar, speed);

  // Return cancel function
  return () => {
    isCancelled = true;
    if (intervalId) {
      clearInterval(intervalId);
    }
    // Remove cursor if still present
    if (cursor.parentNode) {
      cursor.parentNode.removeChild(cursor);
    }
    // Complete the text instantly
    element.textContent = text;
  };
}

/**
 * Main orchestrator: captures selection, replaces it, fetches translation, and animates
 * @param translationText The translated text to display
 * @returns Handle with restore function and cancel function
 */
export async function performInlineReplace(
  translationText: string
): Promise<{ restore: () => void; cancel: () => void } | null> {
  const selectionInfo = captureSelection();

  if (!selectionInfo) {
    console.error('No valid selection found');
    return null;
  }

  const handle = replaceSelectionWithElement(selectionInfo);
  let cancelAnimation: (() => void) | null = null;

  // Start typewriter animation
  cancelAnimation = animateTypewriter(
    handle.element,
    translationText,
    20, // 20ms per character for smooth animation
    () => {
      console.log('Inline translation animation complete');
    }
  );

  return {
    restore: () => {
      if (cancelAnimation) {
        cancelAnimation();
      }
      handle.restore();
    },
    cancel: () => {
      if (cancelAnimation) {
        cancelAnimation();
      }
    },
  };
}
