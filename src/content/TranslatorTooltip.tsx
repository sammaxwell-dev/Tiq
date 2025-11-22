import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  ChevronDown,
  Wand2,
  MessageSquareText,
  Briefcase,
  Coffee,
  Smile,
  Terminal,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TranslationTone, TONE_OPTIONS } from '../types/tone';

interface TranslatorTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  selectedTone: TranslationTone;
  onTranslate: (mode: 'modal' | 'inline') => void;
  onToneChange: (tone: TranslationTone) => void;
}

const TONE_ICONS: Record<TranslationTone, React.ElementType> = {
  standard: MessageSquareText,
  formal: Briefcase,
  casual: Coffee,
  humorous: Smile,
  code: Terminal,
  tldr: Zap,
};

const TranslatorTooltip: React.FC<TranslatorTooltipProps> = ({
  x,
  y,
  visible,
  selectedTone,
  onTranslate,
  onToneChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Reset dropdown when tooltip becomes invisible
  useEffect(() => {
    if (!visible) {
      setIsDropdownOpen(false);
    }
  }, [visible]);

  if (!visible) return null;

  const currentToneOption = TONE_OPTIONS.find((opt) => opt.value === selectedTone) || TONE_OPTIONS[0];
  const CurrentToneIcon = TONE_ICONS[selectedTone] || MessageSquareText;
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

  const handleToneToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToneSelect = (tone: TranslationTone) => {
    onToneChange(tone);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Tooltip Container */}
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-[9999] flex items-center p-1 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50',
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
            'flex items-center justify-center w-10 h-10 rounded-xl',
            'bg-indigo-500 hover:bg-indigo-600 text-white',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleInlineClick}
          title="Replace inline"
          type="button"
        >
          <Wand2 size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1.5 bg-gray-200 dark:bg-gray-700" />

        {/* Main Translate Button */}
        <button
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-700 dark:text-gray-200',
            'transition-all duration-200 ease-out',
            'active:scale-95',
            isMobile ? 'px-4 py-3' : 'px-3 py-2'
          )}
          onClick={handleTranslateClick}
          title={`Translate (${currentToneOption.label})`}
          type="button"
        >
          <Languages size={isMobile ? 20 : 18} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold">Translate</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <CurrentToneIcon size={14} className="text-gray-500 dark:text-gray-400" />
          </div>
        </button>

        {/* Tone Selector Button */}
        <button
          className={cn(
            'flex items-center justify-center w-8 h-8 ml-0.5 rounded-lg',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'text-gray-500 dark:text-gray-400',
            'transition-all duration-200',
            'active:scale-90',
            isDropdownOpen && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            isMobile ? 'w-10 h-10' : 'w-8 h-8'
          )}
          onClick={handleToneToggle}
          title="Select tone"
          type="button"
        >
          <ChevronDown
            size={isMobile ? 18 : 16}
            className={cn(
              'transition-transform duration-300 ease-out',
              isDropdownOpen && 'rotate-180'
            )}
            strokeWidth={2.5}
          />
        </button>

        {/* Arrow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{ marginTop: '-1px' }}
        >
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white/90 dark:fill-gray-900/95 drop-shadow-sm">
            <path d="M6 6L0 0H12L6 6Z" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'fixed z-[10000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-2 min-w-[260px]',
            'animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out origin-top'
          )}
          style={{
            left: `${x}px`,
            top: `${y + 8}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <div className="px-3 py-2 mb-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Select Tone
            </p>
          </div>

          <div className="grid gap-1">
            {TONE_OPTIONS.map((option) => {
              const Icon = TONE_ICONS[option.value] || MessageSquareText;
              const isSelected = selectedTone === option.value;

              return (
                <button
                  key={option.value}
                  className={cn(
                    'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'hover:bg-gray-100 dark:hover:bg-gray-800/80',
                    'transition-all duration-200 ease-out',
                    'text-left relative overflow-hidden',
                    isSelected && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                  onClick={() => handleToneSelect(option.value)}
                  type="button"
                >
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200',
                    isSelected
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                  )}>
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-200'
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5 truncate",
                      isSelected ? "text-blue-600/80 dark:text-blue-400/80" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {option.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default TranslatorTooltip;
