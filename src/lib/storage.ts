import { TranslationTone } from '../types/tone';

export type TranslateMode = 'modal' | 'inline';

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface AppSettings {
  apiKey: string;
  targetLang: string;
  model: string; // Changed from strict union to string to allow flexibility and future models
  theme: 'light' | 'dark' | 'system';
  showBackdrop: boolean;
  instantTranslation: boolean;
  translationTone: TranslationTone;
  translateMode: TranslateMode;
}

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  targetLang: 'ru',
  model: 'gpt-4o-mini', // Default to the efficient modern model
  theme: 'system',
  showBackdrop: false,
  instantTranslation: false,
  translationTone: 'standard',
  translateMode: 'inline',
};

const MAX_HISTORY_ITEMS = 50;

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

// History storage (uses local storage, not sync)
export const historyStorage = {
  get: async (): Promise<TranslationHistoryItem[]> => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      const local = localStorage.getItem('tippr_history');
      return local ? JSON.parse(local) : [];
    }
    
    const result = await chrome.storage.local.get({ history: [] });
    return result.history as TranslationHistoryItem[];
  },

  add: async (item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>): Promise<void> => {
    const newItem: TranslationHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    if (typeof chrome === 'undefined' || !chrome.storage) {
      const current = localStorage.getItem('tippr_history');
      const history = current ? JSON.parse(current) : [];
      const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem('tippr_history', JSON.stringify(updated));
      return;
    }

    const result = await chrome.storage.local.get({ history: [] });
    const history = result.history as TranslationHistoryItem[];
    const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    await chrome.storage.local.set({ history: updated });
  },

  clear: async (): Promise<void> => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      localStorage.removeItem('tippr_history');
      return;
    }
    await chrome.storage.local.set({ history: [] });
  },

  remove: async (id: string): Promise<void> => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      const current = localStorage.getItem('tippr_history');
      const history = current ? JSON.parse(current) : [];
      const updated = history.filter((item: TranslationHistoryItem) => item.id !== id);
      localStorage.setItem('tippr_history', JSON.stringify(updated));
      return;
    }

    const result = await chrome.storage.local.get({ history: [] });
    const history = result.history as TranslationHistoryItem[];
    const updated = history.filter(item => item.id !== id);
    await chrome.storage.local.set({ history: updated });
  }
};
