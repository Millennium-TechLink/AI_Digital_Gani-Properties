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

// Same reasoning, different culprit: browsers default history.scrollRestoration
// to 'auto', meaning the browser itself may try to apply its own remembered
// scroll offset for a history entry on navigation - a second, independent
// actor racing against PageTransition's own scroll-to-top-on-route-change
// logic (components/PageTransition.tsx). 'manual' hands scroll restoration
// entirely to the app, which is what React Router's own docs recommend for
// exactly this class of SPA scroll bug.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
