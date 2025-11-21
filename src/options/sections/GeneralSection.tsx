import { useState, useEffect } from 'react';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { storage } from '../../lib/storage';

const GeneralSection = () => {
  const [targetLang, setTargetLang] = useState('ru');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [instantTranslation, setInstantTranslation] = useState(false);

  useEffect(() => {
    storage.get().then(settings => {
      setTargetLang(settings.targetLang);
      setShowBackdrop(settings.showBackdrop);
      setInstantTranslation(settings.instantTranslation);
    });
  }, []);

  const handleTargetLangChange = async (value: string) => {
    setTargetLang(value);
    await storage.set({ targetLang: value });
  };

  const handleShowBackdropChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowBackdrop(checked);
    await storage.set({ showBackdrop: checked });
  };

  const handleInstantTranslationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setInstantTranslation(checked);
    await storage.set({ instantTranslation: checked });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Language Settings</h2>
        <p className="text-sm text-gray-500 mb-4">Configure your preferred languages for translation.</p>

        <div className="grid gap-4 max-w-md">
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Target Language</label>
            <div className="col-span-2">
                <Select value={targetLang} onChange={(e) => handleTargetLangChange(e.target.value)}>
                    <option value="ru">Russian</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Behavior</h2>
        <p className="text-sm text-gray-500 mb-4">Customize how the extension behaves.</p>

        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Show Backdrop</div>
              <div className="text-xs text-gray-500">Display a dark overlay behind the translation modal</div>
            </div>
            <Switch checked={showBackdrop} onChange={handleShowBackdropChange} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Instant Translation</div>
              <div className="text-xs text-gray-500">Automatically translate on icon click without opening modal first</div>
            </div>
            <Switch checked={instantTranslation} onChange={handleInstantTranslationChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSection;

