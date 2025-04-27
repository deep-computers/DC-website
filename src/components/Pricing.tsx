import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Printer, BookOpen, ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const Pricing = () => {
  // State to control the active tab
  const [activeTab, setActiveTab] = useState("printing");
  
  // Array of tab values to cycle through
  const tabValues = ["printing", "binding", "plagiarism", "ai"];
  
  // Animation state
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // For touch events
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Progress timer
  const progressInterval = useRef<number | null>(null);
  const slideshowTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Initialize progress timer
  const startProgressTimer = useCallback(() => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    setProgress(0);
    
    // Update progress every 50ms
    const intervalId = window.setInterval(() => {
      setProgress(prev => {
        const newValue = prev + (50 / 5000) * 100; // 5000ms (5s) for full cycle
        return newValue > 100 ? 100 : newValue;
      });
    }, 50);
    
    progressInterval.current = intervalId;
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    // Start transition animation
    setIsTransitioning(true);
    
    // Small delay for transition effect
    setTimeout(() => {
      setActiveTab(value);
      setIsTransitioning(false);
    }, 500); // Match the fadeOut animation time (500ms)
    
    // Reset progress
    setProgress(0);
    
    // Start new timer
    if (!isPaused) {
      startProgressTimer();
    }
  }, [isPaused, startProgressTimer]);
  
  // For manual navigation
  const goToNextTab = useCallback(() => {
    const currentIndex = tabValues.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabValues.length;
    handleTabChange(tabValues[nextIndex]);
  }, [activeTab, tabValues, handleTabChange]);
  
  const goToPrevTab = useCallback(() => {
    const currentIndex = tabValues.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + tabValues.length) % tabValues.length;
    handleTabChange(tabValues[prevIndex]);
  }, [activeTab, tabValues, handleTabChange]);
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    
    // If swipe distance is significant
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left, go to next slide
        goToNextTab();
      } else {
        // Swipe right, go to previous slide
        goToPrevTab();
      }
    }
  };
  
  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsPaused(true);
    // Stop progress updates
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    // Clear scheduled slide change
    if (slideshowTimeout.current) {
      clearTimeout(slideshowTimeout.current);
    }
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
    startProgressTimer();
    
    // Schedule next slide
    slideshowTimeout.current = setTimeout(() => {
      goToNextTab();
    }, (1 - progress / 100) * 5000); // Remaining time from 5 seconds
  };
  
  // Setup automatic rotation
  useEffect(() => {
    if (!isPaused) {
      startProgressTimer();
      
      // Schedule next slide
      slideshowTimeout.current = setTimeout(() => {
        goToNextTab();
      }, 5000); // 5 seconds interval
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (slideshowTimeout.current) {
        clearTimeout(slideshowTimeout.current);
      }
    };
  }, [activeTab, isPaused, goToNextTab, startProgressTimer]);
  
  // Add CSS for animations using useEffect to avoid JSX style tag issues
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      
      @keyframes pricing-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      @keyframes pricing-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      
      @keyframes pricing-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      @keyframes pricing-shine {
        from {
          box-shadow: 0 0 0px #D4AF37, 0 0 0px #D4AF37;
        }
        to {
          box-shadow: 0 0 10px #D4AF37, 0 0 20px #D4AF37;
        }
      }
      
      @keyframes pricing-gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .pricing-tab-transition-in {
        animation: fadeIn 0.6s forwards;
      }
      
      .pricing-tab-transition-out {
        animation: fadeOut 0.5s forwards;
      }
      
      .pricing-shimmer {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0)
        );
        background-size: 200% 100%;
        animation: pricing-shimmer 2s infinite;
      }
      
      .pricing-badge {
        background: linear-gradient(
          90deg,
          rgba(212, 175, 55, 0.6),
          rgba(184, 134, 11, 0.8),
          rgba(212, 175, 55, 0.6)
        );
        background-size: 200% auto;
        animation: pricing-gradient 4s linear infinite;
      }
      
      .pricing-float {
        animation: pricing-float 5s ease-in-out infinite;
      }
      
      .pricing-active-tab {
        position: relative;
        overflow: hidden;
      }
      
      .pricing-active-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #D4AF37, #B8860B, #D4AF37);
        background-size: 200% auto;
        animation: pricing-gradient 2s linear infinite;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Sparkle animation component
  const Sparkle = ({ delay = 0, size = 4, top, left, color = "#D4AF37" }) => (
    <motion.div
      style={{ 
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 2
      }}
    />
  );
  
  // Badge component for special prices
  const PricingBadge = ({ text }: { text: string }) => (
    <div className="absolute -right-12 top-3 rotate-45 z-10">
      <div className="pricing-badge py-1 px-12 text-xs text-white font-medium shadow-sm">
        {text}
      </div>
    </div>
  );
  
  // Animation for progress bar
  const progressAnimation = useSpring(progress);
  const progressWidth = useTransform(progressAnimation, (value) => `${value}%`);
  
  return (
    <section 
      id="pricing" 
      className="py-10 sm:py-12 md:py-16 bg-gray-50 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-gradient-to-r from-primary-100 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-gradient-to-l from-primary-100 to-transparent rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container px-3 xs:px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          {/* Animated sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            <Sparkle top={20} left={10} delay={0.5} size={5} />
            <Sparkle top={80} left={80} delay={1.2} size={4} />
            <Sparkle top={30} left={90} delay={2.1} size={3} />
            <Sparkle top={70} left={20} delay={1.7} size={6} />
            <Sparkle top={40} left={50} delay={0.8} size={4} />
          </div>
          
          <h2 className="font-serif text-2xl xs:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-2 sm:mb-4 relative">
            Pricing
            <motion.span 
              className="absolute -z-10 bottom-1 left-0 right-0 h-3 bg-[#D4AF37]/10"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </h2>
          <p className="text-gray-600 text-base xs:text-lg">
            Competitive rates for all our services
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <motion.button 
              onClick={goToPrevTab}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Previous tab"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(229, 231, 235, 0.5)" }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </motion.button>
            
            <TabsList className="grid flex-1 mx-2 sm:mx-4 w-full grid-cols-2 md:grid-cols-4">
              {tabValues.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className={`text-xs sm:text-sm px-1 py-1.5 sm:px-2 sm:py-2 relative overflow-hidden ${activeTab === tab ? 'pricing-active-tab' : ''}`}
                >
                  <motion.div 
                    className="flex items-center gap-1 sm:gap-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.div 
                      className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${activeTab === tab ? "bg-primary" : "bg-gray-300"}`}
                      animate={activeTab === tab ? 
                        { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : 
                        { scale: 1, opacity: 0.7 }
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {tab === "printing" ? (
                      <span className="flex items-center">
                        Printing
                        {activeTab === tab && (
                          <motion.span
                            className="ml-1 inline-block"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <Printer className="h-3 w-3 text-primary-600" />
                          </motion.span>
                        )}
                      </span>
                    ) : tab === "binding" ? (
                      <span className="flex items-center">
                        Binding
                        {activeTab === tab && (
                          <motion.span
                            className="ml-1 inline-block"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <BookOpen className="h-3 w-3 text-primary-600" />
                          </motion.span>
                        )}
                      </span>
                    ) : tab === "plagiarism" ? (
                      <span className="flex items-center">
                        Plagiarism
                        {activeTab === tab && (
                          <motion.span
                            className="ml-1 inline-block"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <ShieldCheck className="h-3 w-3 text-primary-600" />
                          </motion.span>
                        )}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        AI Services
                        {activeTab === tab && (
                          <motion.span
                            className="ml-1 inline-block"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <Sparkles className="h-3 w-3 text-primary-600" />
                          </motion.span>
                        )}
                      </span>
                    )}
                  </motion.div>
                  
                  {activeTab === tab && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-50 via-primary-100/20 to-primary-50 opacity-50"
                      layoutId="activeTabBackground"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <motion.button 
              onClick={goToNextTab}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Next tab"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(229, 231, 235, 0.5)" }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </motion.button>
          </div>
          
          <div className="relative">
            {/* Progress bar */}
            <motion.div className="absolute -top-2 left-0 w-full h-0.5 bg-gray-200 rounded overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: progressWidth }}
              />
            </motion.div>
            
            <div className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}>
              <TabsContent value="printing" className="animate-fade-in space-y-2">
                <AnimatePresence mode="wait">
                  {activeTab === "printing" && (
                    <motion.div
                      key="printing"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}
                    >
                      <motion.div variants={cardVariants} className="pricing-float">
                        <Card className="overflow-hidden relative shadow-md border-primary-100">
                          <PricingBadge text="Most Popular" />
                          <CardContent className="pt-4 sm:pt-6">
                            <motion.h3 
                              className="font-serif text-lg xs:text-xl font-semibold mb-3 sm:mb-4 text-center text-primary"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              Printing Prices (Per Page)
                            </motion.h3>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <motion.th 
                                      scope="col" 
                                      className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      Paper Type
                                    </motion.th>
                                    <motion.th 
                                      scope="col" 
                                      className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      B&W
                                    </motion.th>
                                    <motion.th 
                                      scope="col" 
                                      className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.3 }}
                                    >
                                      Color
                                    </motion.th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {[
                                    { type: "Normal Paper", bw: "₹1", color: "₹5" },
                                    { type: "Bond Paper 80 GSM", bw: "₹2", color: "₹6" },
                                    { type: "Bond Paper 90 GSM", bw: "₹2.5", color: "₹6.5" },
                                    { type: "Bond Paper 100 GSM", bw: "₹3", color: "₹7" }
                                  ].map((row, index) => (
                                    <motion.tr 
                                      key={index}
                                      variants={tableRowVariants}
                                      custom={index}
                                      initial="hidden"
                                      animate="visible"
                                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                    >
                                      <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{row.type}</td>
                                      <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.bw}</td>
                                      <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.color}</td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <motion.p 
                              className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 italic"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              Note: Color printing adds ₹4 per page to the base price.
                            </motion.p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="binding" className="animate-fade-in space-y-2">
                <AnimatePresence mode="wait">
                  {activeTab === "binding" && (
                    <motion.div
                      key="binding"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}
                    >
                      <motion.div variants={cardVariants} className="pricing-float">
                        <Card className="overflow-hidden relative shadow-md border-primary-100">
                          <CardContent className="pt-4 sm:pt-6">
                            <motion.h3 
                              className="font-serif text-lg xs:text-xl font-semibold mb-3 sm:mb-4 text-center text-primary"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              Binding Prices
                            </motion.h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              >
                                <h4 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Hard Binding Options</h4>
                                <div className="overflow-x-auto -mx-4 sm:mx-0">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {[
                                        { type: "Normal", price: "₹120" },
                                        { type: "High Quality", price: "₹220" },
                                        { type: "Gloss Quality", price: "₹250" },
                                        { type: "Emboss Quality*", price: "₹350" }
                                      ].map((row, index) => (
                                        <motion.tr 
                                          key={index}
                                          variants={tableRowVariants}
                                          custom={index}
                                          initial="hidden"
                                          animate="visible"
                                          whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                        >
                                          <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{row.type}</td>
                                          <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.price}</td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <motion.p 
                                  className="mt-2 text-xs sm:text-sm text-gray-500 italic"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  *Minimum 4 copies required for Emboss Quality.
                                </motion.p>
                              </motion.div>
                              
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                              >
                                <h4 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Other Binding Options</h4>
                                <div className="overflow-x-auto -mx-4 sm:mx-0">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {[
                                        { type: "Soft Binding", price: "₹40" },
                                        { type: "Spiral Binding", price: "₹30" }
                                      ].map((row, index) => (
                                        <motion.tr 
                                          key={index}
                                          variants={tableRowVariants}
                                          custom={index}
                                          initial="hidden"
                                          animate="visible"
                                          whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                        >
                                          <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{row.type}</td>
                                          <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{row.price}</td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <motion.p 
                                  className="mt-2 text-xs sm:text-sm text-gray-500 italic"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  Note: Printing charges are not included in binding prices.
                                </motion.p>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="plagiarism" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-center text-primary">Plagiarism Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">Plagiarism Check (Turnitin)</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹399</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">Plagiarism Removal</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹899</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-center text-primary">AI Plagiarism Services</h3>
                    <p className="text-center text-gray-600 mb-6">
                      Our AI-powered services help ensure your content is free from both traditional and AI-generated plagiarism
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">AI Plagiarism Check</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹399</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">AI Plagiarism Removal</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹899</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
          
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {activeTab === "printing" && (
              <Link to="/print-order">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-black relative overflow-hidden group">
                    <motion.span
                      className="absolute inset-0 w-0 bg-white/10 z-0"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="relative z-10">Start Printing Order</span>
                  </Button>
                </motion.div>
              </Link>
            )}
            {activeTab === "binding" && (
              <Link to="/binding-order">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-black relative overflow-hidden group">
                    <motion.span
                      className="absolute inset-0 w-0 bg-white/10 z-0"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="relative z-10">Start Binding Order</span>
                  </Button>
                </motion.div>
              </Link>
            )}
            {(activeTab === "plagiarism" || activeTab === "ai") && (
              <Link to="/plagiarism-order">
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-black relative overflow-hidden group">
                    <motion.span
                      className="absolute inset-0 w-0 bg-white/10 z-0"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="relative z-10">Start Plagiarism Order</span>
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </Tabs>
        
        {/* Dot indicators at the bottom */}
        <div className="flex justify-center mt-6 space-x-2">
          {tabValues.map((tab, index) => (
            <motion.button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`rounded-full transition-all duration-300 ${
                activeTab === tab 
                  ? 'w-6 bg-primary' 
                  : 'w-1.5 h-1.5 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              initial={{ opacity: 0.6 }}
              animate={{ 
                opacity: activeTab === tab ? 1 : 0.6,
                width: activeTab === tab ? 24 : 6,
                height: 6
              }}
              whileHover={{ 
                opacity: 1,
                scale: 1.2
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
