import { createRoot } from 'react-dom/client';
import ShadowHost from './ShadowHost';
import ContentApp from './ContentApp';

console.log('Lume content script loaded');

const container = document.createElement('div');
container.id = 'lume-container';
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <ShadowHost>
    <ContentApp />
  </ShadowHost>
);
