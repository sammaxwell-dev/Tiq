import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Moon, Sun, Monitor, Key, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { storage, AppSettings } from '../../lib/storage';
import { cn } from '../../lib/utils';

const SettingsTab = () => {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [key, setKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        storage.get().then(s => {
            setSettings(s);
            setKey(s.apiKey);
        });
    }, []);

    const updateSetting = async (key: keyof AppSettings, value: any) => {
        if (!settings) return;
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await storage.set({ [key]: value });
    };

    const handleSaveKey = async () => {
        setStatus('checking');
        setErrorMsg('');

        if (!key.trim()) {
            setStatus('invalid');
            setErrorMsg('Key cannot be empty');
            return;
        }

        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                const response = await chrome.runtime.sendMessage({
                    type: 'VALIDATE_API_KEY',
                    payload: { key }
                });

                if (response && response.success) {
                    setStatus('valid');
                    await updateSetting('apiKey', key);
                } else {
                    setStatus('invalid');
                    setErrorMsg(response?.error || 'Invalid API Key');
                }
            } else {
                // Dev fallback
                setTimeout(() => {
                    if (key.startsWith('sk-')) {
                        setStatus('valid');
                        updateSetting('apiKey', key);
                    } else {
                        setStatus('invalid');
                        setErrorMsg('Dev: Key must start with sk-');
                    }
                }, 1000);
            }
        } catch (e) {
            setStatus('invalid');
            setErrorMsg('Failed to validate key');
        }
    };

    if (!settings) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="flex flex-col h-full overflow-y-auto p-6 space-y-8">

            {/* Appearance */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Monitor size={14} /> Appearance
                </h3>
                <div className="bg-white/50 dark:bg-white/5 rounded-xl p-1 flex gap-1 border border-gray-200 dark:border-white/10">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                        <button
                            key={theme}
                            onClick={() => updateSetting('theme', theme)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                settings.theme === theme
                                    ? "bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                            )}
                        >
                            {theme === 'light' && <Sun size={16} />}
                            {theme === 'dark' && <Moon size={16} />}
                            {theme === 'system' && <Monitor size={16} />}
                            <span className="capitalize">{theme}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* AI Configuration */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Key size={14} /> AI Configuration
                </h3>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground dark:text-gray-200">API Key</label>
                    <div className="flex gap-2">
                        <Input
                            type={isVisible ? "text" : "password"}
                            placeholder="sk-..."
                            value={key}
                            onChange={(e) => {
                                setKey(e.target.value);
                                setStatus('idle');
                            }}
                            className={cn(
                                "bg-white/50 dark:bg-white/5",
                                status === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        <Button variant="outline" size="icon" onClick={() => setIsVisible(!isVisible)} className="shrink-0">
                            {isVisible ? <span className="text-xs">Hide</span> : <span className="text-xs">Show</span>}
                        </Button>
                    </div>

                    {status === 'invalid' && (
                        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                            <XCircle size={12} /> {errorMsg}
                        </p>
                    )}
                    {status === 'valid' && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 animate-in slide-in-from-top-1">
                            <CheckCircle size={12} /> Verified & Saved
                        </p>
                    )}

                    <Button
                        onClick={handleSaveKey}
                        disabled={status === 'checking' || !key}
                        className="w-full"
                        variant={status === 'valid' ? 'outline' : 'default'}
                    >
                        {status === 'checking' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {status === 'checking' ? 'Verifying...' : 'Verify & Save Key'}
                    </Button>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground dark:text-gray-200">Model</label>
                    <Select
                        value={settings.model}
                        onChange={(e) => updateSetting('model', e.target.value)}
                        className="bg-white/50 dark:bg-white/5"
                    >
                        <option value="gpt-4o-mini">GPT-4o mini (Recommended)</option>
                        <option value="gpt-4o">GPT-4o (Best Quality)</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                    </Select>
                </div>
            </section>

            {/* Behavior */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} /> Behavior
                </h3>

                <div className="space-y-4 bg-white/30 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium text-foreground dark:text-gray-200">Instant Translation</div>
                            <div className="text-xs text-muted-foreground">Translate immediately on click</div>
                        </div>
                        <Switch
                            checked={settings.instantTranslation}
                            onChange={(e) => updateSetting('instantTranslation', e.target.checked)}
                        />
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-white/10" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="text-sm font-medium text-foreground dark:text-gray-200">Show Backdrop</div>
                            <div className="text-xs text-muted-foreground">Dim background when open</div>
                        </div>
                        <Switch
                            checked={settings.showBackdrop}
                            onChange={(e) => updateSetting('showBackdrop', e.target.checked)}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default SettingsTab;
