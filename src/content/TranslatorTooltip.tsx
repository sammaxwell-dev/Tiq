import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Languages,
  Sparkles,
  Baby,
  BookOpen,
  ChevronDown,
  Lightbulb
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

// Calculate tooltip height for dropdown positioning
const TOOLTIP_HEIGHT = 48; // Approximate height of the tooltip
const TOOLTIP_OFFSET = 16; // Gap between selection and tooltip

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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate tooltip top position (y is top of selection, tooltip is above it)
  const tooltipTop = y - TOOLTIP_HEIGHT - TOOLTIP_OFFSET;

  // Get current mode icon
  const CurrentModeIcon = translateMode === 'inline' ? Sparkles : Languages;

  // Hover handlers with delay
  const handleDropdownHoverEnter = useCallback((dropdown: 'translate' | 'explain') => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  }, []);

  const handleDropdownHoverLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // Increased delay for easier mouse movement
  }, []);

  // Reset dropdown when tooltip becomes invisible
  useEffect(() => {
    if (!visible) {
      setActiveDropdown(null);
    }
  }, [visible]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

  const handleTranslateModeSelect = (mode: TranslateMode) => {
    onTranslateModeChange(mode);
    setActiveDropdown(null);
  };

  const handleExplainSelect = (type: ExplainType) => {
    onExplain?.(type);
    setActiveDropdown(null);
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
        {/* Main Translate Button - shows current mode icon */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={handleMainTranslateClick}
          title={translateMode === 'inline' ? 'Replace inline' : 'Translate in popup'}
          type="button"
        >
          <CurrentModeIcon size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Translate Mode Dropdown Button */}
        <div
          className="relative"
          onMouseEnter={() => handleDropdownHoverEnter('translate')}
          onMouseLeave={handleDropdownHoverLeave}
        >
          <button
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-full',
              'hover:bg-white/10',
              'text-white/70',
              'transition-all duration-200',
              'active:scale-90',
              activeDropdown === 'translate' && 'bg-white/20 text-white',
              isMobile ? 'w-9 h-9' : 'w-7 h-7'
            )}
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
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-white/20" />

        {/* Explain Button */}
        <button
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-white/10 text-white',
            'transition-all duration-200 ease-out',
            'active:scale-90',
            isMobile ? 'w-12 h-12' : 'w-10 h-10'
          )}
          onClick={() => handleExplainSelect('eli5')}
          title="Explain"
          type="button"
        >
          <Lightbulb size={isMobile ? 20 : 18} strokeWidth={2.5} />
        </button>

        {/* Explain Dropdown Button */}
        <div
          className="relative"
          onMouseEnter={() => handleDropdownHoverEnter('explain')}
          onMouseLeave={handleDropdownHoverLeave}
        >
          <button
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-full',
              'hover:bg-white/10',
              'text-white/70',
              'transition-all duration-200',
              'active:scale-90',
              activeDropdown === 'explain' && 'bg-white/20 text-white',
              isMobile ? 'w-9 h-9' : 'w-7 h-7'
            )}
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
        </div>

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

      {/* Translate Mode Dropdown Menu */}
      <AnimatePresence>
        {activeDropdown === 'translate' && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-[10000] flex flex-col items-center gap-2"
            style={{
              left: `${x}px`,
              top: `${tooltipTop - 8}px`,
              transform: 'translateX(-50%) translateY(-100%)',
              pointerEvents: 'auto',
            }}
            onMouseEnter={() => handleDropdownHoverEnter('translate')}
            onMouseLeave={handleDropdownHoverLeave}
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
                      'bg-[#11111198] backdrop-blur-sm',
                      'shadow-[0_0_20px_rgba(0,0,0,0.2)]',
                      'hover:bg-[#111111d1]',
                      'transition-all duration-200',
                      'text-white border-none whitespace-nowrap',
                      isSelected && 'ring-2 ring-white/20 bg-[#111111d1]'
                    )}
                    onClick={() => handleTranslateModeSelect(option.mode)}
                    type="button"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explain Dropdown Menu */}
      <AnimatePresence>
        {activeDropdown === 'explain' && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-[10000] flex flex-col items-center gap-2"
            style={{
              left: `${x}px`,
              top: `${tooltipTop - 8}px`,
              transform: 'translateX(-50%) translateY(-100%)',
              pointerEvents: 'auto',
            }}
            onMouseEnter={() => handleDropdownHoverEnter('explain')}
            onMouseLeave={handleDropdownHoverLeave}
          >
            {EXPLAIN_OPTIONS.map((option, index) => {
              const { Icon } = option;

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
                      'bg-[#11111198] backdrop-blur-sm',
                      'shadow-[0_0_20px_rgba(0,0,0,0.2)]',
                      'hover:bg-[#111111d1]',
                      'transition-all duration-200',
                      'text-white border-none whitespace-nowrap'
                    )}
                    onClick={() => handleExplainSelect(option.type)}
                    type="button"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span className="text-sm font-medium">{option.label}</span>
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
