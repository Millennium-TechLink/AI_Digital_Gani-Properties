import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Note: smooth scrolling is handled entirely by Lenis (see components/SmoothScroll.tsx).
// The old native `scrollTo({ behavior: 'smooth' })`-based init was removed from here
// because running it alongside Lenis would have two scroll-animation systems fighting
// over the same scroll position on any in-page `href="#..."` anchor.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
