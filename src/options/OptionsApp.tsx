import React, { useState } from 'react';
import { Settings, Key, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import GeneralSection from './sections/GeneralSection';
import OpenAISection from './sections/OpenAISection';

type Tab = 'general' | 'openai' | 'appearance';

const OptionsApp = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const renderContent = () => {
    switch (activeTab) {
        case 'general': return <GeneralSection />;
        case 'openai': return <OpenAISection />;
        case 'appearance': return <div className="p-4">Appearance Settings (Coming Soon)</div>;
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-xl tracking-tight">Tippr</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
            <SidebarItem 
                icon={<Settings size={18} />} 
                label="General" 
                active={activeTab === 'general'} 
                onClick={() => setActiveTab('general')} 
            />
            <SidebarItem 
                icon={<Key size={18} />} 
                label="OpenAI" 
                active={activeTab === 'openai'} 
                onClick={() => setActiveTab('openai')} 
            />
            <SidebarItem 
                icon={<Monitor size={18} />} 
                label="Appearance" 
                active={activeTab === 'appearance'} 
                onClick={() => setActiveTab('appearance')} 
            />
        </nav>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
            Version 0.0.1
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            active 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default OptionsApp;

