import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import ScrollToTop from "./components/ui/ScrollToTop";
import Index from "./pages/Index";
import PrintOrder from "./pages/PrintOrder";
import BindingOrder from "./pages/BindingOrder";
import PlagiarismOrder from "./pages/PlagiarismOrder";
import ServicesPage from "./pages/ServicesPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/print-order" element={<PrintOrder />} />
            <Route path="/binding-order" element={<BindingOrder />} />
            <Route path="/plagiarism-order" element={<PlagiarismOrder />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
