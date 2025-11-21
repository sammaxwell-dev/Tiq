import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useSettings } from '../../hooks/useSettings';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const OpenAISection = () => {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  
  const [key, setKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!settingsLoading) {
        setKey(settings.apiKey);
        setModel(settings.model);
    }
  }, [settings, settingsLoading]);

  const handleSave = async () => {
    setStatus('checking');
    setErrorMsg('');

    if (!key.trim()) {
        setStatus('invalid');
        setErrorMsg('Key cannot be empty');
        return;
    }

    try {
        // Send validation request to background
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            const response = await chrome.runtime.sendMessage({
                type: 'VALIDATE_API_KEY',
                payload: { key }
            });

            if (response && response.success) {
                setStatus('valid');
                await updateSettings({ apiKey: key, model: model as any });
            } else {
                setStatus('invalid');
                setErrorMsg(response?.error || 'Invalid API Key');
            }
        } else {
            // Dev fallback
            setTimeout(() => {
                if (key.startsWith('sk-')) {
                    setStatus('valid');
                    updateSettings({ apiKey: key, model: model as any });
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

  if (settingsLoading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">OpenAI Configuration</h2>
        <p className="text-sm text-gray-500 mb-4">Manage your API key and model settings.</p>

        <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <div className="flex gap-2">
                    <Input 
                        type={isVisible ? "text" : "password"} 
                        placeholder="sk-..." 
                        value={key}
                        onChange={(e) => {
                            setKey(e.target.value);
                            setStatus('idle');
                        }}
                        className={status === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <Button variant="outline" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? 'Hide' : 'Show'}
                    </Button>
                </div>
                
                {status === 'invalid' && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle size={12} /> {errorMsg}
                    </p>
                )}
                {status === 'valid' && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> API Key verified and saved!
                    </p>
                )}
                
                <p className="text-xs text-gray-500">Your key is stored locally and never shared.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Model</label>
                <Select value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="gpt-4o-mini">GPT-4o mini (Recommended)</option>
                    <option value="gpt-4o">GPT-4o (Best Quality)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Legacy)</option>
                </Select>
            </div>
            
            <div className="pt-2">
                <Button onClick={handleSave} disabled={status === 'checking' || !key}>
                    {status === 'checking' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {status === 'checking' ? 'Verifying...' : 'Verify & Save Key'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAISection;
