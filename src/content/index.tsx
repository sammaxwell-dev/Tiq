import { createRoot } from 'react-dom/client';
import ShadowHost from './ShadowHost';
import ContentApp from './ContentApp';

console.log('Tippr content script loaded');

const container = document.createElement('div');
container.id = 'tippr-container';
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <ShadowHost>
    <ContentApp />
  </ShadowHost>
);
