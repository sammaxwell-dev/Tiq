
import React, { useState, useRef } from 'react';
import { Undo2 } from 'lucide-react';

interface FlagMenuProps {
    onPin: (isPinned: boolean) => void;
    originalText: string;
    isContainerHovered?: boolean;
}

const styles = {
    flagContainer: (isVisible: boolean) => ({
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        cursor: 'pointer',
        marginRight: isVisible ? '4px' : '0px',
        width: isVisible ? 'auto' : '0px',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.2s ease, transform 0.2s ease, margin-right 0.2s ease, width 0.2s ease',
        pointerEvents: isVisible ? 'auto' as const : 'none' as const,
    }),
    flagIcon: (isActive: boolean, isPinned: boolean) => ({
        transition: 'all 0.2s ease',
        opacity: 1,
        color: isPinned ? '#22c55e' : (isActive ? '#3b82f6' : '#64748b'),
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }),
};

export const FlagMenu: React.FC<FlagMenuProps> = ({
    onPin,
    isContainerHovered = false,
}) => {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const flagRef = useRef<HTMLDivElement>(null);

    const handleFlagClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newPinnedState = !isPinned;
        setIsPinned(newPinnedState);
        onPin(newPinnedState);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const isActive = isHovered || isPinned;
    const shouldBeVisible = isContainerHovered || isPinned;

    return (
        <div
            ref={flagRef}
            style={styles.flagContainer(shouldBeVisible)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleFlagClick}
            title={isPinned ? "Показать перевод" : "Показать оригинал"}
        >
            <div style={styles.flagIcon(isActive, isPinned)}>
                <Undo2
                    size={14}
                    strokeWidth={2.5}
                />
            </div>
        </div>
    );
};
