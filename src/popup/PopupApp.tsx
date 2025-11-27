import { useState, useEffect } from 'react';
import { 
  Copy, 
  Check,
  Trash2,
  Sparkles,
  MessageSquare,
  ChevronDown,
  Zap,
  TrendingUp,
  Globe
} from 'lucide-react';
import { BottomNav } from '../components/ui/BottomNav';
import SettingsTab from '../content/modal/SettingsTab';
import { storage, historyStorage, TranslationHistoryItem, TranslateMode } from '../lib/storage';
import { cn } from '../lib/utils';

// Languages with native names
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
];

const PopupApp = () => {
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'settings'>('translate');
  const [targetLang, setTargetLang] = useState('ru');
  const [translateMode, setTranslateMode] = useState<TranslateMode>('inline');
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    storage.get().then(settings => {
      setTargetLang(settings.targetLang);
      setTranslateMode(settings.translateMode);
      setHasApiKey(!!settings.apiKey);
    });
    historyStorage.get().then(setHistory);
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      historyStorage.get().then(setHistory);
    }
  }, [activeTab]);

  // Calculate stats
  const todayTranslations = history.filter(item => {
    const today = new Date();
    const itemDate = new Date(item.timestamp);
    return itemDate.toDateString() === today.toDateString();
  }).length;

  const totalChars = history.reduce((acc, item) => acc + item.sourceText.length, 0);

  const handleTargetLangChange = async (lang: string) => {
    setTargetLang(lang);
    setShowLangDropdown(false);
    await storage.set({ targetLang: lang });
  };

  const handleModeChange = async (mode: TranslateMode) => {
    setTranslateMode(mode);
    await storage.set({ translateMode: mode });
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClearHistory = async () => {
    await historyStorage.clear();
    setHistory([]);
  };

  const selectedLang = LANGUAGES.find(l => l.code === targetLang);

  return (
    <div className="w-[360px] h-[560px] bg-[#fafafa] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 flex flex-col font-sans overflow-hidden">
      
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Tippr</h1>
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium",
          hasApiKey 
            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
            : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
        )}>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            hasApiKey ? "bg-emerald-500" : "bg-amber-500"
          )} />
          {hasApiKey ? "Ready" : "Setup needed"}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-20">
        {activeTab === 'settings' ? (
          <SettingsTab />
        ) : activeTab === 'history' ? (
          <div className="space-y-3">
            {history.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Clear all
                </button>
              </div>
            )}
            
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-gray-300 dark:text-gray-700 mb-3">
                  <MessageSquare size={32} strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-400">No translations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 transition-colors"
                  >
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mb-1">
                      {item.sourceText}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                      {item.translatedText}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-white/5">
                      <span className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-wide">
                        → {item.targetLang}
                      </span>
                      <button
                        onClick={() => handleCopy(item.translatedText, item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                      >
                        {copiedId === item.id ? (
                          <Check size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Language Selector */}
            <div className="relative">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                Translate to
              </label>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl",
                  "bg-white dark:bg-white/5",
                  "border border-gray-200 dark:border-white/10",
                  "hover:border-gray-300 dark:hover:border-white/20",
                  "transition-all duration-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">{selectedLang?.native}</span>
                  <span className="text-xs text-gray-400">({selectedLang?.name})</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "text-gray-400 transition-transform duration-200",
                    showLangDropdown && "rotate-180"
                  )} 
                />
              </button>
              
              {/* Dropdown */}
              {showLangDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-50 max-h-[220px] overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleTargetLangChange(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left text-sm",
                        "hover:bg-gray-50 dark:hover:bg-white/5",
                        "transition-colors",
                        targetLang === lang.code && "bg-gray-50 dark:bg-white/5"
                      )}
                    >
                      <span className="font-medium">{lang.native}</span>
                      <span className="text-xs text-gray-400">{lang.name}</span>
                      {targetLang === lang.code && (
                        <Check size={14} className="ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mode Toggle */}
            <div>
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleModeChange('inline')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg",
                    "border transition-all duration-200",
                    "text-sm font-medium",
                    translateMode === 'inline'
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                      : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  )}
                >
                  <Sparkles size={14} />
                  Inline
                </button>
                <button
                  onClick={() => handleModeChange('modal')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg",
                    "border transition-all duration-200",
                    "text-sm font-medium",
                    translateMode === 'modal'
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                      : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  )}
                >
                  <MessageSquare size={14} />
                  Popup
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                  <Zap size={12} />
                  <span className="text-[10px] uppercase tracking-wide font-medium">Today</span>
                </div>
                <p className="text-xl font-semibold">{todayTranslations}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-purple-500 mb-1">
                  <TrendingUp size={12} />
                  <span className="text-[10px] uppercase tracking-wide font-medium">Total</span>
                </div>
                <p className="text-xl font-semibold">{history.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                  <Globe size={12} />
                  <span className="text-[10px] uppercase tracking-wide font-medium">Chars</span>
                </div>
                <p className="text-xl font-semibold">{totalChars > 999 ? `${(totalChars/1000).toFixed(1)}k` : totalChars}</p>
              </div>
            </div>

            {/* Quick tip */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                💡 <span className="font-medium">Tip:</span> Select text on any webpage and click the floating tooltip to translate instantly.
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default PopupApp;
