
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use this for performance measurement if needed
const reportWebVitals = (onPerfEntry?: any) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

// Create the root once
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);

// Use strict mode for development checks
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Uncomment to measure performance
// reportWebVitals(console.log);
