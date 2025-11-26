import React, { useRef } from 'react';
import {
  Languages,
  Sparkles,
  Baby,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

export type ExplainType = 'eli5' | 'define';

interface TranslatorTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  onTranslate: (mode: 'modal' | 'inline') => void;
  onExplain?: (type: ExplainType) => void;
}

const TranslatorTooltip: React.FC<TranslatorTooltipProps> = ({
  x,
  y,
  visible,
  onTranslate,
  onExplain,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!visible) return null;

  const isMobile = window.innerWidth < 640;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTranslateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslate('modal');
  };

  const handleInlineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslate('inline');
  };

  const handleExplainEli5 = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExplain?.('eli5');
  };

  const handleExplainDefine = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExplain?.('define');
  };

  return (
    <>
      {/* Tooltip Container */}
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-[9999] flex items-center p-1 bg-[#11111198] backdrop-blur-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)]',
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out',
          'hover:shadow-2xl transition-all duration-300'
        )}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translateX(-50%) translateY(-100%) translateY(-16px)',
          pointerEvents: 'auto',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Inline Replace Button */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleInlineClick}
          title="Replace inline"
          type="button"
        >
          <Sparkles size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-white/20" />

        {/* Main Translate Button */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleTranslateClick}
          title="Translate"
          type="button"
        >
          <Languages size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-white/20" />

        {/* Explain ELI5 Button */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleExplainEli5}
          title="Explain like I'm 5"
          type="button"
        >
          <Baby size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Explain Define Button */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleExplainDefine}
          title="Define term"
          type="button"
        >
          <BookOpen size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Arrow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{ marginTop: '-1px' }}
        >
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-[#11111198] drop-shadow-sm">
            <path d="M6 6L0 0H12L6 6Z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default TranslatorTooltip;
