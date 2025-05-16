import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// Import motion directly to avoid errors with TypeScript
import { motion } from 'framer-motion';

// For production, you could implement code splitting with dynamic imports:
// const motion = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion })));
// and wrap each motion component with Suspense

const WelcomePage = () => {
  const navigate = useNavigate();
  
  // Preload key assets for better performance  
  useEffect(() => {
    // Prefetch necessary assets in the background
    const preloadAssets = () => {
      // Preload key pages and resources
      const pagesToPreload = ['/home', '/services', '/about'];
      pagesToPreload.forEach(page => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.as = 'document';
        preloadLink.href = page;
        document.head.appendChild(preloadLink);
      });
    };
    
    // Start preloading immediately
    preloadAssets();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const shineVariants = {
    initial: { backgroundPosition: '-100%' },
    animate: {
      backgroundPosition: '200%',
      transition: { repeat: Infinity, duration: 3, ease: 'linear' }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151515] via-[#101010] to-[#050505] relative overflow-hidden">
      {/* Premium background elements - CSS texture pattern */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#B8860B 1px, transparent 1px)`,
            backgroundSize: `50px 50px`,
            backgroundPosition: `0 0, 25px 25px`
          }}
        ></div>
      </div>
      
      {/* Gold particles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37] rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#B8860B] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FFD700] rounded-full opacity-10 blur-3xl animate-pulse"></div>
      
      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent"></div>
      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent"></div>
      
      {/* Premium central piece */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] max-w-[1500px] max-h-[1500px] rounded-full bg-gradient-to-r from-black to-[#121212] opacity-50 z-0"></div>
      
      {/* Main content */}
      <motion.div 
        className="z-10 text-center p-8 max-w-4xl relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl border border-[#D4AF37]/20 -z-10"></div>
        
        <motion.div variants={itemVariants} className="mb-8 pt-6">
          <div className="relative w-32 h-32 mx-auto mb-4 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/images/brand/logo.webp" 
              alt="Deep Computers Logo" 
              width="128"
              height="128"
              fetchPriority="high"
              decoding="async"
              className="relative h-full w-full object-cover rounded-full p-1"
              onError={(e) => e.currentTarget.style.display = 'none'} 
            />
          </div>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#B8860B] font-serif tracking-wider"
        >
          DEEP COMPUTERS
        </motion.h1>
        
        <motion.div
          variants={shineVariants}
          initial="initial"
          animate="animate"
          className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"
        />
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-[#F5F5F5] mb-6 max-w-2xl mx-auto font-light"
        >
          <span className="font-normal">PREMIER</span> DESTINATION FOR
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="text-2xl md:text-3xl mb-8 max-w-2xl mx-auto text-[#D4AF37] font-semibold tracking-widest"
        >
          PRINTING · BINDING · ACADEMIC SERVICES
        </motion.p>
        
        <motion.div variants={itemVariants} className="mb-12">
          <button
            onClick={() => navigate('/home')}
            className="group relative px-10 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] uppercase tracking-widest overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10">Enter Site</span>
            <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-20"></span>
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex items-center justify-center mt-5 space-x-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/40"></span>
            <span className="text-[#A9A9A9] text-sm font-light">PREMIUM SERVICES AWAIT</span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#D4AF37]/40 to-transparent"></span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-5 sm:gap-8"
        >
          <div className="flex flex-col items-center p-2 sm:p-4 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center mb-3 group-hover:border-[#D4AF37]/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <p className="text-[#D4AF37] text-sm sm:text-base font-medium uppercase tracking-wider">Premium Printing</p>
          </div>
          
          <div className="flex flex-col items-center p-2 sm:p-4 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center mb-3 group-hover:border-[#D4AF37]/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-[#D4AF37] text-sm sm:text-base font-medium uppercase tracking-wider">Expert Binding</p>
          </div>
          
          <div className="flex flex-col items-center p-2 sm:p-4 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center mb-3 group-hover:border-[#D4AF37]/50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-[#D4AF37] text-sm sm:text-base font-medium uppercase tracking-wider">Plagiarism Check</p>
          </div>
        </motion.div>
        
        {/* Gold accents at the bottom */}
        <motion.div 
          variants={itemVariants}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-5/6 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default WelcomePage;
