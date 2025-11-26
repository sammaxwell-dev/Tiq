import React, { useState, useRef, useCallback } from 'react';
import { WordHoverDefine } from './WordHoverDefine';

interface TranslatedTextProps {
    text: string;
    fullSentence: string;
    targetLang: string;
    style?: React.CSSProperties;
}

// Debounce hook
function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): [T, () => void] {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]) as T;

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return [debouncedFn, cancel];
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
    text,
    fullSentence,
    targetLang,
    style,
}) => {
    const [hoveredWord, setHoveredWord] = useState<{
        word: string;
        rect: DOMRect;
    } | null>(null);

    const containerRef = useRef<HTMLSpanElement>(null);

    // Debounced hover handler (300ms delay)
    const [handleWordHover, cancelHover] = useDebounce((word: string, rect: DOMRect) => {
        // Only show for words with 2+ characters
        if (word.length >= 2) {
            setHoveredWord({ word, rect });
        }
    }, 300);

    const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        handleWordHover(word, rect);
    };

    const handleMouseLeave = () => {
        cancelHover();
        // Don't close immediately if popup is shown - let popup handle its own close
        if (!hoveredWord) {
            setHoveredWord(null);
        }
    };

    const handleCloseDefine = () => {
        setHoveredWord(null);
    };

    // Split text into words while preserving spaces and punctuation
    const renderWords = () => {
        // Split by word boundaries, keeping separators
        const parts = text.split(/(\s+|[.,!?;:'"()[\]{}])/);
        
        return parts.map((part, index) => {
            // If it's whitespace or punctuation, render as-is
            if (/^\s+$/.test(part) || /^[.,!?;:'"()[\]{}]$/.test(part)) {
                return <span key={index}>{part}</span>;
            }
            
            // If it's an empty string, skip
            if (!part) return null;

            // It's a word - make it hoverable
            return (
                <span
                    key={index}
                    onMouseEnter={(e) => handleMouseEnter(e, part)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        cursor: 'default',
                        borderRadius: '2px',
                        transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseOut={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.backgroundColor = 'transparent';
                    }}
                >
                    {part}
                </span>
            );
        });
    };

    return (
        <>
            <span ref={containerRef} style={style}>
                {renderWords()}
            </span>

            {/* Word Define Popup */}
            {hoveredWord && (
                <WordHoverDefine
                    word={hoveredWord.word}
                    fullSentence={fullSentence}
                    targetLang={targetLang}
                    rect={hoveredWord.rect}
                    onClose={handleCloseDefine}
                />
            )}
        </>
    );
};
