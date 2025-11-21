import { useState } from 'react';
import { Settings, ArrowRightLeft, Copy, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Loader } from '../components/ui/Loader';

const PopupApp = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
             const response = await chrome.runtime.sendMessage({
                type: 'TRANSLATE_REQUEST',
                payload: {
                    text: sourceText,
                    targetLang: 'ru', // TODO: bind to select
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

  const openOptions = () => {
    if (chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('src/options/index.html'));
    }
  };

  return (
    <div className="w-[360px] min-h-[500px] bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[200px] h-[200px] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 z-10 bg-white/50 backdrop-blur-sm border-b border-white/20 sticky top-0">
        <div className="flex items-center gap-2">
           <div className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center shadow-md">
                <Sparkles size={14} />
           </div>
           <span className="font-semibold text-lg tracking-tight">Tippr</span>
        </div>
        <Button variant="ghost" size="icon" onClick={openOptions} className="h-8 w-8 rounded-full hover:bg-black/5">
          <Settings size={18} />
        </Button>
      </header>

      {/* Controls */}
      <div className="p-4 z-10 space-y-4">
        <div className="glass-card p-2 rounded-2xl flex items-center justify-between gap-2">
          <Select className="border-0 bg-transparent shadow-none h-8 text-xs font-medium focus:ring-0">
             <option value="auto">Detect</option>
             <option value="en">English</option>
          </Select>
          <div className="w-px h-4 bg-border" />
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-black/5 shrink-0">
             <ArrowRightLeft size={12} />
          </Button>
          <div className="w-px h-4 bg-border" />
          <Select className="border-0 bg-transparent shadow-none h-8 text-xs font-medium focus:ring-0">
             <option value="ru">Russian</option>
             <option value="en">English</option>
          </Select>
        </div>
      
        {/* Main Body */}
         <Textarea
            placeholder="What would you like to translate?"
            className="min-h-[120px] resize-none bg-white/50 border-0 shadow-inner focus:ring-0 focus:bg-white/80 transition-all text-base p-4 rounded-2xl"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
         />

         <div className="flex justify-end">
            <Button 
                onClick={handleTranslate} 
                disabled={loading || !sourceText}
                className="w-full rounded-xl bg-black text-white hover:bg-black/90 h-11 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
                {loading ? 'Translating...' : 'Translate'}
            </Button>
         </div>

         {(targetText || loading) && (
             <div className="relative p-4 bg-blue-50/50 border border-blue-100 rounded-2xl min-h-[100px] animate-in slide-in-from-bottom-2 fade-in">
                 {loading ? (
                     <div className="flex justify-center py-4"><Loader size={24} /></div>
                 ) : (
                     <p className="text-sm text-foreground leading-relaxed">{targetText}</p>
                 )}
                 {!loading && targetText && (
                     <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 rounded-lg hover:bg-blue-100/50 text-blue-600">
                        <Copy size={14} />
                     </Button>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};

export default PopupApp;
