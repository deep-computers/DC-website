import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Printer, BookOpen, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, Zap, Crown, Award, Tag, Gem, Star, TrendingUp, CreditCard, CheckCircle2, BadgeCheck } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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
      y: 30,
      scale: 0.92,
      rotateX: 5,
      rotateY: -5,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      rotateX: -5,
      scale: 0.95,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
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
  
  // Badge component for special prices with enhanced styling
  const PricingBadge = ({ text, type = "popular" }: { text: string; type?: "popular" | "new" | "best" }) => {
    const badgeColors = {
      popular: "from-amber-500 to-amber-600", 
      new: "from-blue-500 to-indigo-600",
      best: "from-emerald-500 to-teal-600"
    };
    
    const Icon = type === "popular" ? Crown : type === "new" ? Zap : Award;
    
    return (
      <div className="absolute -right-12 top-5 rotate-45 z-10">
        <div className={`py-1.5 px-12 text-xs text-white font-medium shadow-md bg-gradient-to-r ${badgeColors[type]} flex justify-center items-center gap-1.5 pricing-badge`}>
          <Icon size={12} className="inline-block animate-pulse" />
          {text}
        </div>
      </div>
    );
  };
  
  // 3D Card component for pricing
  const PricingCard = ({ children, className, isPopular = false, badge = null }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const inView = useInView(cardRef, { once: false, amount: 0.3 });
    
    const handleMouseMove = useCallback((e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      setRotation({ x: rotateX, y: rotateY });
    }, []);
    
    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };
    
    return (
      <motion.div 
        ref={cardRef}
        className={cn(
          "perspective-1000 relative",
          className,
          isPopular ? "z-10" : "z-0"
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.2s ease-out"
        }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={cardVariants}
        whileHover="hover"
      >
        <div className={cn(
          "h-full rounded-xl overflow-hidden relative", 
          isPopular ? "pricing-card-premium border-2 border-amber-400/20" : "border border-gray-200",
          "bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-300"
        )}>
          {badge && badge}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-amber-50/50 via-transparent to-transparent transition-opacity duration-300"></div>
          {isPopular && (
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 to-transparent opacity-50 pointer-events-none"></div>
          )}
          {children}
        </div>
      </motion.div>
    );
  };
  
  // Animation for progress bar
  const progressAnimation = useSpring(progress);
  const progressWidth = useTransform(progressAnimation, (value) => `${value}%`);
  
  // Card feature checkmark component
  const FeatureItem = ({ text }) => (
    <motion.div 
      className="flex items-start gap-2 mb-2"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-700">{text}</span>
    </motion.div>
  );
  
  // Price tag component with animation
  const PriceTag = ({ price, period, isPopular = false }) => (
    <div className="flex flex-col items-center my-3">
      <motion.div 
        className={cn(
          "flex items-end", 
          isPopular ? "text-amber-700" : "text-gray-800"
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        <span className="text-lg font-medium">₹</span>
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        {period && <span className="text-lg text-gray-500 ml-1">{period}</span>}
      </motion.div>
    </div>
  );
  
  return (
    <section 
      id="pricing" 
      className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/pricing-pattern.svg')] opacity-[0.03] dark:opacity-[0.02]"></div>
        <div className="absolute top-[5%] left-[5%] w-72 h-72 bg-gradient-to-r from-amber-200/20 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[5%] right-[5%] w-72 h-72 bg-gradient-to-l from-amber-200/20 to-transparent rounded-full filter blur-3xl"></div>
        <motion.div 
          className="absolute -top-24 left-1/2 w-96 h-96 bg-gradient-to-b from-amber-100/20 via-amber-200/10 to-transparent rounded-full"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          {/* Enhanced animated sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            <Sparkle top={20} left={10} delay={0.5} size={5} color="#D4AF37" />
            <Sparkle top={80} left={80} delay={1.2} size={4} color="#B8860B" />
            <Sparkle top={30} left={90} delay={2.1} size={3} color="#D4AF37" />
            <Sparkle top={70} left={20} delay={1.7} size={6} color="#B8860B" />
            <Sparkle top={40} left={50} delay={0.8} size={4} color="#D4AF37" />
            <Sparkle top={10} left={40} delay={1.5} size={5} color="#B8860B" />
            <Sparkle top={60} left={60} delay={2.3} size={4} color="#D4AF37" />
          </div>
          
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 rounded-lg -z-10 bg-gradient-to-r from-amber-200/20 to-amber-400/20 blur-xl"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [0.95, 1.05, 0.95] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="font-serif text-3xl xs:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-3 sm:mb-5 relative py-2">
              Our Pricing
              <motion.span 
                className="absolute -z-10 bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/80 to-amber-600/80"
                initial={{ width: 0, left: "50%" }}
                whileInView={{ width: "100%", left: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h2>
          </div>
          
          <motion.p 
            className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Premium quality services at competitive rates
          </motion.p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.button 
              onClick={goToPrevTab}
              className="p-2 sm:p-3 rounded-full bg-white border border-gray-200 shadow-sm text-amber-600 hover:bg-amber-50 transition-all duration-300"
              aria-label="Previous tab"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            
            <TabsList className="grid flex-1 mx-3 sm:mx-5 w-full grid-cols-2 md:grid-cols-4 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-amber-100/50 shadow-lg">
              {tabValues.map((tab) => {
                const Icon = tab === "printing" ? Printer : 
                             tab === "binding" ? BookOpen : 
                             tab === "plagiarism" ? ShieldCheck : Sparkles;
                             
                return (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className={cn(
                      "relative text-sm sm:text-base px-2 py-2.5 sm:px-3 sm:py-3 overflow-hidden rounded-lg transition-all duration-300",
                      activeTab === tab ? 
                        "text-amber-900 font-medium z-10" : 
                        "text-gray-600 hover:text-amber-800"
                    )}
                  >
                    <div className="relative z-10">
                      <motion.div 
                        className="flex items-center justify-center gap-2"
                        whileHover={{ y: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <motion.div 
                          className={cn(
                            "flex items-center justify-center rounded-full p-1",
                            activeTab === tab ? 
                              "bg-amber-100 text-amber-600" : 
                              "bg-gray-100 text-gray-500"
                          )}
                          initial={false}
                          animate={activeTab === tab ? 
                            { scale: [1, 1.1, 1], rotate: [0, 2, 0] } : 
                            { scale: 1 }
                          }
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-4 w-4" />
                        </motion.div>
                        
                        <span className="relative">
                          {tab === "printing" ? "Printing" : 
                           tab === "binding" ? "Binding" : 
                           tab === "plagiarism" ? "Plagiarism" : "AI Services"}
                           
                          {activeTab === tab && (
                            <motion.span
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"
                              initial={{ width: 0, left: "50%" }}
                              animate={{ width: "100%", left: 0 }}
                              exit={{ width: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </span>
                      </motion.div>
                    </div>
                    
                    {activeTab === tab && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50/60"
                        layoutId="activeTabBackground"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <motion.button 
              onClick={goToNextTab}
              className="p-2 sm:p-3 rounded-full bg-white border border-gray-200 shadow-sm text-amber-600 hover:bg-amber-50 transition-all duration-300"
              aria-label="Next tab"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
                      <PricingCard 
                        isPopular={true} 
                        className="max-w-4xl mx-auto"
                        badge={<PricingBadge text="Most Popular" type="popular" />}
                      >
                        <CardContent className="pt-6 pb-8 px-6 sm:px-8">
                          <motion.div 
                            className="flex items-center justify-center gap-2 mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Printer className="h-5 w-5 text-amber-500" />
                            <h3 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                              Printing Prices
                            </h3>
                          </motion.div>

                          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                            <div className="flex-1">
                              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                                <motion.div 
                                  className="text-center mb-4"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <h4 className="text-amber-800 font-medium mb-1">Per Page Pricing</h4>
                                  <p className="text-sm text-gray-500">Quality prints for every need</p>
                                </motion.div>
                                
                                <div className="overflow-hidden rounded-lg border border-amber-100">
                                  <table className="w-full divide-y divide-amber-100">
                                    <thead className="bg-amber-50">
                                      <tr>
                                        <motion.th 
                                          scope="col" 
                                          className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 0.1 }}
                                        >
                                          Paper Type
                                        </motion.th>
                                        <motion.th 
                                          scope="col" 
                                          className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 0.2 }}
                                        >
                                          B&W
                                        </motion.th>
                                        <motion.th 
                                          scope="col" 
                                          className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 0.3 }}
                                        >
                                          Color
                                        </motion.th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-amber-50">
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
                                          whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                          className="transition-colors duration-200"
                                        >
                                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.type}</td>
                                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{row.bw}</td>
                                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">{row.color}</td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="h-full bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md flex flex-col">
                                <motion.div 
                                  className="text-center mb-4"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <h4 className="text-amber-800 font-medium mb-1">Special Features</h4>
                                  <p className="text-sm text-gray-500">Additional print options</p>
                                </motion.div>
                                
                                <div className="flex-1 flex flex-col justify-between">
                                  <div className="space-y-3">
                                    <FeatureItem text="Double-sided printing available" />
                                    <FeatureItem text="Multiple copies with discount" />
                                    <FeatureItem text="High-quality photo prints" />
                                    <FeatureItem text="A3, A4, A5 & custom sizes" />
                                  </div>
                                  
                                  <motion.div 
                                    className="mt-5 bg-amber-100/50 rounded-lg p-3 border border-amber-200/50"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    <p className="text-sm text-amber-800 flex items-start gap-2">
                                      <Tag size={16} className="mt-0.5 flex-shrink-0" />
                                      <span>Bulk printing discounts available - ask for details!</span>
                                    </p>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </PricingCard>
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
                      <PricingCard 
                        className="max-w-4xl mx-auto"
                        badge={<PricingBadge text="Premium" type="best" />}
                      >
                        <CardContent className="pt-6 pb-8 px-6 sm:px-8">
                          <motion.div 
                            className="flex items-center justify-center gap-2 mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <BookOpen className="h-5 w-5 text-amber-500" />
                            <h3 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                              Binding Services
                            </h3>
                          </motion.div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                              <motion.div
                                className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="bg-amber-100 p-1.5 rounded-md">
                                  <Award className="h-4 w-4 text-amber-600" />
                                </div>
                                <h4 className="text-amber-800 font-medium">Hard Binding Options</h4>
                              </motion.div>
                              
                              <div className="overflow-hidden rounded-lg border border-amber-100">
                                <table className="w-full divide-y divide-amber-100">
                                  <thead className="bg-amber-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Type
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-amber-50">
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
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                        className="transition-colors duration-200"
                                      >
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.type}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{row.price}</td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <motion.div 
                                className="mt-3 bg-amber-50 rounded-lg p-2.5 border border-amber-100 flex items-start gap-2"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                              >
                                <CreditCard className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800">
                                  *Minimum 4 copies required for Emboss Quality binding.
                                </p>
                              </motion.div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                                <motion.div
                                  className="flex items-center gap-2 mb-4"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <div className="bg-amber-100 p-1.5 rounded-md">
                                    <Tag className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <h4 className="text-amber-800 font-medium">Other Binding Options</h4>
                                </motion.div>
                                
                                <div className="overflow-hidden rounded-lg border border-amber-100">
                                  <table className="w-full divide-y divide-amber-100">
                                    <thead className="bg-amber-50">
                                      <tr>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-amber-50">
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
                                          whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                          className="transition-colors duration-200"
                                        >
                                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.type}</td>
                                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600">{row.price}</td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                                <motion.div
                                  className="flex items-center gap-2 mb-3"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <div className="bg-amber-100 p-1.5 rounded-md">
                                    <Gem className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <h4 className="text-amber-800 font-medium">Premium Features</h4>
                                </motion.div>
                                
                                <div className="space-y-2">
                                  <FeatureItem text="Custom cover designs" />
                                  <FeatureItem text="Thesis & dissertation formats" />
                                  <FeatureItem text="Title page embossing available" />
                                  <FeatureItem text="Rush orders accepted" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </PricingCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="plagiarism" className="animate-fade-in space-y-2">
                <AnimatePresence mode="wait">
                  {activeTab === "plagiarism" && (
                    <motion.div
                      key="plagiarism"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}
                    >
                      <PricingCard 
                        className="max-w-4xl mx-auto"
                        badge={<PricingBadge text="Academic" type="new" />}
                      >
                        <CardContent className="pt-6 pb-8 px-6 sm:px-8">
                          <motion.div 
                            className="flex items-center justify-center gap-2 mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <ShieldCheck className="h-5 w-5 text-amber-500" />
                            <h3 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                              Plagiarism Services
                            </h3>
                          </motion.div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                              <motion.div
                                className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="bg-amber-100 p-1.5 rounded-md">
                                  <BadgeCheck className="h-4 w-4 text-amber-600" />
                                </div>
                                <h4 className="text-amber-800 font-medium">Plagiarism Check (Turnitin)</h4>
                              </motion.div>
                              
                              <div className="overflow-hidden rounded-lg border border-amber-100">
                                <table className="w-full divide-y divide-amber-100">
                                  <thead className="bg-amber-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Page Range
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-amber-50">
                                    {[
                                      { range: "1–50 Pages", price: "₹399" },
                                      { range: "51–100 Pages", price: "₹699" },
                                      { range: "101–150 Pages", price: "₹1099" }
                                    ].map((row, index) => (
                                      <motion.tr 
                                        key={index}
                                        variants={tableRowVariants}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                        className="transition-colors duration-200"
                                      >
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.range}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">{row.price}</td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <motion.div 
                                className="mt-3 bg-amber-50 rounded-lg p-2.5 border border-amber-100 flex items-start gap-2"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800">
                                  Professional Turnitin report provided with detailed analysis.
                                </p>
                              </motion.div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                              <motion.div
                                className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                <div className="bg-amber-100 p-1.5 rounded-md">
                                  <TrendingUp className="h-4 w-4 text-amber-600" />
                                </div>
                                <h4 className="text-amber-800 font-medium">Plagiarism Removal</h4>
                              </motion.div>
                              
                              <div className="overflow-hidden rounded-lg border border-amber-100">
                                <table className="w-full divide-y divide-amber-100">
                                  <thead className="bg-amber-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Page Range
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-amber-50">
                                    {[
                                      { range: "1–50 Pages", price: "₹899" },
                                      { range: "51–100 Pages", price: "₹1699" },
                                      { range: "101–150 Pages", price: "₹2099" }
                                    ].map((row, index) => (
                                      <motion.tr 
                                        key={index}
                                        variants={tableRowVariants}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                        className="transition-colors duration-200"
                                      >
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.range}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">{row.price}</td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <FeatureItem text="Expert academic writing assistance" />
                                <FeatureItem text="Complete rewriting of plagiarized content" />
                                <FeatureItem text="24-48 hour turnaround available" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </PricingCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="ai" className="animate-fade-in space-y-2">
                <AnimatePresence mode="wait">
                  {activeTab === "ai" && (
                    <motion.div
                      key="ai"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}
                    >
                      <PricingCard 
                        className="max-w-4xl mx-auto"
                        badge={<PricingBadge text="Advanced" type="new" />}
                      >
                        <CardContent className="pt-6 pb-8 px-6 sm:px-8">
                          <motion.div 
                            className="flex items-center justify-center gap-2 mb-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h3 className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                              AI Plagiarism Services
                            </h3>
                          </motion.div>
                          
                          <motion.p 
                            className="text-center text-gray-600 mb-6 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Our AI-powered services help ensure your content is free from both traditional and AI-generated plagiarism detection
                          </motion.p>
  
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                              <motion.div
                                className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="bg-amber-100 p-1.5 rounded-md">
                                  <Zap className="h-4 w-4 text-amber-600" />
                                </div>
                                <h4 className="text-amber-800 font-medium">AI Detection Prevention</h4>
                              </motion.div>
                              
                              <div className="overflow-hidden rounded-lg border border-amber-100">
                                <table className="w-full divide-y divide-amber-100">
                                  <thead className="bg-amber-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Page Range
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-amber-50">
                                    {[
                                      { range: "1–10 Pages", price: "₹599" },
                                      { range: "11–30 Pages", price: "₹999" },
                                      { range: "31–50 Pages", price: "₹1599" }
                                    ].map((row, index) => (
                                      <motion.tr 
                                        key={index}
                                        variants={tableRowVariants}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                        className="transition-colors duration-200"
                                      >
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.range}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">{row.price}</td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <FeatureItem text="Bypass AI detection tools" />
                                <FeatureItem text="Maintain content meaning & quality" />
                                <FeatureItem text="100% confidential service" />
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100 shadow-md">
                              <motion.div
                                className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                <div className="bg-amber-100 p-1.5 rounded-md">
                                  <Gem className="h-4 w-4 text-amber-600" />
                                </div>
                                <h4 className="text-amber-800 font-medium">AI Content Humanization</h4>
                              </motion.div>
                              
                              <div className="overflow-hidden rounded-lg border border-amber-100">
                                <table className="w-full divide-y divide-amber-100">
                                  <thead className="bg-amber-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Page Range
                                      </th>
                                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-amber-50">
                                    {[
                                      { range: "1–10 Pages", price: "₹799" },
                                      { range: "11–30 Pages", price: "₹1499" },
                                      { range: "31–50 Pages", price: "₹2199" }
                                    ].map((row, index) => (
                                      <motion.tr 
                                        key={index}
                                        variants={tableRowVariants}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                                        className="transition-colors duration-200"
                                      >
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-800">{row.range}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 font-medium">{row.price}</td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <motion.div 
                                className="mt-3 bg-amber-50 rounded-lg p-2.5 border border-amber-100 flex items-start gap-2"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                <Star className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800">
                                  Transforms AI-generated content to pass as human-written with natural language patterns.
                                </p>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </PricingCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </div>
          </div>
          
          <motion.div 
            className="text-center mt-10 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {activeTab === "printing" && (
              <Link to="/print-order">
                <motion.div
                  className="inline-block"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                    <Button className="relative bg-gradient-to-r from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400 hover:from-amber-400 hover:to-amber-600 text-black font-medium shadow-lg rounded-full px-6 py-6 overflow-hidden border-0">
                      <motion.span
                        className="absolute inset-0 w-0 bg-white/20 z-0"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <Printer size={18} className="text-amber-900" />
                        <span className="text-amber-950 font-bold tracking-wide">Start Printing Order</span>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              </Link>
            )}
            {activeTab === "binding" && (
              <Link to="/binding-order">
                <motion.div
                  className="inline-block"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                    <Button className="relative bg-gradient-to-r from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400 hover:from-amber-400 hover:to-amber-600 text-black font-medium shadow-lg rounded-full px-6 py-6 overflow-hidden border-0">
                      <motion.span
                        className="absolute inset-0 w-0 bg-white/20 z-0"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <BookOpen size={18} className="text-amber-900" />
                        <span className="text-amber-950 font-bold tracking-wide">Start Binding Order</span>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              </Link>
            )}
            {(activeTab === "plagiarism" || activeTab === "ai") && (
              <Link to="/plagiarism-order">
                <motion.div
                  className="inline-block"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                    <Button className="relative bg-gradient-to-r from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400 hover:from-amber-400 hover:to-amber-600 text-black font-medium shadow-lg rounded-full px-6 py-6 overflow-hidden border-0">
                      <motion.span
                        className="absolute inset-0 w-0 bg-white/20 z-0"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-amber-900" />
                        <span className="text-amber-950 font-bold tracking-wide">Start Plagiarism Order</span>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              </Link>
            )}
            
            <motion.div 
              className="relative mt-6 mx-auto max-w-xs text-center bg-amber-50 rounded-lg px-4 py-2 border border-amber-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-xs text-amber-800 flex items-center justify-center gap-1.5">
                <Star size={12} className="text-amber-500" />
                <span>100% satisfaction guaranteed</span>
                <Star size={12} className="text-amber-500" />
              </p>
            </motion.div>
          </motion.div>
        </Tabs>
        
        {/* Enhanced dot indicators at the bottom */}
        <div className="flex justify-center mt-2 mb-4 space-x-3">
          {tabValues.map((tab, index) => {
            const Icon = tab === "printing" ? Printer : 
                         tab === "binding" ? BookOpen : 
                         tab === "plagiarism" ? ShieldCheck : Sparkles;
            return (
              <motion.button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-300 border",
                  activeTab === tab 
                    ? "bg-amber-100 border-amber-300" 
                    : "bg-gray-100 border-gray-200 hover:bg-amber-50 hover:border-amber-200"
                )}
                aria-label={`Go to slide ${index + 1}`}
                initial={{ opacity: 0.7 }}
                animate={{ 
                  opacity: activeTab === tab ? 1 : 0.7,
                  width: activeTab === tab ? 36 : 30,
                  height: activeTab === tab ? 36 : 30
                }}
                whileHover={{ 
                  opacity: 1,
                  scale: 1.1
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={activeTab === tab ? 16 : 14} className={activeTab === tab ? "text-amber-600" : "text-gray-400"} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
