/**
 * @file main.tsx
 * @description Application bootstrap entry point.
 * Initializes the React DOM root, loads global CSS styles, initializes
 * the internationalization (i18n) engine, and renders the root `<App />` component
 * inside React Strict Mode for enhanced development diagnostics.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Mount the React application to the DOM root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
