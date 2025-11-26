import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, Copy, Check, Loader2 } from 'lucide-react';

interface WordHoverDefineProps {
    word: string;
    fullSentence: string;
    targetLang: string;
    rect: DOMRect;
    onClose: () => void;
}

interface DefinitionState {
    content: string;
    loading: boolean;
    error: string | null;
}

const styles = {
    // Floating button above word - matching TranslatorTooltip style
    floatingButton: {
        position: 'fixed' as const,
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '9999px', // pill shape like tooltip
        backgroundColor: 'rgba(17, 17, 17, 0.6)', // #11111198 - same as tooltip
        backdropFilter: 'blur(4px)', // backdrop-blur-sm
        WebkitBackdropFilter: 'blur(4px)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', // same shadow as tooltip
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    floatingButtonHover: {
        backgroundColor: 'rgba(17, 17, 17, 0.82)', // #111111d1 - hover state
        transform: 'scale(1.1)',
    },
    // Popup container - matching TranslatorTooltip/FlagMenu style
    popupContainer: {
        position: 'fixed' as const,
        zIndex: 10002,
        maxWidth: '320px',
        minWidth: '220px',
        backgroundColor: 'rgba(17, 17, 17, 0.6)', // #11111198 - same as tooltip
        backdropFilter: 'blur(4px)', // backdrop-blur-sm
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: '16px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', // same shadow as tooltip
        border: 'none',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        pointerEvents: 'auto' as const,
        overflow: 'hidden',
    },
    popupHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        gap: '8px',
    },
    popupTitle: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2px',
    },
    popupTitleMain: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    popupTitleWord: {
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 400,
    },
    popupActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    popupIconButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    popupContent: {
        padding: '16px',
        fontSize: '14px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.85)',
        maxHeight: '250px',
        overflowY: 'auto' as const,
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '8px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
    },
};

// Calculate safe position for popup
function calculatePopupPosition(
    rect: DOMRect,
    popupWidth: number = 320,
    popupHeight: number = 200
): { x: number; y: number } {
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Position below the word by default
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    let y = rect.bottom + 8;
    
    // If would go off right edge
    if (x + popupWidth > viewportWidth - padding) {
        x = viewportWidth - popupWidth - padding;
    }
    
    // If would go off left edge
    if (x < padding) {
        x = padding;
    }
    
    // If would go off bottom, show above
    if (y + popupHeight > viewportHeight - padding) {
        y = rect.top - popupHeight - 8;
    }
    
    // Ensure y doesn't go off top
    if (y < padding) {
        y = padding;
    }
    
    return { x, y };
}

export const WordHoverDefine: React.FC<WordHoverDefineProps> = ({
    word,
    fullSentence,
    targetLang,
    rect,
    onClose,
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [copied, setCopied] = useState(false);
    const [definition, setDefinition] = useState<DefinitionState | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Button position - above the word
    const buttonX = rect.left + rect.width / 2 - 14;
    const buttonY = rect.top - 36;

    // Popup position
    const popupPos = calculatePopupPosition(rect);

    // Auto-hide button when mouse leaves (with 2 second delay)
    const handleButtonMouseLeave = () => {
        setIsButtonHovered(false);
        // Only auto-close if popup is not shown
        if (!showPopup) {
            hideTimeoutRef.current = setTimeout(() => {
                onClose();
            }, 2000); // 2 seconds
        }
    };

    const handleButtonMouseEnter = () => {
        setIsButtonHovered(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target;
            if (!target || !(target instanceof Node)) return;
            
            if (popupRef.current && !popupRef.current.contains(target)) {
                onClose();
            }
        };

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside, true);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, [showPopup, onClose]);

    const handleButtonClick = async () => {
        setShowPopup(true);
        setDefinition({ content: '', loading: true, error: null });

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'TRANSLATE_REQUEST',
                payload: {
                    text: `Word: "${word}"\nFull sentence context: "${fullSentence}"`,
                    targetLang,
                    mode: 'define-context'
                }
            });

            if (response.success) {
                setDefinition({
                    content: response.data,
                    loading: false,
                    error: null,
                });
            } else {
                setDefinition({
                    content: '',
                    loading: false,
                    error: response.error || 'Failed to get definition',
                });
            }
        } catch (error) {
            setDefinition({
                content: '',
                loading: false,
                error: 'Network error occurred',
            });
        }
    };

    const handleCopy = async () => {
        if (definition?.content) {
            try {
                await navigator.clipboard.writeText(definition.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return createPortal(
        <>
            {/* Floating Define Button */}
            {!showPopup && (
                <div
                    ref={buttonRef}
                    style={{
                        ...styles.floatingButton,
                        left: `${buttonX}px`,
                        top: `${buttonY}px`,
                        ...(isButtonHovered ? styles.floatingButtonHover : {}),
                    }}
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                    onClick={handleButtonClick}
                    title="Define in context"
                >
                    <BookOpen size={14} />
                </div>
            )}

            {/* Definition Popup */}
            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        ...styles.popupContainer,
                        left: `${popupPos.x}px`,
                        top: `${popupPos.y}px`,
                    }}
                >
                    {/* Header */}
                    <div style={styles.popupHeader}>
                        <div style={styles.popupTitle}>
                            <div style={styles.popupTitleMain}>
                                <BookOpen size={16} />
                                <span>Definition in context</span>
                            </div>
                            <span style={styles.popupTitleWord}>"{word}"</span>
                        </div>
                        <div style={styles.popupActions}>
                            {!definition?.loading && definition?.content && (
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        ...styles.popupIconButton,
                                        color: copied ? '#22c55e' : 'rgba(255, 255, 255, 0.6)',
                                    }}
                                    title="Copy to clipboard"
                                    type="button"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                style={styles.popupIconButton}
                                title="Close"
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Content */}
                    {definition?.loading ? (
                        <div style={styles.loadingContainer}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Analyzing context...</span>
                        </div>
                    ) : definition?.error ? (
                        <div style={{ ...styles.popupContent, color: '#f87171' }}>
                            {definition.error}
                        </div>
                    ) : (
                        <div style={styles.popupContent}>
                            {definition?.content}
                        </div>
                    )}
                </div>
            )}

            {/* Inject keyframes for spinner */}
            {definition?.loading && (
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            )}
        </>,
        document.body
    );
};
