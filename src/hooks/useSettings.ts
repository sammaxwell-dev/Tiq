import { useState, useEffect } from 'react';
import { storage, AppSettings, DEFAULT_SETTINGS } from '../lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    storage.get().then((data) => {
      setSettings(data);
      setLoading(false);
    });

    // Subscribe to changes
    const unsubscribe = storage.onChange((newSettings) => {
      setSettings(newSettings);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newValues: Partial<AppSettings>) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, ...newValues }));
    await storage.set(newValues);
  };

  return { settings, updateSettings, loading };
}

