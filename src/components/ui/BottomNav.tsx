import React from 'react';
import { Languages, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
    activeTab: 'translate' | 'settings';
    onTabChange: (tab: 'translate' | 'settings') => void;
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, className }) => {
    return (
        <div className={cn("flex items-center justify-center gap-1 p-1.5 glass rounded-full mx-auto w-fit shadow-lg backdrop-blur-xl bg-white/80 dark:bg-black/80 border border-white/20", className)}>
            <button
                onClick={() => onTabChange('translate')}
                className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium relative overflow-hidden",
                    activeTab === 'translate'
                        ? "bg-black text-white shadow-md scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                )}
            >
                <Languages className="w-4 h-4" />
                <span>Translate</span>
            </button>
            <button
                onClick={() => onTabChange('settings')}
                className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium",
                    activeTab === 'settings'
                        ? "bg-black text-white shadow-md scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                )}
            >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
            </button>
        </div>
    );
};
