import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, ArrowRightLeft, Settings, Sparkles, Pin, PinOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Loader } from '../../components/ui/Loader';
import { cn } from '../../lib/utils';
import { storage } from '../../lib/storage';

interface TranslationModalProps {
  initialText: string;
  onClose: () => void;
  visible: boolean;
  initialTranslation?: string;
}

type TranslationState = 'idle' | 'loading' | 'success' | 'error';

const TranslationModal: React.FC<TranslationModalProps> = ({ initialText, onClose, visible, initialTranslation }) => {
  if (!visible) return null;

  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 225, y: window.innerHeight / 4 });
  const [size, setSize] = useState({ width: 500, height: 'auto' });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, width: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [sourceText, setSourceText] = useState(initialText);
  const [targetText, setTargetText] = useState(initialTranslation || '');
  const [state, setState] = useState<TranslationState>(initialTranslation ? 'success' : 'idle');
  const [targetLang, setTargetLang] = useState('ru');
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    storage.get().then(settings => {
      setTargetLang(settings.targetLang);
      setShowBackdrop(settings.showBackdrop);
    });

    // Handle ESC key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!isPinned) {
        setSourceText(initialText);
        // Only auto-translate if there's no pre-translated content
        if (initialText && visible && !initialTranslation) {
            handleTranslate();
        }
    }
  }, [initialText, visible, initialTranslation]);

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, select, input, textarea, .resizer')) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  // --- Resize Logic ---
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStart.current = {
        x: e.clientX,
        width: size.width
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        requestAnimationFrame(() => {
            setPosition({
                x: e.clientX - dragStartPos.current.x,
                y: e.clientY - dragStartPos.current.y
            });
        });
      } else if (isResizing) {
        requestAnimationFrame(() => {
            const newWidth = Math.max(320, resizeStart.current.width + (e.clientX - resizeStart.current.x));
            setSize(prev => ({ ...prev, width: newWidth }));
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleTranslate = async () => {
    setState('loading');
    try {
        // Check if we are in Chrome Extension environment
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            // Check if extension context is valid
            if (!chrome.runtime?.id) {
                setState('error');
                setTargetText('Extension reloading - please refresh the page');
                return;
            }

            // Timeout wrapper for sendMessage
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), 5000);
            });

            const messagePromise = chrome.runtime.sendMessage({
                type: 'TRANSLATE_REQUEST',
                payload: {
                    text: sourceText,
                    targetLang: targetLang,
                }
            });

            const response = await Promise.race([messagePromise, timeoutPromise]);

            if (!response) {
                setState('error');
                setTargetText('No response from background service');
                return;
            }

            if (response.success) {
                setTargetText(response.data);
                setState('success');
            } else {
                setState('error');
                // Provide user-friendly error messages
                const errorMsg = response.error || '';
                if (errorMsg.includes('API key') || errorMsg.includes('401')) {
                    setTargetText('API key not configured - please open settings');
                } else if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
                    setTargetText('Rate limit exceeded - please try again later');
                } else {
                    setTargetText(`Translation error - ${errorMsg || 'please check API key'}`);
                }
            }
        } else {
            // Dev/Playground fallback
            setTimeout(() => {
                setTargetText("Simulated Translation (Playground): " + sourceText);
                setState('success');
            }, 1000);
        }
    } catch (e: any) {
        console.error(e);
        setState('error');
        if (e?.message === 'timeout') {
            setTargetText('Request timeout - please try again');
        } else {
            setTargetText('Failed to communicate with extension background');
        }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetText);
  };
  
  const togglePin = () => {
      setIsPinned(!isPinned);
  };

  return (
    <>
      {/* Backdrop для закрытия при клике вне модального окна */}
      {showBackdrop && (
        <div
          className="fixed inset-0 z-[9999] bg-black/10 animate-in fade-in"
          onClick={onClose}
          style={{ cursor: 'default' }}
        />
      )}

      {/* Модальное окно */}
      <div
        ref={modalRef}
        className={cn(
          "fixed z-[10000] flex flex-col font-sans text-foreground transition-shadow duration-300 animate-in fade-in zoom-in-95",
          "glass rounded-[2rem] overflow-hidden dark:bg-black/60 dark:border-white/10"
        )}
        style={{
            left: position.x,
            top: position.y,
            width: size.width,
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1), 0 0 20px -10px rgba(0,0,0,0.05)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-move select-none bg-white/30 dark:bg-black/20 backdrop-blur-md border-b border-white/10"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/50 dark:bg-white/10 rounded-lg shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-sm text-foreground/80 dark:text-white/90">Tippr AI</span>
        </div>

        <div className="flex items-center gap-2">
           <Button 
             variant="ghost" 
             size="icon" 
             className={cn("h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10", isPinned ? "text-blue-500" : "text-muted-foreground")}
             onClick={togglePin}
             title={isPinned ? "Unpin window" : "Pin window to keep open"}
           >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/40 dark:hover:bg-white/10 text-muted-foreground" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pt-4 pb-2 flex items-center gap-3">
          <Select className="h-9 bg-white/40 dark:bg-white/5 border-0 shadow-sm text-sm font-medium dark:text-white">
            <option value="auto">Detect Language</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
          </Select>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full hover:bg-white/50 dark:hover:bg-white/10">
            <ArrowRightLeft size={14} className="text-muted-foreground dark:text-white/70" />
          </Button>
          
          <Select
            className="h-9 bg-white/40 dark:bg-white/5 border-0 shadow-sm text-sm font-medium dark:text-white"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="ru">Russian</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </Select>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Source */}
        <div className="space-y-2">
           <label className="text-xs font-medium text-muted-foreground ml-1 dark:text-white/60">Original</label>
           <Textarea
             value={sourceText}
             onChange={(e) => setSourceText(e.target.value)}
             className="min-h-[80px] bg-white/30 dark:bg-white/5 border-transparent focus:bg-white/60 dark:focus:bg-white/10 shadow-inner text-base dark:text-white dark:placeholder:text-white/30"
             placeholder="Enter text..."
           />
        </div>

        {/* Result */}
        <div className="space-y-2 relative">
           <label className="text-xs font-medium text-muted-foreground ml-1 dark:text-white/60">Translation</label>
           <div className={cn(
               "relative min-h-[100px] p-4 rounded-xl transition-all duration-300",
               "bg-blue-50/40 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30"
           )}>
               {state === 'loading' ? (
                 <div className="flex flex-col items-center justify-center h-full py-4 space-y-3">
                   <Loader size={24} className="opacity-70 dark:text-blue-400" />
                   <span className="text-xs text-blue-600/70 dark:text-blue-300/70 animate-pulse">Polishing translation...</span>
                 </div>
               ) : state === 'error' ? (
                 <div className="text-red-500 text-sm">Something went wrong.</div>
               ) : (
                 <div className="text-base text-foreground dark:text-white leading-relaxed selection:bg-blue-200/50 dark:selection:bg-blue-500/30">
                   {targetText || <span className="text-muted-foreground dark:text-white/40 italic opacity-50">Translation will appear here...</span>}
                 </div>
               )}
           </div>
           
           {state === 'success' && (
              <div className="absolute bottom-3 right-3 flex space-x-1">
                 <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 shadow-sm backdrop-blur-sm" 
                    onClick={handleCopy}
                 >
                    <Copy size={14} className="text-foreground/70 dark:text-white/80" />
                 </Button>
              </div>
           )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white/30 dark:bg-black/10 border-t border-white/10 flex justify-between items-center">
        <Button variant="ghost" size="sm" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white">
            <Settings size={14} className="mr-2" /> Settings
        </Button>
        
        <Button 
            onClick={handleTranslate} 
            disabled={state === 'loading'}
            className="bg-black/90 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl px-6"
        >
            {state === 'loading' ? 'Translating...' : 'Translate'}
        </Button>
      </div>
      
      {/* Resizer handle */}
      <div
        className="resizer absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-50 hover:opacity-100 z-50 flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <svg width="10" height="10" viewBox="0 0 6 6" className="fill-gray-400 dark:fill-gray-600 pointer-events-none">
            <path d="M6 6V3L3 6H6ZM2 6L6 2V0L0 6H2Z" />
        </svg>
      </div>
    </div>
    </>
  );
};

export default TranslationModal;
