import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Move } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

interface InstantTranslationPopUpProps {
  translation: string;
  position: { x: number; y: number };
  onClose: () => void;
  onCopy: (translation: string) => void;
}

export const InstantTranslationPopUp: React.FC<InstantTranslationPopUpProps> = ({
  translation,
  position,
  onClose,
  onCopy,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, currentX: 0, currentY: 0 });

  // Fade in animation and initial position setup
  useEffect(() => {
    setIsVisible(true);
    // Set initial position with boundary checking
    const popupWidth = 320;
    const popupHeight = 200;
    const padding = 16;

    let adjustedX = position.x;
    let adjustedY = position.y;

    // Check horizontal boundaries
    if (adjustedX + popupWidth > window.innerWidth - padding) {
      adjustedX = window.innerWidth - popupWidth - padding;
    }
    if (adjustedX < padding) {
      adjustedX = padding;
    }

    // Check vertical boundaries
    if (adjustedY + popupHeight > window.innerHeight - padding) {
      adjustedY = position.y - popupHeight - 32; // Show above icon
    }
    if (adjustedY < padding) {
      adjustedY = padding;
    }

    setCurrentPosition({ x: adjustedX, y: adjustedY });
  }, [position]);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node) && !isDragging) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible, onClose, isDragging]);

  // Drag functionality with requestAnimationFrame and direct DOM manipulation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && popupRef.current) {
        // Calculate new position
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;

        // Update DOM directly
        popupRef.current.style.transform = `translate(${newX}px, ${newY}px)`;

        // Store current position in ref for later sync
        dragStartPos.current.currentX = newX;
        dragStartPos.current.currentY = newY;
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Sync final position with React state
        if (typeof dragStartPos.current.currentX === 'number') {
          setCurrentPosition({
            x: dragStartPos.current.currentX,
            y: dragStartPos.current.currentY
          });
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
      currentX: currentPosition.x,
      currentY: currentPosition.y
    };
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      onCopy(translation);
    } catch (err) {
      console.error('Failed to copy translation:', err);
    }
  };

  return (
    <div
      ref={popupRef}
      className={cn(
        "fixed z-50 bg-[#11111198] backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/10 p-4 min-w-[320px] max-w-[400px] select-none",
        !isDragging && "transition-all duration-200 ease-in-out",
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95",
        isDragging ? "cursor-move" : "cursor-default"
      )}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Move className="h-3 w-3 text-white/40" />
          <div className="text-sm font-medium text-white/90">
            Translation
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10 rounded-full"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Translation */}
      <div className="mb-4 max-h-32 overflow-y-auto custom-scrollbar">
        <div className="text-sm text-white/90 leading-relaxed font-medium">
          {translation}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1 text-xs bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
        >
          <Copy className="h-3 w-3 mr-1.5" />
          Copy
        </Button>
      </div>
    </div>
  );
};