import React from 'react';
import { Languages, Settings, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
    activeTab: 'translate' | 'history' | 'settings';
    onTabChange: (tab: 'translate' | 'history' | 'settings') => void;
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, className }) => {
    const tabs = [
        { id: 'translate' as const, icon: Languages, label: 'Translate' },
        { id: 'history' as const, icon: Clock, label: 'History' },
        { id: 'settings' as const, icon: Settings, label: 'Settings' },
    ];

    return (
        <div className={cn(
            "flex items-center justify-center gap-1 p-1.5 rounded-full mx-auto w-fit",
            "bg-black/5 dark:bg-white/5 backdrop-blur-xl",
            "border border-black/5 dark:border-white/10",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
            className
        )}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium",
                        activeTab === tab.id
                            ? "bg-black dark:bg-white text-white dark:text-black shadow-md"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                >
                    <tab.icon className="w-4 h-4" />
                    <span className={cn(
                        "transition-all duration-300",
                        activeTab === tab.id ? "opacity-100" : "opacity-70"
                    )}>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};
