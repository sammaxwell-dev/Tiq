import React from 'react';
import ReactDOM from 'react-dom/client';
import ShadowHost from './content/ShadowHost';
import ContentApp from './content/ContentApp';
import './styles/tailwind.css';

// Mock chrome runtime for playground
if (typeof window !== 'undefined') {
  window.chrome = window.chrome || {};
  // @ts-ignore
  if (!window.chrome.runtime) window.chrome.runtime = {};

  // @ts-ignore
  window.chrome.runtime.sendMessage = async (msg: any) => {
    console.log('Mock sendMessage:', msg);
    await new Promise(r => setTimeout(r, 800));
    if (msg && typeof msg === 'object') {
      if (msg.type === 'TRANSLATE_REQUEST') {
        return { success: true, data: `[Mock GPT-4o] Translated: ${msg.payload?.text}` };
      }
      if (msg.type === 'VALIDATE_API_KEY') {
        return { success: true };
      }
    }
    return { success: false };
  };

  // @ts-ignore
  window.chrome.runtime.getURL = (path: string) => path;
  // @ts-ignore
  window.chrome.runtime.openOptionsPage = () => console.log('Open options page clicked');
}

const Playground = () => {
  return (
    <ShadowHost>
      <ContentApp />
    </ShadowHost>
  );
};

ReactDOM.createRoot(document.getElementById('lume-root')!).render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>,
);
