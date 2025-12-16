import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Languages,
  Sparkles,
  Baby,
  BookOpen,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export type ExplainType = 'eli5' | 'define';
export type TranslateMode = 'modal' | 'inline';

interface TranslatorTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  translateMode: TranslateMode;
  onTranslate: (mode: TranslateMode) => void;
  onTranslateModeChange: (mode: TranslateMode) => void;
  onExplain?: (type: ExplainType) => void;
}

const TRANSLATE_OPTIONS = [
  { mode: 'inline' as const, label: 'Inline Replace', Icon: Sparkles },
  { mode: 'modal' as const, label: 'Modal Popup', Icon: Languages },
];

const EXPLAIN_OPTIONS = [
  { type: 'eli5' as const, label: "Explain like I'm 5", Icon: Baby },
  { type: 'define' as const, label: 'Define term', Icon: BookOpen },
];

const TranslatorTooltip: React.FC<TranslatorTooltipProps> = ({
  x,
  y,
  visible,
  translateMode,
  onTranslate,
  onTranslateModeChange,
  onExplain,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<'translate' | 'explain' | null>(null);
  const [explainType, setExplainType] = useState<ExplainType>('eli5');

  // Get current icons based on selected modes
  const CurrentTranslateIcon = translateMode === 'inline' ? Sparkles : Languages;
  const CurrentExplainIcon = explainType === 'eli5' ? Baby : BookOpen;

  // Toggle dropdown on click
  const handleDropdownToggle = useCallback((dropdown: 'translate' | 'explain') => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeDropdown && tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        const dropdownMenus = document.querySelectorAll('[data-dropdown-menu]');
        let clickedInsideDropdown = false;
        dropdownMenus.forEach(menu => {
          if (menu.contains(e.target as Node)) {
            clickedInsideDropdown = true;
          }
        });
        if (!clickedInsideDropdown) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Reset dropdown when tooltip becomes invisible
  useEffect(() => {
    if (!visible) {
      setActiveDropdown(null);
    }
  }, [visible]);

  if (!visible) return null;

  const isMobile = window.innerWidth < 640;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMainTranslateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslate(translateMode);
  };

  const handleMainExplainClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onExplain?.(explainType);
  };

  const handleTranslateModeSelect = (e: React.MouseEvent, mode: TranslateMode) => {
    e.preventDefault();
    e.stopPropagation();
    onTranslateModeChange(mode);
    setActiveDropdown(null);
  };

  const handleExplainTypeSelect = (e: React.MouseEvent, type: ExplainType) => {
    e.preventDefault();
    e.stopPropagation();
    setExplainType(type);
    setActiveDropdown(null);
  };

  const handleDropdownButtonClick = (e: React.MouseEvent, dropdown: 'translate' | 'explain') => {
    e.preventDefault();
    e.stopPropagation();
    handleDropdownToggle(dropdown);
  };

  return (
    <>
      {/* Tooltip Container */}
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-[9999] flex items-center p-1 backdrop-blur-sm rounded-full shadow-[0_0_20px_rgba(0,0,0,0.15)]',
          'bg-white/95 dark:bg-[#11111198] border border-gray-200/50 dark:border-transparent',
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
        {/* Main Translate Button - shows current mode icon */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleMainTranslateClick}
          title={translateMode === 'inline' ? 'Replace inline' : 'Translate in popup'}
          type="button"
        >
          <CurrentTranslateIcon size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Translate Mode Dropdown Button */}
        <button
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-full',
            'hover:bg-gray-100 dark:hover:bg-white/10',
            'text-gray-500 dark:text-white/70',
            'transition-all duration-200',
            'active:scale-90',
            activeDropdown === 'translate' && 'bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-white',
            isMobile ? 'w-9 h-9' : 'w-7 h-7'
          )}
          onClick={(e) => handleDropdownButtonClick(e, 'translate')}
          title="Change translate mode"
          type="button"
        >
          <motion.div
            animate={{ rotate: activeDropdown === 'translate' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={isMobile ? 14 : 12} strokeWidth={2.5} />
          </motion.div>
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-gray-300 dark:bg-white/20" />

        {/* Main Explain Button - shows current explain type icon */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleMainExplainClick}
          title={explainType === 'eli5' ? "Explain like I'm 5" : 'Define term'}
          type="button"
        >
          <CurrentExplainIcon size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Explain Dropdown Button */}
        <button
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-full',
            'hover:bg-gray-100 dark:hover:bg-white/10',
            'text-gray-500 dark:text-white/70',
            'transition-all duration-200',
            'active:scale-90',
            activeDropdown === 'explain' && 'bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-white',
            isMobile ? 'w-9 h-9' : 'w-7 h-7'
          )}
          onClick={(e) => handleDropdownButtonClick(e, 'explain')}
          title="More explain options"
          type="button"
        >
          <motion.div
            animate={{ rotate: activeDropdown === 'explain' ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={isMobile ? 14 : 12} strokeWidth={2.5} />
          </motion.div>
        </button>

        {/* Arrow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{ marginTop: '-1px' }}
        >
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white/95 dark:fill-[#11111198] drop-shadow-sm">
            <path d="M6 6L0 0H12L6 6Z" />
          </svg>
        </div>
      </div>

      {/* Translate Mode Dropdown Menu - appears BELOW the tooltip */}
      <AnimatePresence>
        {activeDropdown === 'translate' && (
          <motion.div
            data-dropdown-menu
            initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-[9998] flex flex-col items-center gap-2"
            style={{
              left: `${x}px`,
              top: `${y + 16}px`,
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
            }}
            onMouseDown={handleMouseDown}
          >
            {TRANSLATE_OPTIONS.map((option, index) => {
              const { Icon } = option;
              const isSelected = translateMode === option.mode;

              return (
                <motion.div
                  key={option.mode}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <button
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 rounded-full',
                      'bg-white/95 dark:bg-[#11111198] backdrop-blur-sm',
                      'shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)]',
                      'hover:bg-gray-100 dark:hover:bg-[#111111d1]',
                      'transition-all duration-200',
                      'text-gray-800 dark:text-white border border-gray-200/50 dark:border-transparent whitespace-nowrap',
                      isSelected && 'ring-2 ring-blue-400/50 dark:ring-white/30 bg-gray-100 dark:bg-[#111111d1]'
                    )}
                    onClick={(e) => handleTranslateModeSelect(e, option.mode)}
                    type="button"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span className="text-sm font-medium">{option.label}</span>
                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} className="text-green-400 ml-1" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explain Dropdown Menu - appears BELOW the tooltip */}
      <AnimatePresence>
        {activeDropdown === 'explain' && (
          <motion.div
            data-dropdown-menu
            initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-[9998] flex flex-col items-center gap-2"
            style={{
              left: `${x}px`,
              top: `${y + 16}px`,
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
            }}
            onMouseDown={handleMouseDown}
          >
            {EXPLAIN_OPTIONS.map((option, index) => {
              const { Icon } = option;
              const isSelected = explainType === option.type;

              return (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <button
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 rounded-full',
                      'bg-white/95 dark:bg-[#11111198] backdrop-blur-sm',
                      'shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)]',
                      'hover:bg-gray-100 dark:hover:bg-[#111111d1]',
                      'transition-all duration-200',
                      'text-gray-800 dark:text-white border border-gray-200/50 dark:border-transparent whitespace-nowrap',
                      isSelected && 'ring-2 ring-blue-400/50 dark:ring-white/30 bg-gray-100 dark:bg-[#111111d1]'
                    )}
                    onClick={(e) => handleExplainTypeSelect(e, option.type)}
                    type="button"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span className="text-sm font-medium">{option.label}</span>
                    {isSelected && (
                      <Check size={16} strokeWidth={2.5} className="text-green-400 ml-1" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TranslatorTooltip;
