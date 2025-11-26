
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Flag,
    BookOpen,
    Baby,
    X,
    Copy,
    Check,
    Loader2
} from 'lucide-react';

interface FlagMenuProps {
    onPin: (isPinned: boolean) => void;
    originalText: string;
}

type ExplainType = 'eli5' | 'term';

interface ExplanationState {
    type: ExplainType;
    content: string;
    loading: boolean;
    error: string | null;
}

const MENU_OPTIONS = [
    { type: 'eli5' as const, label: 'Explain like I\'m 5', Icon: Baby },
    { type: 'term' as const, label: 'Define term', Icon: BookOpen },
];

// Matching TranslatorTooltip styles exactly
// bg-[#11111198] = rgba(17, 17, 17, 0.6)
// shadow-[0_0_20px_rgba(0,0,0,0.2)]
// hover:bg-[#111111d1] = rgba(17, 17, 17, 0.82)
const styles = {
    flagContainer: {
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        cursor: 'pointer',
        marginRight: '4px',
    },
    flagIcon: (isActive: boolean, isPinned: boolean) => ({
        transition: 'all 0.2s ease',
        opacity: isActive ? 1 : 0.6,
        color: isPinned ? '#22c55e' : (isActive ? '#3b82f6' : 'currentColor'), // green when pinned
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }),
    menuContainer: {
        position: 'fixed' as const,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'auto' as const,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    // Matching TranslatorTooltip button styles
    menuButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px', // px-5 py-3 equivalent
        borderRadius: '9999px',
        backgroundColor: 'rgba(17, 17, 17, 0.6)', // #11111198
        backdropFilter: 'blur(4px)', // backdrop-blur-sm
        WebkitBackdropFilter: 'blur(4px)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', // shadow-[0_0_20px_rgba(0,0,0,0.2)]
        border: 'none',
        color: 'white',
        fontSize: '14px',
        fontWeight: 500,
        whiteSpace: 'nowrap' as const,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
    },
    menuButtonHover: {
        backgroundColor: 'rgba(17, 17, 17, 0.82)', // #111111d1
    },
    // Explanation popup styles
    popupContainer: {
        position: 'fixed' as const,
        zIndex: 10001,
        maxWidth: '320px',
        minWidth: '200px',
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        gap: '8px',
    },
    popupTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.9)',
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
        maxHeight: '300px',
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

// Calculate safe menu position within viewport
function calculateMenuPosition(
    flagRect: DOMRect,
    menuHeight: number = 120 // approximate height for 2 buttons now
): { x: number; y: number; openUpward: boolean } {
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = flagRect.left + flagRect.width / 2;
    let y = flagRect.bottom + 8;
    let openUpward = false;
    
    // Check if menu would go below viewport
    if (y + menuHeight > viewportHeight - padding) {
        // Open upward instead
        y = flagRect.top - 8;
        openUpward = true;
    }
    
    // Ensure x doesn't go off screen (menu is ~180px wide, centered)
    const menuHalfWidth = 90;
    if (x - menuHalfWidth < padding) {
        x = menuHalfWidth + padding;
    } else if (x + menuHalfWidth > viewportWidth - padding) {
        x = viewportWidth - menuHalfWidth - padding;
    }
    
    return { x, y, openUpward };
}

// Calculate popup position (larger, so different logic)
function calculatePopupPosition(
    flagRect: DOMRect,
    popupWidth: number = 320,
    popupHeight: number = 200
): { x: number; y: number } {
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Try to position to the right of the flag first
    let x = flagRect.right + 8;
    let y = flagRect.top;
    
    // If would go off right edge, position to the left
    if (x + popupWidth > viewportWidth - padding) {
        x = flagRect.left - popupWidth - 8;
    }
    
    // If would go off left edge, center it
    if (x < padding) {
        x = Math.max(padding, (viewportWidth - popupWidth) / 2);
    }
    
    // Ensure y doesn't go off bottom
    if (y + popupHeight > viewportHeight - padding) {
        y = viewportHeight - popupHeight - padding;
    }
    
    // Ensure y doesn't go off top
    if (y < padding) {
        y = padding;
    }
    
    return { x, y };
}

