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
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
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
          <Link to="/services" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">Services</Link>
          <Link to="/about" className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">About</Link>
          <Link to="/#pricing" onClick={(e) => handleNavigation(e, '/#pricing')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">Pricing</Link>
          
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
          
          <Link to="/#testimonials" onClick={(e) => handleNavigation(e, '/#testimonials')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">Testimonials</Link>
          <Link to="/#faq" onClick={(e) => handleNavigation(e, '/#faq')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">FAQ</Link>
          <Link to="/#contact" onClick={(e) => handleNavigation(e, '/#contact')} className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full">Contact</Link>
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
          <a href="https://wa.me/919311244099" className="mr-3" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" 
              className="relative px-2 py-1 h-7 text-xs group overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0 shadow-md">
              <span className="relative z-10">WhatsApp</span>
            </Button>
          </a>
          <button 
            onClick={toggleMenu}
            className="text-gray-600 hover:text-[#D4AF37] focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className="absolute right-0 h-full w-64 sm:w-72 bg-white shadow-xl overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-serif font-bold text-xl text-[#D4AF37]">Menu</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <nav className="space-y-4">
              <Link to="/services" className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">Services</Link>
              <Link to="/about" className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">About</Link>
              <Link to="/#pricing" onClick={(e) => handleNavigation(e, '/#pricing')} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">Pricing</Link>
              
              <div className="py-2">
                <p className="text-sm font-medium text-gray-500 mb-3">Order Services</p>
                <div className="space-y-3">
                  <Link to="/print-order" className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Order
                  </Link>
                  <Link to="/binding-order" className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Binding Order
                  </Link>
                  <Link to="/plagiarism-order" className="flex items-center text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Plagiarism Services
                  </Link>
                </div>
              </div>
              
              <Link to="/#testimonials" onClick={(e) => handleNavigation(e, '/#testimonials')} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">Testimonials</Link>
              <Link to="/#faq" onClick={(e) => handleNavigation(e, '/#faq')} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">FAQ</Link>
              <Link to="/#contact" onClick={(e) => handleNavigation(e, '/#contact')} className="block text-base font-medium text-gray-700 hover:text-[#D4AF37] transition-colors">Contact</Link>
            </nav>
            
            <div className="pt-6 border-t border-gray-100">
              <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer" className="block w-full">
                <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
