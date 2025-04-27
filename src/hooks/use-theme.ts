import { useState } from 'react';

type Theme = 'light';

export function useTheme() {
  // Always use light theme
  return {
    theme: 'light' as const,
    isDark: false
  };
} 