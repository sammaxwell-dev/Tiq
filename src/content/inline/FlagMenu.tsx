
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Flag,
    BookOpen,
    Baby
} from 'lucide-react';

interface FlagMenuProps {
    onPin: (isPinned: boolean) => void;
    onExplain: (type: 'eli5' | 'term') => void;
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

export const FlagMenu: React.FC<FlagMenuProps> = ({
    onPin,
    onExplain
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0, openUpward: false });
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const flagRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
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
            
            if (clickedOutsideFlag && clickedOutsideMenu) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Use capture phase to catch events before they bubble
            document.addEventListener('mousedown', handleClickOutside, true);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, [isOpen]);

    // Click on flag toggles pin
    const handleFlagClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newPinnedState = !isPinned;
        setIsPinned(newPinnedState);
        onPin(newPinnedState);
    };

    const handleExplain = (type: 'eli5' | 'term') => {
        onExplain(type);
        setIsOpen(false);
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
        </>
    );
};
