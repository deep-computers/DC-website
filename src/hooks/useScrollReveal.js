import { useEffect } from 'react';

/**
 * Hook to create scroll-triggered animations
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // triggers slightly before element enters viewport
    });
    
    // Target all elements that should animate on scroll
    const elements = document.querySelectorAll('.reveal-on-scroll, .stagger-children');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
}; 