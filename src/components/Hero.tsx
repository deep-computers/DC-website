import { Button } from "@/components/ui/button";
import { BookOpen, Printer, FileText, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const Hero = () => {
  // Array of quotes for the slideshow
  const quotes = [
    "Professional printing, binding, thesis writing, and plagiarism checking services to help you excel in your academic journey.",
    "Turn your academic work into professionally presented documents with our comprehensive printing and binding solutions.",
    "Get expert assistance with plagiarism checking and removal to ensure your academic integrity remains uncompromised.",
    "From rough drafts to polished presentations, we provide end-to-end services for all your academic document needs.",
    "Quality academic services designed by students, for students - helping you achieve academic excellence."
  ];
  
  // State for the current quote
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fade animation timing
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to handle quote rotation
  const rotateQuote = () => {
    setIsAnimating(true);
    
    // After fade out, change the quote
    fadeTimerRef.current = setTimeout(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
      
      // After changing, fade back in
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 500);
  };
  
  // Setup automatic rotation
  useEffect(() => {
    const intervalId = setInterval(rotateQuote, 5000); // Change quote every 5 seconds
    
    return () => {
      clearInterval(intervalId);
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);
  
  // Add necessary CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeInQuote {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOutQuote {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      
      .quote-fade-in {
        animation: fadeInQuote 0.6s forwards;
      }
      
      .quote-fade-out {
        animation: fadeOutQuote 0.5s forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#D4AF37]/5 to-white"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}>
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-[#B8860B]/15 to-[#D4AF37]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-40 right-1/4 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-[#B8860B]/10 rounded-full blur-lg animate-pulse delay-1000"></div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/50 to-white pointer-events-none"></div>
      </div>

      <div className="container relative px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="relative animate-fade-up animation-delay-200">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
            <h1 className="font-serif text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Academic</span> & 
              <span className="relative">
                <span className="relative z-10">Printing</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-[#D4AF37]/20 -skew-x-6"></span>
              </span> 
              <br /><span>Services for Students</span>
            </h1>
            
            {/* Quote Slideshow */}
            <div className="relative h-[100px] xs:h-[90px] sm:h-[80px] md:h-[120px] mb-6 sm:mb-8 flex items-center">
              <div className={`text-base xs:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl transition-opacity duration-500 ${isAnimating ? 'quote-fade-out' : 'quote-fade-in'}`}>
                {quotes[currentQuoteIndex]}
              </div>
              
              {/* Quote indicators */}
              <div className="absolute -bottom-2 left-0 flex space-x-2">
                {quotes.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentQuoteIndex === index 
                        ? 'w-6 bg-[#D4AF37]' 
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-4 xs:gap-6">
              <Link to="/services" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Explore Our Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/print-order" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Printer className="mr-2 h-4 w-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  Print Documents
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Service Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 animate-fade-in animation-delay-500">
            {/* Print Order Card */}
            <Link to="/print-order" 
              className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-[#D4AF37]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Printer className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Printing & Binding</h3>
                <p className="text-gray-600">Professional printing services with various paper and binding options.</p>
                <p className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Order Now 
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-2" />
                </p>
              </div>
            </Link>
            
            {/* Academic Writing Card */}
            <a 
              href="https://wa.me/919311244099" 
              target="_blank" 
              rel="noreferrer"
              className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-[#D4AF37]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Academic Writing</h3>
                <p className="text-gray-600">Expert assistance with thesis, research papers, dissertations, and more.</p>
                <p className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Contact Us 
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-2" />
                </p>
              </div>
            </a>
            
            {/* Plagiarism Services Card */}
            <Link to="/plagiarism-order" 
              className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-[#D4AF37]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Plagiarism Services</h3>
                <p className="text-gray-600">Comprehensive plagiarism checking and removal services.</p>
                <p className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Order Now 
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-2" />
                </p>
              </div>
            </Link>
            
            {/* Contact Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-[#D4AF37]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative flex flex-col items-center justify-center h-full text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <p className="font-serif text-lg font-semibold text-gray-900 mb-4">Need help?</p>
                <a 
                  href="https://wa.me/919311244099" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:scale-105 group"
                >
                  <span className="mr-2">WhatsApp Now</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
