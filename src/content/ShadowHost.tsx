import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styleSheet from './styles';
import { storage } from '../lib/storage';
import { cn } from '../lib/utils';

interface ShadowHostProps {
  children?: React.ReactNode;
}

const ShadowHost: React.FC<ShadowHostProps> = ({ children }) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      const root = hostRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(root);
    }
  }, [hostRef, shadowRoot]);

  useEffect(() => {
    const updateTheme = async () => {
      const settings = await storage.get();
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (settings.theme === 'dark') {
        setIsDark(true);
      } else if (settings.theme === 'light') {
        setIsDark(false);
      } else {
        setIsDark(systemDark);
      }
    };

    updateTheme();

    // Listen for storage changes
    const removeStorageListener = storage.onChange(() => {
      updateTheme();
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      storage.get().then(settings => {
        if (settings.theme === 'system') {
          setIsDark(mediaQuery.matches);
        }
      });
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      removeStorageListener();
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  // If shadowRoot is not ready, we render the host element
  if (!shadowRoot) {
    return <div ref={hostRef} id="gpt-translate-helper-host" />;
  }

  // Once shadowRoot is ready, we use createPortal to render children into it
  return (
    <div ref={hostRef} id="gpt-translate-helper-host">
      {createPortal(
        <>
          <style>{styleSheet}</style>
          <div className={cn("gpt-translate-root font-sans text-base antialiased", isDark && "dark")}>
            {children || <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 text-gray-800">Lume Ready</div>}
          </div>
        </>,
        shadowRoot
      )}
    </div>
  );
};

export default ShadowHost;

