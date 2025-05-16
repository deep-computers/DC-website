import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ChevronUp, Facebook, Instagram, Linkedin, ExternalLink, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  // Show back-to-top button when scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-850 to-black text-white overflow-hidden dark:from-gray-950 dark:to-black">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent dark:via-[#E5C158]/70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse dark:bg-[#E5C158]/15"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse dark:bg-[#E5C158]/15"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl animate-float dark:bg-[#E5C158]/10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl animate-float-delayed dark:bg-[#E5C158]/10"></div>
      </div>

          <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-1">
            <div className="flex items-center mb-6 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/50 to-[#B8860B]/50 rounded-full blur-md transition-all duration-300 group-hover:blur-lg dark:from-[#E5C158]/60 dark:to-[#D4AF37]/60 dark:blur-lg animate-pulse"></div>
                <img 
                  src="/images/brand/logo.webp" 
                  alt="Deep Computers Logo" 
                  className="relative w-14 h-14 mr-3 transition-transform duration-300 group-hover:scale-105 rounded-full object-cover dark:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent dark:gold-shimmer">Deep</span>
                <span className="font-serif font-medium text-2xl text-white ml-1">Computers</span>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed dark:text-gray-200">
              Your trusted partner for academic and professional printing solutions since 2010. Delivering quality service with a commitment to excellence.
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-4 mb-8">
              {[
                { icon: <Facebook size={18} />, label: "Facebook", href: "https://www.facebook.com/DCprintingsolution/" },
                { icon: <Instagram size={18} />, label: "Instagram", href: "https://instagram.com/dcprintingpress/" },
                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, label: "X", href: "https://x.com/Deepcomputerpp" },
                { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://www.linkedin.com/in/deep-computers-0519631ab/" },
                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>, label: "YouTube", href: "https://www.youtube.com/@DCprintingpress" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#D4AF37]/20 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] transition-all duration-300 group border border-gray-700 hover:border-[#D4AF37]/50 dark:bg-gray-800/50 dark:hover:bg-[#E5C158]/20 dark:hover:text-[#E5C158]"
                >
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <a 
                href="https://wa.me/919311244099" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center text-gray-300 hover:text-[#D4AF37] transition-colors group"
              >
                <div className="bg-gray-800 p-2 rounded-full group-hover:bg-[#D4AF37]/10 transition-all mr-3 dark:bg-gray-800/70">
                  <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-300">WhatsApp: +91-9311244099</span>
              </a>
              <a 
                href="https://www.google.com/maps/place/Deep+Computers/@28.4633178,77.5058398,19z/data=!3m1!4b1!4m6!3m5!1s0x390cc1d712c54d27:0x68d6b856f65e1141!8m2!3d28.4633166!4d77.5064849!16s%2Fg%2F11g6njsfp8?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center text-gray-300 hover:text-[#D4AF37] transition-colors group"
              >
                <div className="bg-gray-800 p-2 rounded-full group-hover:bg-[#D4AF37]/10 transition-all mr-3 dark:bg-gray-800/70">
                  <MapPin className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-300">View Our Location</span>
              </a>
            </div>
          </div>
          
          {/* Services section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent before:content-[''] before:block before:w-12 before:h-1 before:bg-gradient-to-r before:from-[#D4AF37] before:to-[#B8860B] before:mb-3 before:rounded-full dark:gold-shimmer">Services</h3>
            <ul className="space-y-3">
              {[
                'Printing Services',
                'Binding Solutions',
                'Academic Writing',
                'Plagiarism Checking',
                'Plagiarism Removal',
                'AI Plagiarism Services'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#services" 
                    className="text-gray-300 hover:text-[#D4AF37] transition-all duration-300 relative group flex items-center dark:text-gray-200"
                  >
                    <span className="absolute w-0 h-0.5 bg-[#D4AF37] left-0 bottom-0 transition-all duration-300 group-hover:w-full dark:bg-[#E5C158]"></span>
                    <span className="absolute left-0 -ml-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-[#D4AF37] dark:text-[#E5C158]">
                      •
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{service}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent before:content-[''] before:block before:w-12 before:h-1 before:bg-gradient-to-r before:from-[#D4AF37] before:to-[#B8860B] before:mb-3 before:rounded-full dark:gold-shimmer">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Testimonials', href: '#testimonials' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#D4AF37] transition-all duration-300 relative group flex items-center dark:text-gray-200"
                  >
                    <span className="absolute w-0 h-0.5 bg-[#D4AF37] left-0 bottom-0 transition-all duration-300 group-hover:w-full dark:bg-[#E5C158]"></span>
                    <span className="absolute left-0 -ml-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-[#D4AF37] dark:text-[#E5C158]">
                      •
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Business Hours section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent before:content-[''] before:block before:w-12 before:h-1 before:bg-gradient-to-r before:from-[#D4AF37] before:to-[#B8860B] before:mb-3 before:rounded-full dark:gold-shimmer">Business Hours</h3>
            <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50 mb-6 dark:bg-gray-800/30 dark:border-[#D4AF37]/10">
              <div className="flex items-center mb-4">
                <Clock className="text-[#D4AF37] mr-2 animate-pulse dark:text-[#E5C158]" size={18} />
                <h4 className="font-medium text-white">Open Every Day</h4>
              </div>
              <ul className="space-y-3 text-gray-300 dark:text-gray-200">
                <li className="flex justify-between items-center">
                  <span>Monday - Sunday:</span>
                  <span className="text-[#D4AF37] font-medium dark:text-[#E5C158] dark:text-shadow-[0_0_10px_rgba(212,175,55,0.3)]">9:00 AM - 9:00 PM</span>
                </li>
                <li className="text-sm italic opacity-75 text-center pt-2 border-t border-gray-700/50">
                  <span>Open all days of the week for your convenience</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <a 
                href="https://wa.me/919311244099" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-medium px-6 py-3.5 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-[1.02] active:scale-[0.98] relative group dark:text-white dark:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                <span className="absolute inset-0 bg-white/10 rounded-lg scale-0 transition-transform duration-300 group-hover:scale-100"></span>
                <div className="flex items-center justify-center">
                  <MessageCircle className="mr-2" size={18} />
                  <span>Contact on WhatsApp</span>
                </div>
              </a>
              <a 
                href="tel:+919311244099" 
                className="inline-block w-full border border-[#D4AF37]/30 text-[#D4AF37] font-medium px-6 py-3.5 rounded-lg text-center transition-all duration-300 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] relative group dark:text-[#E5C158] dark:border-[#E5C158]/30 dark:hover:border-[#E5C158]"
              >
                <div className="flex items-center justify-center">
                  <Phone className="mr-2" size={18} />
                  <span>Call Us</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="relative mt-16 pt-8 border-t border-gray-800 dark:border-[#D4AF37]/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm dark:text-gray-300">
                © {currentYear} Deep Computers. All rights reserved.
              </p>
              <span className="hidden sm:block text-gray-600">|</span>
              <p className="text-gray-500 text-sm flex items-center dark:text-gray-400">
                <MapPin size={14} className="mr-1" /> 
                Dadri, Greater Noida, UP
              </p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-all duration-300 text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full dark:text-gray-300 dark:hover:text-[#E5C158] dark:after:bg-[#E5C158]">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-all duration-300 text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full dark:text-gray-300 dark:hover:text-[#E5C158] dark:after:bg-[#E5C158]">
                Terms of Service
              </a>
              <a href="#contact" className="text-gray-400 hover:text-[#D4AF37] transition-all duration-300 text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full dark:text-gray-300 dark:hover:text-[#E5C158] dark:after:bg-[#E5C158]">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 z-50 p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:scale-110 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .dark\:gold-shimmer {
          background: linear-gradient(to right, #E5C158, #D4AF37, #F0D47F, #D4AF37, #E5C158);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;