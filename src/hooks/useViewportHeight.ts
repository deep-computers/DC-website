import { useEffect } from 'react';

/**
 * Hook to set CSS custom property --vh to fix mobile viewport height issues
 * This addresses the problem with 100vh not accounting for mobile browser UI elements
 */
export function useViewportHeight() {
  useEffect(() => {
    // Function to update the --vh CSS variable
    const updateHeight = () => {
      // Calculate vh unit as 1% of viewport height
      const vh = window.innerHeight * 0.01;
      // Apply to CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initial call
    updateHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);
} 