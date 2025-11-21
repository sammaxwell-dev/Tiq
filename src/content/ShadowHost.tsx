import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styleSheet from './styles';

interface ShadowHostProps {
  children?: React.ReactNode;
}

const ShadowHost: React.FC<ShadowHostProps> = ({ children }) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      const root = hostRef.current.attachShadow({ mode: 'open' });
      setShadowRoot(root);
    }
  }, [hostRef, shadowRoot]);

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
          <div className="gpt-translate-root font-sans text-base antialiased">
            {children || <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 text-gray-800">Tippr Ready</div>}
          </div>
        </>,
        shadowRoot
      )}
    </div>
  );
};

export default ShadowHost;

