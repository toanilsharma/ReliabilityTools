import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const appComponent = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

const isPrerendered = rootElement.hasChildNodes() && !rootElement.querySelector('.initial-loader');

if (isPrerendered) {
  ReactDOM.hydrateRoot(rootElement, appComponent);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appComponent);
}