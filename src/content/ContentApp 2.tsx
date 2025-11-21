import { useState, useEffect, useRef } from 'react';
import FloatingIcon from './FloatingIcon';
import TranslationModal from './modal/TranslationModal';
import { storage } from '../lib/storage';

const ContentApp = () => {
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const [instantTranslation, setInstantTranslation] = useState(false);
  const [initialTranslation, setInitialTranslation] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    storage.get().then(settings => {
      setInstantTranslation(settings.instantTranslation);
    });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (isModalVisible) return;

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

          // Упрощенное позиционирование иконки
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const ICON_SIZE = 32;
          const PADDING = 16; // Минимальный отступ от краев
          const OFFSET = 8;

          let x: number, y: number;

          // Для больших выделений (высота > половины экрана) - фиксированная позиция в правом нижнем углу
          if (rect.height > viewportHeight / 2) {
            x = viewportWidth - ICON_SIZE - PADDING;
            y = viewportHeight - ICON_SIZE - PADDING;
          } else {
            // Пробуем справа сверху от выделения
            x = rect.right + OFFSET;
            y = rect.top;

            // Если не помещается справа или сверху, используем справа снизу
            if (x + ICON_SIZE > viewportWidth - PADDING || y < PADDING) {
              x = rect.right + OFFSET;
              y = rect.bottom + OFFSET;
            }

            // Финальная корректировка границ
            x = Math.max(PADDING, Math.min(x, viewportWidth - ICON_SIZE - PADDING));
            y = Math.max(PADDING, Math.min(y, viewportHeight - ICON_SIZE - PADDING));
          }

          setIconPos({ x, y });
          setIsIconVisible(true);
        } catch (error) {
          console.error('Error positioning icon:', error);
          setIsIconVisible(false);
        }
      }
    };

    const onSelectionChange = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleSelectionChange, 150);
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseup', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mouseup', onSelectionChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isModalVisible]);

  const handleIconClick = async () => {
    setIsIconVisible(false);

    if (instantTranslation && selection) {
      try {
        // Check if extension context is valid
        if (!chrome.runtime?.id) {
          setInitialTranslation('Extension reloading, please refresh the page');
          setIsModalVisible(true);
          return;
        }

        const settings = await storage.get();
        const response = await chrome.runtime.sendMessage({
          type: 'TRANSLATE_REQUEST',
          payload: {
            text: selection.text,
            targetLang: settings.targetLang,
          }
        });

        if (response && response.success) {
          setInitialTranslation(response.data);
        } else {
          setInitialTranslation(response?.error || 'Translation failed');
        }
      } catch (error) {
        setInitialTranslation('Failed to communicate with extension');
      }
    } else {
      setInitialTranslation(undefined);
    }

    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      <FloatingIcon 
        x={iconPos.x} 
        y={iconPos.y} 
        visible={isIconVisible} 
        onClick={handleIconClick} 
      />
      
      {selection && (
        <TranslationModal
            visible={isModalVisible}
            initialText={selection.text}
            initialTranslation={initialTranslation}
            onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ContentApp;

