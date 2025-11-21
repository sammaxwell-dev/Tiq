import React, { useState, useEffect, useRef } from 'react';
import { Languages, ChevronDown, Wand2 } from 'lucide-react';
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
          'fixed z-[9999] flex items-center gap-0 bg-white dark:bg-gray-900 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700',
          'animate-in fade-in slide-in-from-bottom-2 duration-200',
          'hover:shadow-2xl transition-shadow'
        )}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translateX(-50%) translateY(-100%) translateY(-12px)',
          pointerEvents: 'auto',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Inline Replace Button */}
        <button
          className={cn(
            'flex items-center justify-center px-3 py-2 rounded-l-full',
            'bg-purple-600 hover:bg-purple-700 text-white',
            'transition-all duration-200',
            'active:scale-95',
            isMobile ? 'px-4 py-3' : 'px-3 py-2'
          )}
          onClick={handleInlineClick}
          title="Replace inline with translation"
          type="button"
        >
          <Wand2 size={isMobile ? 18 : 16} />
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />

        {/* Main Translate Button */}
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors duration-200',
            'active:scale-95',
            isMobile ? 'px-5 py-3' : 'px-4 py-2'
          )}
          onClick={handleTranslateClick}
          title={`Translate (${currentToneOption.label})`}
          type="button"
        >
          <Languages size={isMobile ? 18 : 16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentToneOption.icon}
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />

        {/* Tone Selector Button */}
        <button
          className={cn(
            'flex items-center justify-center px-3 py-2 rounded-r-full',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors duration-200',
            'active:scale-95',
            isDropdownOpen && 'bg-gray-100 dark:bg-gray-800',
            isMobile ? 'px-4 py-3' : 'px-3 py-2'
          )}
          onClick={handleToneToggle}
          title="Select tone"
          type="button"
        >
          <ChevronDown
            size={isMobile ? 18 : 16}
            className={cn(
              'text-gray-600 dark:text-gray-400 transition-transform duration-200',
              isDropdownOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Arrow pointing down to selected text */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{ marginTop: '-1px' }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-900" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'fixed z-[10000] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[220px]',
            'animate-in fade-in slide-in-from-top-2 duration-200'
          )}
          style={{
            left: `${x}px`,
            top: `${y + 8}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Translation Tone
            </p>
          </div>

          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={cn(
                'w-full flex items-start gap-3 px-3 py-2.5',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'transition-colors duration-150',
                'text-left',
                selectedTone === option.value && 'bg-blue-50 dark:bg-blue-900/20'
              )}
              onClick={() => handleToneSelect(option.value)}
              type="button"
            >
              <span className="text-xl mt-0.5">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      selectedTone === option.value
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                    )}
                  >
                    {option.label}
                  </span>
                  {selectedTone === option.value && (
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TranslatorTooltip;
