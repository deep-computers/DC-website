import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create vendor chunk for node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Split UI components
          if (id.includes('/components/ui/')) {
            return 'ui';
          }
          
          // Group form components
          if (id.includes('OrderForm')) {
            return 'forms';
          }
        },
      },
    },
    sourcemap: false, // Disable sourcemaps in production
  },
  plugins: [
    react(), // Use default SWC optimization
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
}));
