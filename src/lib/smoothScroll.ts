/**
 * Enhanced smooth scrolling utilities
 */

// Smooth scroll to element with offset
export function smoothScrollTo(element: HTMLElement | string, offset: number = 0) {
  const target = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element;
  
  if (!target) return;
  
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

// Smooth scroll to top
export function smoothScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// Initialize smooth scroll enhancements
export function initSmoothScroll() {
  // Enhance native smooth scrolling
  if ('scrollBehavior' in document.documentElement.style) {
    // Add smooth scroll polyfill for better performance
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (!supportsSmoothScroll) {
      // Polyfill for browsers that don't support smooth scroll
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
      document.head.appendChild(script);
    }
  }
  
  // Add smooth scroll to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          smoothScrollTo(target as HTMLElement, 80);
        }
      }
    });
  });
}