export const FlagMenu: React.FC<FlagMenuProps> = ({
    onPin,
    originalText
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, openUpward: false });
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Explanation popup state
    const [explanation, setExplanation] = useState<ExplanationState | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    
    const flagRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate menu position and animate when opening
    useEffect(() => {
        if (isOpen && flagRef.current) {
            const rect = flagRef.current.getBoundingClientRect();
            const position = calculateMenuPosition(rect);
            setMenuPosition(position);
            // Trigger animation after position is set
            requestAnimationFrame(() => {
                setMenuVisible(true);
            });
        } else {
            setMenuVisible(false);
        }
    }, [isOpen]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target;
            
            // Check if target is a valid Node
            if (!target || !(target instanceof Node)) {
                return;
            }
            
            const clickedOutsideFlag = !flagRef.current || !flagRef.current.contains(target);
            const clickedOutsideMenu = !menuRef.current || !menuRef.current.contains(target);
            const clickedOutsidePopup = !popupRef.current || !popupRef.current.contains(target);
            
            if (clickedOutsideFlag && clickedOutsideMenu) {
                setIsOpen(false);
            }
            
            // Close popup if clicked outside
            if (clickedOutsidePopup && clickedOutsideFlag) {
                setExplanation(null);
            }
        };

        if (isOpen || explanation) {
            // Use capture phase to catch events before they bubble
            document.addEventListener('mousedown', handleClickOutside, true);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, [isOpen, explanation]);

    // Click on flag toggles pin
    const handleFlagClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newPinnedState = !isPinned;
        setIsPinned(newPinnedState);
        onPin(newPinnedState);
    };

    const handleExplain = async (type: ExplainType) => {
        setIsOpen(false);
        
        // Calculate popup position
        if (flagRef.current) {
            const rect = flagRef.current.getBoundingClientRect();
            setPopupPosition(calculatePopupPosition(rect));
        }
        
        // Set loading state
        setExplanation({
            type,
            content: '',
            loading: true,
            error: null,
        });
        
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'TRANSLATE_REQUEST',
                payload: {
                    text: originalText,
                    targetLang: 'English', // Explanations are in user's language
                    mode: type === 'eli5' ? 'explain' : 'define'
                }
            });
            
            if (response.success) {
                setExplanation({
                    type,
                    content: response.data,
                    loading: false,
                    error: null,
                });
            } else {
                setExplanation({
                    type,
                    content: '',
                    loading: false,
                    error: response.error || 'Failed to get explanation',
                });
            }
        } catch (error) {
            setExplanation({
                type,
                content: '',
                loading: false,
                error: 'Network error occurred',
            });
        }
    };

    const handleClosePopup = () => {
        setExplanation(null);
    };

    const handleCopyExplanation = async () => {
        if (explanation?.content) {
            try {
                await navigator.clipboard.writeText(explanation.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        // Delay closing to allow moving to menu
        hoverTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleMenuMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleMenuMouseLeave = () => {
        // Delay closing to allow moving back to flag
        hoverTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const isActive = isOpen || isPinned;

    return (
        <>
            {/* Flag Icon - inline positioned, click to toggle pin */}
            <div
                ref={flagRef}
                style={styles.flagContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleFlagClick}
                title={isPinned ? "Click to show translation" : "Click to show original"}
            >
                <div style={styles.flagIcon(isActive, isPinned)}>
                    <Flag 
                        size={16} 
                        strokeWidth={2.5} 
                        style={{ fill: isPinned ? 'currentColor' : 'none' }}
                    />
                </div>
            </div>

            {/* Floating Menu - rendered via portal (only Explain options) */}
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        ...styles.menuContainer,
                        left: `${menuPosition.x}px`,
                        top: `${menuPosition.y}px`,
                        transform: `translateX(-50%) translateY(${menuPosition.openUpward ? '-100%' : '0'})`,
                        opacity: menuVisible ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    onMouseEnter={handleMenuMouseEnter}
                    onMouseLeave={handleMenuMouseLeave}
                >
                    {/* Menu items - reverse order if opening upward */}
                    {(menuPosition.openUpward ? [...MENU_OPTIONS].reverse() : MENU_OPTIONS).map((option, index) => {
                        const { Icon } = option;
                        const buttonId = option.type;
                        const animDelay = menuPosition.openUpward 
                            ? (MENU_OPTIONS.length - 1 - index) * 0.05 
                            : index * 0.05;
                        return (
                            <button
                                key={option.type}
                                onClick={() => handleExplain(option.type)}
                                onMouseEnter={() => setHoveredButton(buttonId)}
                                onMouseLeave={() => setHoveredButton(null)}
                                style={{
                                    ...styles.menuButton,
                                    ...(hoveredButton === buttonId ? styles.menuButtonHover : {}),
                                    opacity: menuVisible ? 1 : 0,
                                    transform: `translateY(${menuVisible ? '0' : (menuPosition.openUpward ? '-10px' : '10px')})`,
                                    transition: `all 0.3s ease ${animDelay}s`,
                                }}
                                type="button"
                            >
                                <Icon size={18} strokeWidth={2} style={{ color: 'white' }} />
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}

            {/* Explanation Popup */}
            {explanation && createPortal(
                <div
                    ref={popupRef}
                    style={{
                        ...styles.popupContainer,
                        left: `${popupPosition.x}px`,
                        top: `${popupPosition.y}px`,
                    }}
                >
                    {/* Header */}
                    <div style={styles.popupHeader}>
                        <div style={styles.popupTitle}>
                            {explanation.type === 'eli5' ? (
                                <>
                                    <Baby size={16} />
                                    <span>Simple Explanation</span>
                                </>
                            ) : (
                                <>
                                    <BookOpen size={16} />
                                    <span>Definition</span>
                                </>
                            )}
                        </div>
                        <div style={styles.popupActions}>
                            {!explanation.loading && explanation.content && (
                                <button
                                    onClick={handleCopyExplanation}
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
                                onClick={handleClosePopup}
                                style={styles.popupIconButton}
                                title="Close"
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Content */}
                    {explanation.loading ? (
                        <div style={styles.loadingContainer}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            <span>Thinking...</span>
                        </div>
                    ) : explanation.error ? (
                        <div style={{ ...styles.popupContent, color: '#f87171' }}>
                            {explanation.error}
                        </div>
                    ) : (
                        <div style={styles.popupContent}>
                            {explanation.content}
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Inject keyframes for spinner */}
            {explanation?.loading && createPortal(
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>,
                document.head
            )}
        </>
    );
};
