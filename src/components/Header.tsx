import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Printer, BookOpen, FileText, ChevronDown, ShieldCheck, MapPin } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(path.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b shadow-lg'
        : 'bg-white/60 backdrop-blur-sm'
    }`}>
      <div className="container px-3 xs:px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 md:h-18 justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/30 to-[#B8860B]/30 rounded-full blur-md transition-all duration-300 group-hover:blur-lg"></div>
              <img 
                src="/images/brand/logo.png" 
                alt="Deep Computers Logo" 
                className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-105 rounded-full object-cover"
              />
            </div>
            <div className="relative">
              <span className="font-serif font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Deep</span>
              <span className="font-serif font-medium text-lg sm:text-xl md:text-2xl text-gray-800 ml-1">Computers</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6">
          <Link to="/" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            Home
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/services" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            Services
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            About
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/#pricing" onClick={(e) => handleNavigation(e, '/#pricing')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            Pricing
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 flex items-center group">
                <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 transition-transform group-hover:scale-110" />
                Order Services
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-1.5 transition-transform group-hover:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-xl p-1 mt-2">
              <Link to="/print-order">
                <DropdownMenuItem className="cursor-pointer rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white focus:bg-[#D4AF37] focus:text-white group text-xs sm:text-sm py-1.5">
                  <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 transition-transform group-hover:scale-110" />
                  <span>Print Order</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/binding-order">
                <DropdownMenuItem className="cursor-pointer rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white focus:bg-[#D4AF37] focus:text-white group text-xs sm:text-sm py-1.5">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 transition-transform group-hover:scale-110" />
                  <span>Binding Order</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/plagiarism-order">
                <DropdownMenuItem className="cursor-pointer rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white focus:bg-[#D4AF37] focus:text-white group text-xs sm:text-sm py-1.5">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 transition-transform group-hover:scale-110" />
                  <span>Plagiarism Services</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/#testimonials" onClick={(e) => handleNavigation(e, '/#testimonials')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            Testimonials
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/#faq" onClick={(e) => handleNavigation(e, '/#faq')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            FAQ
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/#contact" onClick={(e) => handleNavigation(e, '/#contact')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors duration-300 relative group">
            Contact
            <span className="absolute left-1/2 bottom-0 h-0.5 w-0 origin-center transform -translate-x-1/2 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center text-xs text-gray-600 hover:text-[#D4AF37] transition-all duration-300 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <Phone className="h-3 w-3 mr-1.5 text-[#D4AF37] relative transition-transform group-hover:scale-110" />
              </div>
              <span>+91-9311244099</span>
            </div>
            <a 
              href="https://www.google.com/maps/place/Deep+Computers/@28.4633178,77.5058398,19z/data=!3m1!4b1!4m6!3m5!1s0x390cc1d712c54d27:0x68d6b856f65e1141!8m2!3d28.4633166!4d77.5064849!16s%2Fg%2F11g6njsfp8?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center text-xs text-gray-600 hover:text-[#D4AF37] transition-all duration-300 group"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <MapPin className="h-3 w-3 mr-1.5 text-[#D4AF37] relative transition-transform group-hover:scale-110" />
              </div>
              <span>View Location</span>
            </a>
          </div>
          <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" 
              className="relative py-1 h-7 text-xs group overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <span className="relative z-10">WhatsApp Us</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Button>
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="text-gray-600 hover:text-[#D4AF37] focus:outline-none transition-colors duration-300"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu - Full screen overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* Backdrop overlay */}
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile menu panel */}
            <motion.div 
              key="mobile-menu-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] h-[100dvh] bg-white overflow-y-auto shadow-2xl">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif font-bold text-xl text-[#D4AF37]">Menu</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors focus:outline-none"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <nav className="space-y-4">
                  <Link to="/" onClick={toggleMenu} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">Home</Link>
                  <Link to="/services" onClick={toggleMenu} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">Services</Link>
                  <Link to="/about" onClick={toggleMenu} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">About</Link>
                  <Link to="/#pricing" onClick={(e) => {handleNavigation(e, '/#pricing'); toggleMenu();}} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">Pricing</Link>
                  
                  <div className="py-2">
                    <p className="text-sm font-medium text-gray-500 mb-3 px-4">Order Services</p>
                    <div className="space-y-3">
                      <Link to="/print-order" onClick={toggleMenu} className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">
                        <Printer className="h-5 w-5 mr-3 flex-shrink-0" />
                        Print Order
                      </Link>
                      <Link to="/binding-order" onClick={toggleMenu} className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">
                        <BookOpen className="h-5 w-5 mr-3 flex-shrink-0" />
                        Binding Order
                      </Link>
                      <Link to="/plagiarism-order" onClick={toggleMenu} className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">
                        <ShieldCheck className="h-5 w-5 mr-3 flex-shrink-0" />
                        Plagiarism Services
                      </Link>
                    </div>
                  </div>
                  
                  <Link to="/#testimonials" onClick={(e) => {handleNavigation(e, '/#testimonials'); toggleMenu();}} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">Testimonials</Link>
                  <Link to="/#faq" onClick={(e) => {handleNavigation(e, '/#faq'); toggleMenu();}} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">FAQ</Link>
                  <Link to="/#contact" onClick={(e) => {handleNavigation(e, '/#contact'); toggleMenu();}} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-3 px-4">Contact</Link>
                </nav>
                
                <div className="pt-6 px-4 border-t border-gray-100">
                  <div className="py-3">
                    <a href="tel:+91-93112-44099" className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">
                      <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                      +91-93112-44099
                    </a>
                  </div>
                  
                  <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer" className="block w-full mt-4">
                    <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white border-0 py-5 text-base h-auto">
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
