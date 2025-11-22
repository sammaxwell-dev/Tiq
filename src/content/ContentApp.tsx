import { useState, useEffect, useRef } from 'react';
import TranslatorTooltip from './TranslatorTooltip';
import { InstantTranslationPopUp } from './modal/InstantTranslationPopUp';
import { storage } from '../lib/storage';
import { performInlineReplace } from '../lib/inlineReplace';
import { TranslationTone } from '../types/tone';

const ContentApp = () => {
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isInstantPopupVisible, setIsInstantPopupVisible] = useState(false);
  const [tooltipClicked, setTooltipClicked] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedTone, setSelectedTone] = useState<TranslationTone>('standard');
  const [initialTranslation, setInitialTranslation] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    storage.get().then(settings => {
      if (settings.translationTone) {
        setSelectedTone(settings.translationTone);
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseDown = () => {
      isSelectingRef.current = true;
      setIsTooltipVisible(false); // Hide tooltip immediately when starting selection
    };

    const handleMouseUp = () => {
      isSelectingRef.current = false;
      // Wait a bit for selection to finalize, then show tooltip
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleSelectionChange();
      }, 50);
    };

    const handleKeyUp = () => {
      // Handle keyboard selections (Shift + arrows, Ctrl+A, etc.)
      if (!isSelectingRef.current) {
        handleSelectionChange();
      }
    };

    const handleSelectionChange = () => {
      // Don't show tooltip if user is still selecting or if any UI is visible or tooltip was clicked
      if (isSelectingRef.current || isInstantPopupVisible || tooltipClicked) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setIsTooltipVisible(false);
        setSelection(null);
        return;
      }

      const text = sel.toString().trim();
      if (text.length > 0) {
        try {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Check if selection is visible in viewport
          const isVisible = rect.width > 0 && rect.height > 0 &&
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0;

          if (!isVisible) {
            setIsTooltipVisible(false);
            return;
          }

          setSelection({ text, rect });

          // PRECISE POSITIONING: Calculate tooltip position above selection
          // For position: fixed, we use viewport coordinates (NO scroll offset needed)
          const x = rect.left + (rect.width / 2); // Center horizontally
          const y = rect.top; // Top of selection in viewport

          setTooltipPos({ x, y });
          console.log('Setting tooltip visible at position:', { x, y });
          setIsTooltipVisible(true);
        } catch (error) {
          console.error('Error positioning tooltip:', error);
          setIsTooltipVisible(false);
        }
      }
    };

    // Add mousedown/mouseup for selection tracking
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    // Keep selectionchange for programmatic selections
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInstantPopupVisible, tooltipClicked]);

  const handleTranslate = async (mode: 'modal' | 'inline') => {
    console.log('handleTranslate called', { mode, selection, selectedTone });

    if (!selection) {
      console.log('No selection, returning');
      return;
    }

    setIsTooltipVisible(false);
    setTooltipClicked(true);

    if (mode === 'inline') {
      // Handle inline replacement
      await handleInlineTranslation();
    } else {
      // Handle modal translation (now just instant popup)
      await handleModalTranslation();
    }
  };

  const handleModalTranslation = async () => {
    try {
      // Check if extension context is valid
      if (!chrome.runtime?.id) {
        setInitialTranslation('Extension reloading, please refresh the page');
        setIsInstantPopupVisible(true);
        return;
      }

      const settings = await storage.get();

      // Add timeout for message response
      const messagePromise = chrome.runtime.sendMessage({
        type: 'TRANSLATE_REQUEST',
        payload: {
          text: selection!.text,
          targetLang: settings.targetLang,
          tone: selectedTone,
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
      });

      const response = await Promise.race([messagePromise, timeoutPromise]);

      if (response && response.success) {
        setInitialTranslation(response.data);
        setIsInstantPopupVisible(true);
      } else {
        setInitialTranslation(response?.error || 'Translation failed');
        setIsInstantPopupVisible(true);
      }
    } catch (error: any) {
      console.error('Translation request error:', error);
      if (error.message === 'Request timeout') {
        setInitialTranslation('Translation request timed out. Please try again.');
      } else if (error.message?.includes('Extension context invalidated')) {
        setInitialTranslation('Extension reloaded. Please refresh the page and try again.');
      } else {
        setInitialTranslation('Failed to communicate with extension. Please try again.');
      }
      setIsInstantPopupVisible(true);
    }
  };

  const handleInlineTranslation = async () => {
    try {
      // Check if extension context is valid
      if (!chrome.runtime?.id) {
        console.error('Extension context invalid');
        alert('Extension reloading, please refresh the page');
        setTooltipClicked(false);
        return;
      }

      const settings = await storage.get();

      // Request translation with inline context and tone
      const messagePromise = chrome.runtime.sendMessage({
        type: 'TRANSLATE_REQUEST',
        payload: {
          text: selection!.text,
          targetLang: settings.targetLang,
          context: 'inline-replace', // Special context for inline mode
          tone: selectedTone,
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000);
      });

      const response = await Promise.race([messagePromise, timeoutPromise]);

      if (response && response.success) {
        // Perform inline replacement with typewriter animation
        const result = await performInlineReplace(response.data);

        if (result) {
          console.log('Inline replacement successful');
          // Optionally store restore function for undo feature
          // For now, the replacement is permanent after animation completes
        }
      } else {
        console.error('Translation failed:', response?.error);
        alert(`Translation failed: ${response?.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Inline translation error:', error);
      if (error.message === 'Request timeout') {
        alert('Translation request timed out. Please try again.');
      } else {
        alert('Failed to translate. Please try again.');
      }
    } finally {
      setTooltipClicked(false);
      // Don't clear selection immediately to allow for inline replacement
      setTimeout(() => {
        window.getSelection()?.removeAllRanges();
      }, 500);
    }
  };

  const handleToneChange = async (tone: TranslationTone) => {
    setSelectedTone(tone);
    // Save to storage for persistence
    await storage.set({ translationTone: tone });
    console.log('Tone changed to:', tone);
  };

  const handleCloseInstantPopup = () => {
    setIsInstantPopupVisible(false);
    setInitialTranslation(undefined);
    setTooltipClicked(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCopyTranslation = (translation: string) => {
    // Optional: Could add a toast notification here
    console.log('Translation copied:', translation);
  };

  return (
    <>
      <TranslatorTooltip
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={isTooltipVisible && !tooltipClicked}
        selectedTone={selectedTone}
        onTranslate={handleTranslate}
        onToneChange={handleToneChange}
      />

      {selection && isInstantPopupVisible && initialTranslation && (
        <InstantTranslationPopUp
          translation={initialTranslation}
          position={tooltipPos}
          onClose={handleCloseInstantPopup}
          onCopy={handleCopyTranslation}
        />
      )}
    </>
  );
};

export default ContentApp;

