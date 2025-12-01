import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { register as registerServiceWorker } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA için service worker'ı kaydet
registerServiceWorker();
