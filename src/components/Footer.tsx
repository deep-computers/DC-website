import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden dark:from-gray-950 dark:to-black">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent dark:via-[#E5C158]/50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl dark:bg-[#E5C158]/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl dark:bg-[#E5C158]/10"></div>
            </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-1">
            <div className="flex items-center mb-6 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/30 to-[#B8860B]/30 rounded-full blur-md transition-all duration-300 group-hover:blur-lg dark:from-[#E5C158]/40 dark:to-[#D4AF37]/40 dark:blur-lg"></div>
                <img 
                  src="/images/brand/logo.png" 
                  alt="Deep Computers Logo" 
                  className="relative w-12 h-12 mr-3 transition-transform duration-300 group-hover:scale-105 rounded-full object-cover dark:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent dark:gold-shimmer">Deep</span>
                <span className="font-serif font-medium text-2xl text-white ml-1">Computers</span>
              </div>
              </div>
            <p className="text-gray-400 mb-8 leading-relaxed dark:text-gray-300">
              Your trusted partner for academic and professional printing solutions. Quality service since 2010.
            </p>
            <div className="space-y-4">
                <a 
                  href="https://wa.me/919311244099" 
                  target="_blank" 
                  rel="noreferrer"
                className="flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors"
                >
                <MessageCircle className="h-5 w-5 mr-2" />
                <span>WhatsApp: +91-9311244099</span>
                </a>
              <a 
                href="https://www.google.com/maps/place/Deep+Computers/@28.4633178,77.5058398,19z/data=!3m1!4b1!4m6!3m5!1s0x390cc1d712c54d27:0x68d6b856f65e1141!8m2!3d28.4633166!4d77.5064849!16s%2Fg%2F11g6njsfp8?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2" />
                <span>View Our Location</span>
              </a>
            </div>
          </div>
          
          {/* Services section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent dark:gold-shimmer">Services</h3>
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
                    className="text-gray-400 hover:text-[#D4AF37] transition-all duration-300 relative group flex items-center dark:text-gray-300"
                  >
                    <span className="absolute left-0 -ml-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0">
                      •
                    </span>
                    {service}
                  </a>
              </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent dark:gold-shimmer">Quick Links</h3>
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
                    className="text-gray-400 hover:text-[#D4AF37] transition-all duration-300 relative group flex items-center dark:text-gray-300"
                  >
                    <span className="absolute left-0 -ml-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0">
                      •
                    </span>
                    {link.label}
                  </a>
              </li>
              ))}
            </ul>
          </div>
          
          {/* Business Hours section */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent dark:gold-shimmer">Business Hours</h3>
            <ul className="space-y-3 text-gray-400 mb-8 dark:text-gray-300">
              <li className="flex justify-between items-center">
                <span>Monday - Sunday:</span>
                <span className="text-[#D4AF37] dark:text-[#E5C158] dark:text-shadow-[0_0_10px_rgba(212,175,55,0.3)]">9:00 AM - 9:00 PM</span>
              </li>
              <li className="text-sm italic opacity-75">
                <span>Open all days of the week</span>
              </li>
            </ul>
            <div className="space-y-6">
              <a 
                href="https://wa.me/919311244099" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-medium px-6 py-3 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] dark:text-white dark:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="relative mt-12 pt-8 border-t border-gray-800 dark:border-[#D4AF37]/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0 dark:text-gray-400">
              © {currentYear} Deep Computers. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-[#D4AF37] transition-all duration-300 text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full dark:text-gray-400 dark:hover:text-[#E5C158] dark:after:bg-[#E5C158]">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-[#D4AF37] transition-all duration-300 text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full dark:text-gray-400 dark:hover:text-[#E5C158] dark:after:bg-[#E5C158]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
