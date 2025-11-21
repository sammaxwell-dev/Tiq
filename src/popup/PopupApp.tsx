import { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Loader } from '../components/ui/Loader';
import { BottomNav } from '../components/ui/BottomNav';
import SettingsTab from '../content/modal/SettingsTab';
import { storage } from '../lib/storage';

const PopupApp = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'translate' | 'settings'>('translate');
  const [targetLang, setTargetLang] = useState('ru');

  useEffect(() => {
    storage.get().then(settings => {
      setTargetLang(settings.targetLang);
    });
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);

    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        const response = await chrome.runtime.sendMessage({
          type: 'TRANSLATE_REQUEST',
          payload: {
            text: sourceText,
            targetLang: targetLang,
          }
        });

        if (response && response.success) {
          setTargetText(response.data);
        } else {
          setTargetText(response?.error || 'Error');
        }
      } else {
        setTimeout(() => {
          setTargetText("Translated: " + sourceText);
        }, 800);
      }
    } catch (e) {
      setTargetText("Error: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetText);
  };

  return (
    <div className="w-[360px] h-[600px] bg-[#f0f2f5] dark:bg-[#1a1b1e] text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-400/30 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-purple-400/30 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-foreground dark:text-white">Tippr</span>
          </div>
        </div>
        <div className="p-2 bg-white/40 dark:bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
          <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 z-10 scrollbar-hide">
        {activeTab === 'settings' ? (
          <div className="glass-card rounded-[2rem] p-1 animate-in slide-in-from-right-4 fade-in duration-300">
            <SettingsTab />
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
            {/* Language Selector */}
            <div className="glass rounded-full p-1.5 flex items-center justify-between gap-2 shadow-sm">
              <Select className="border-0 bg-transparent shadow-none h-9 text-sm font-medium focus:ring-0 text-center">
                <option value="auto">Detect Language</option>
                <option value="en">English</option>
              </Select>
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center shrink-0">
                <ArrowRightLeft size={14} className="text-muted-foreground" />
              </div>
              <Select
                className="border-0 bg-transparent shadow-none h-9 text-sm font-medium focus:ring-0 text-center"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="ru">Russian</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <Textarea
                placeholder="What would you like to translate?"
                className="min-h-[140px] resize-none bg-white/60 dark:bg-black/20 border-0 shadow-sm focus:ring-0 focus:bg-white/80 dark:focus:bg-black/40 transition-all text-base p-5 rounded-[1.5rem] backdrop-blur-sm placeholder:text-muted-foreground/50"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>

            {/* Translate Button */}
            <Button
              onClick={handleTranslate}
              disabled={loading || !sourceText}
              className="w-full rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 font-semibold text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Translating...</span>
                </div>
              ) : (
                'Translate'
              )}
            </Button>

            {/* Result Area */}
            {(targetText || loading) && (
              <div className="relative p-5 bg-white/70 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-[1.5rem] min-h-[120px] shadow-sm backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-500">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full py-4 space-y-3 opacity-50">
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full w-3/4 animate-pulse" />
                      <div className="h-2 bg-gray-200 rounded-full w-1/2 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <p className="text-base text-foreground leading-relaxed font-medium">{targetText}</p>
                )}
                {!loading && targetText && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/50 hover:bg-white shadow-sm transition-all"
                  >
                    <Copy size={14} className="text-foreground/70" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default PopupApp;
