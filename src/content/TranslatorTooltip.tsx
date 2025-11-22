import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  ChevronDown,
  Sparkles,
  MessageSquareText,
  Briefcase,
  Coffee,
  Smile,
  Terminal,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  code2: Terminal,
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
            'flex items-center gap-2 px-3 py-2 rounded-full',
            'hover:bg-white/10',
            'text-white',
            'transition-all duration-200 ease-out',
            'active:scale-95',
            isMobile ? 'px-4 py-3' : 'px-3 py-2'
          )}
          onClick={handleTranslateClick}
          title={`Translate (${currentToneOption.label})`}
          type="button"
        >
          <Languages size={isMobile ? 20 : 18} className="text-white" strokeWidth={2.5} />
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <CurrentToneIcon size={14} className="text-white/80" />
          </div>
        </button>

        {/* Tone Selector Button */}
        <button
          className={cn(
            'flex items-center justify-center w-8 h-8 ml-0.5 rounded-full',
            'hover:bg-white/10',
            'text-white/80',
            'transition-all duration-200',
            'active:scale-90',
            isDropdownOpen && 'bg-white/20 text-white',
            isMobile ? 'w-10 h-10' : 'w-8 h-8'
          )}
          onClick={handleToneToggle}
          title="Select tone"
          type="button"
        >
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown
              size={isMobile ? 18 : 16}
              strokeWidth={2.5}
            />
          </motion.div>
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

      {/* Dropdown Menu - Floating Action Menu Style */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="fixed z-[10000] flex flex-col items-end gap-2"
            style={{
              left: `${x}px`,
              top: `${y + 16}px`, // Position below tooltip
              transform: 'translateX(-50%)', // Centered relative to tooltip
              x: "-50%", // Framer motion handles transform
              pointerEvents: 'auto',
              width: 'max-content',
            }}
          >
            {TONE_OPTIONS.map((option, index) => {
              const Icon = TONE_ICONS[option.value] || MessageSquareText;
              const isSelected = selectedTone === option.value;

              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  className="w-full flex justify-center"
                >
                  <button
                    className={cn(
                      'flex items-center gap-3 px-5 py-3 rounded-full',
                      'bg-[#11111198] backdrop-blur-sm',
                      'shadow-[0_0_20px_rgba(0,0,0,0.2)]',
                      'hover:bg-[#111111d1]',
                      'transition-all duration-200',
                      'text-white border-none',
                      isSelected && 'ring-2 ring-white/20 bg-[#111111d1]'
                    )}
                    onClick={() => handleToneSelect(option.value)}
                    type="button"
                  >
                    <Icon size={18} strokeWidth={2} className="text-white" />
                    <span className="text-sm font-medium text-white">
                      {option.label}
                    </span>
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
