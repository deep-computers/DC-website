import React, { Suspense, useEffect } from 'react';
import { lazyLoad, preloadComponents } from './utils/lazyLoad';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import ScrollToTop from "./components/ui/ScrollToTop";

// Import WelcomePage and Index immediately as they are critical for first load
import WelcomePage from "./pages/WelcomePage";
import Index from "./pages/Index";

// Optimized lazy loading for routes
const PrintOrder = lazyLoad(() => import("./pages/PrintOrder"));
const BindingOrder = lazyLoad(() => import("./pages/BindingOrder"));
const PlagiarismOrder = lazyLoad(() => import("./pages/PlagiarismOrder"));
const ServicesPage = lazyLoad(() => import("./pages/ServicesPage"));
const About = lazyLoad(() => import("./pages/About"));
const NotFound = lazyLoad(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
    <div className="w-full max-w-md p-8 space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 rounded animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 rounded animate-pulse w-4/6"></div>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

// Preload routine to optimize loading of critical routes
const preloadImportantRoutes = () => {
  // After 2 seconds when the app is first loaded, start preloading important pages
  // This helps reduce main thread work when navigating to these pages later
  setTimeout(() => {
    preloadComponents([
      () => import("./pages/Index"), // For returning users coming from welcome page
      () => import("./pages/ServicesPage"), // Frequently accessed page
    ]);
    
    // After additional delay, load less critical but common routes
    setTimeout(() => {
      preloadComponents([
        () => import("./pages/About"),
      ]);
    }, 5000); // 5 seconds after initial preload
  }, 2000); // 2 seconds after app load
};

const App = () => {
  // Trigger preloading once when app is mounted
  useEffect(() => {
    preloadImportantRoutes();
  }, []);
  
  return (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Index />} />
            <Route path="/print-order" element={<Suspense fallback={<PageLoader />}><PrintOrder /></Suspense>} />
            <Route path="/binding-order" element={<Suspense fallback={<PageLoader />}><BindingOrder /></Suspense>} />
            <Route path="/plagiarism-order" element={<Suspense fallback={<PageLoader />}><PlagiarismOrder /></Suspense>} />
            <Route path="/services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
  );
};

export default App;
