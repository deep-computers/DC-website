import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Force light mode
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                document.documentElement.style.setProperty('color-scheme', 'light');
                
                // Remove dark mode from local storage 
                localStorage.removeItem('theme');
                
                // Override any system preference
                window.matchMedia = window.matchMedia || function() { 
                  return { 
                    matches: false,
                    addEventListener: function(){},
                    removeEventListener: function(){}
                  }; 
                };
              } catch (e) { console.error(e); }
            })();
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-pattern" suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
} 