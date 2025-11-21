import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface FloatingIconProps {
  x: number;
  y: number;
  onClick: () => void;
  visible: boolean;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ x, y, onClick, visible }) => {
  if (!visible) return null;

  // Адаптивный размер иконки
  const isMobile = window.innerWidth < 640;

  return (
    <button
      className={cn(
        "fixed z-[9999] flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out animate-in fade-in zoom-in",
        isMobile ? "w-10 h-10" : "w-8 h-8" // Чуть больше на мобильных для удобства
      )}
      style={{
        left: x,
        top: y,
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Translate selection"
    >
      <Sparkles size={isMobile ? 18 : 16} />
    </button>
  );
};

export default FloatingIcon;

