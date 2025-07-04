
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring
if (import.meta.env.DEV) {
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  });
}

// Create the root once
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

// Render with React 18 features
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
