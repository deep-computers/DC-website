import { ComponentType, lazy } from 'react';

// Optimized lazy loading with increased timeout and prefetching
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preload = false
): React.LazyExoticComponent<T> {
  if (preload) {
    // Start loading the component in the background
    const promise = importFn();
    
    // Return lazy component that uses the existing promise
    return lazy(() => promise);
  }
  
  return lazy(importFn);
}

// Preload a component without rendering it
export function preloadComponent(importFn: () => Promise<{ default: any }>) {
  return importFn();
}

// Utility to preload a group of components
export function preloadComponents(
  componentImports: Array<() => Promise<{ default: any }>>
) {
  return Promise.all(componentImports.map(importFn => importFn()));
}
