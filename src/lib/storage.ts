import { TranslationTone } from '../types/tone';

export interface AppSettings {
  apiKey: string;
  targetLang: string;
  model: string; // Changed from strict union to string to allow flexibility and future models
  theme: 'light' | 'dark' | 'system';
  showBackdrop: boolean;
  instantTranslation: boolean;
  translationTone: TranslationTone;
}

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  targetLang: 'ru',
  model: 'gpt-4o-mini', // Default to the efficient modern model
  theme: 'system',
  showBackdrop: false,
  instantTranslation: false,
  translationTone: 'standard',
};

export const storage = {
  get: async (): Promise<AppSettings> => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        // Fallback for dev environment
        const local = localStorage.getItem('tippr_settings');
        return local ? { ...DEFAULT_SETTINGS, ...JSON.parse(local) } : DEFAULT_SETTINGS;
    }
    
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    return result as AppSettings;
  },

  set: async (settings: Partial<AppSettings>): Promise<void> => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
         const current = localStorage.getItem('tippr_settings');
         const parsed = current ? JSON.parse(current) : DEFAULT_SETTINGS;
         localStorage.setItem('tippr_settings', JSON.stringify({ ...parsed, ...settings }));
         return;
    }
    
    await chrome.storage.sync.set(settings);
  },

  // Watch for changes
  onChange: (callback: (settings: AppSettings) => void) => {
    if (typeof chrome === 'undefined' || !chrome.storage) return () => {};

    const listener = (_changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync') {
         storage.get().then(callback);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }
};
