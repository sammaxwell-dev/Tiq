import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface FloatingIconProps {
  x: number;
  y: number;
  onModalClick: () => void;
  onInlineClick: () => void;
  visible: boolean;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ x, y, onModalClick, onInlineClick, visible }) => {
  console.log('FloatingIcon render:', { x, y, visible });

  if (!visible) return null;

  // Адаптивный размер иконки
  const isMobile = window.innerWidth < 640;

  const handleModalClick = (e: React.MouseEvent) => {
    console.log('FloatingIcon modal clicked!', { x, y });
    e.preventDefault();
    e.stopPropagation();
    onModalClick();
  };

  const handleInlineClick = (e: React.MouseEvent) => {
    console.log('FloatingIcon inline clicked!', { x, y });
    e.preventDefault();
    e.stopPropagation();
    onInlineClick();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('FloatingIcon mousedown');
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="fixed z-[9999] flex items-center gap-2 animate-in fade-in zoom-in"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Inline Replace Button */}
      <button
        className={cn(
          "flex items-center justify-center bg-purple-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-purple-700 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out",
          isMobile ? "w-10 h-10" : "w-8 h-8"
        )}
        onClick={handleInlineClick}
        aria-label="Replace inline with translation"
        type="button"
        title="Replace inline"
      >
        <Wand2 size={isMobile ? 18 : 16} />
      </button>

      {/* Modal Translation Button */}
      <button
        className={cn(
          "flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out",
          isMobile ? "w-10 h-10" : "w-8 h-8"
        )}
        onClick={handleModalClick}
        aria-label="Translate in modal"
        type="button"
        title="Open modal"
      >
        <Sparkles size={isMobile ? 18 : 16} />
      </button>
    </div>
  );
};

export default FloatingIcon;

