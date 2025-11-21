import { useState, useEffect, useRef } from 'react';
import FloatingIcon from './FloatingIcon';
import TranslationModal from './modal/TranslationModal';
import { InstantTranslationPopUp } from './modal/InstantTranslationPopUp';
import { storage } from '../lib/storage';

const ContentApp = () => {
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInstantPopupVisible, setIsInstantPopupVisible] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const [instantTranslation, setInstantTranslation] = useState(false);
  const [initialTranslation, setInitialTranslation] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    storage.get().then(settings => {
      setInstantTranslation(settings.instantTranslation);
    });
  }, []);

  useEffect(() => {
    const handleMouseDown = () => {
      isSelectingRef.current = true;
      setIsIconVisible(false); // Hide icon immediately when starting selection
    };

    const handleMouseUp = () => {
      isSelectingRef.current = false;
      // Wait a bit for selection to finalize, then show icon
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleSelectionChange();
      }, 50);
    };

    const handleSelectionChange = () => {
      // Don't show icon if user is still selecting or if any UI is visible or icon was clicked
      if (isSelectingRef.current || isModalVisible || isInstantPopupVisible || iconClicked) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setIsIconVisible(false);
        setSelection(null);
        return;
      }

      const text = sel.toString().trim();
      if (text.length > 0) {
        try {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Проверяем, что выделение видимо в viewport
          const isVisible = rect.width > 0 && rect.height > 0 &&
                           rect.top < window.innerHeight &&
                           rect.bottom > 0 &&
                           rect.left < window.innerWidth &&
                           rect.right > 0;

          if (!isVisible) {
            setIsIconVisible(false);
            return;
          }

          setSelection({ text, rect });

          // Функция для получения позиции конца выделения
          const getSelectionEndPosition = () => {
            // Создаем копию диапазона для поиска конца выделения
            const endRange = range.cloneRange();

            // Схлопываем диапазон до точки в конце выделения
            endRange.collapse(false); // false схлопывает в конец диапазона

            // Получаем прямоугольник для точки конца выделения
            const endRect = endRange.getBoundingClientRect();

            // Если эндпоинт имеет нулевые размеры (часто бывает для точек),
            // используем исходный rect с корректировкой
            if (endRect.width === 0 && endRect.height === 0) {
              // Для выделений слева направо (LTR)
              if (range.startContainer === range.endContainer) {
                // Выделение в одном контейнере
                const isLTR = range.startOffset <= range.endOffset;
                if (isLTR) {
                  return { x: rect.right, y: rect.bottom };
                } else {
                  return { x: rect.left, y: rect.top };
                }
              } else {
                // Сложное выделение через несколько контейнеров
                // Используем rect.right, rect.bottom как наиболее надежные значения
                return { x: rect.right, y: rect.bottom };
              }
            }

            return { x: endRect.right, y: endRect.bottom };
          };

          // Упрощенное позиционирование иконки на основе конца выделения
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const ICON_SIZE = 32;
          const PADDING = 16; // Минимальный отступ от краев
          const OFFSET = 8;

          const selectionEnd = getSelectionEndPosition();

          let x: number, y: number;

          // Всегда позиционируем относительно конца выделения
          x = selectionEnd.x + OFFSET;
          y = selectionEnd.y;

          // Если не помещается, пробуем альтернативные позиции
          if (x + ICON_SIZE > viewportWidth - PADDING) {
            // Слева от конца выделения
            x = selectionEnd.x - ICON_SIZE - OFFSET;
          }

          if (y + ICON_SIZE > viewportHeight - PADDING) {
            // Выше конца выделения
            y = selectionEnd.y - ICON_SIZE - OFFSET;
          }

          // Если даже альтернативные позиции выходят за пределы, используем безопасную позицию
          if (selectionEnd.y < 0 || selectionEnd.y > viewportHeight) {
            // Конец выделения вне видимой зоны - используем центр видимой части выделения
            x = Math.min(rect.left + rect.width / 2, viewportWidth - ICON_SIZE - PADDING);
            y = Math.min(rect.top + rect.height / 2, viewportHeight - ICON_SIZE - PADDING);
          }

          // Финальная корректировка границ
          x = Math.max(PADDING, Math.min(x, viewportWidth - ICON_SIZE - PADDING));
          y = Math.max(PADDING, Math.min(y, viewportHeight - ICON_SIZE - PADDING));

          setIconPos({ x, y });
          console.log('Setting icon visible at position:', { x, y });
          setIsIconVisible(true);
        } catch (error) {
          console.error('Error positioning icon:', error);
          setIsIconVisible(false);
        }
      }
    };

    // Add mousedown/mouseup for selection tracking
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    // Keep selectionchange for programmatic selections
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isModalVisible, isInstantPopupVisible, iconClicked]);

  const handleIconClick = async () => {
    console.log('handleIconClick called', { selection, instantTranslation });

    if (!selection) {
      console.log('No selection, returning');
      return;
    }

    setIsIconVisible(false);
    setIconClicked(true);

    // If instant translation is enabled, translate and show popup
    if (instantTranslation) {
      try {
        // Check if extension context is valid
        if (!chrome.runtime?.id) {
          setInitialTranslation('Extension reloading, please refresh the page');
          setIsModalVisible(true);
          return;
        }

        const settings = await storage.get();

        // Add timeout for message response
        const messagePromise = chrome.runtime.sendMessage({
          type: 'TRANSLATE_REQUEST',
          payload: {
            text: selection.text,
            targetLang: settings.targetLang,
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
          setIsModalVisible(true); // Fall back to modal on error
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
        setIsModalVisible(true); // Fall back to modal on error
      }
    } else {
      // No instant translation - show modal directly
      setInitialTranslation(undefined);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIconClicked(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCloseInstantPopup = () => {
    setIsInstantPopupVisible(false);
    setInitialTranslation(undefined);
    setIconClicked(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCopyTranslation = (translation: string) => {
    // Optional: Could add a toast notification here
    console.log('Translation copied:', translation);
  };

  
  const handleOpenFullModal = () => {
    setIsInstantPopupVisible(false);
    setIsModalVisible(true);
  };

  return (
    <>
      <FloatingIcon
        x={iconPos.x}
        y={iconPos.y}
        visible={isIconVisible && !iconClicked}
        onClick={handleIconClick}
      />

      {selection && isModalVisible && (
        <TranslationModal
            visible={isModalVisible}
            initialText={selection.text}
            initialTranslation={initialTranslation}
            onClose={handleCloseModal}
        />
      )}

      {selection && isInstantPopupVisible && initialTranslation && (
        <InstantTranslationPopUp
          translation={initialTranslation}
          position={iconPos}
          onClose={handleCloseInstantPopup}
          onCopy={handleCopyTranslation}
          onOpenModal={handleOpenFullModal}
        />
      )}
    </>
  );
};

export default ContentApp;

