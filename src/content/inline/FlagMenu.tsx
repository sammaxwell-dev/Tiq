
import React, { useState, useRef } from 'react';
import { Flag } from 'lucide-react';

interface FlagMenuProps {
    onPin: (isPinned: boolean) => void;
    originalText: string;
}

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
        color: isPinned ? '#22c55e' : (isActive ? '#3b82f6' : 'currentColor'),
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
    }),
};

export const FlagMenu: React.FC<FlagMenuProps> = ({
    onPin,
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

    return (
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
    );
};
