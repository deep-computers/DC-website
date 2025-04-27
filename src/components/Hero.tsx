import { Button } from "@/components/ui/button";
import { BookOpen, Printer, FileText, ArrowRight, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimate, useInView } from "framer-motion";

// Particle component for background animation
const Particle = ({ index }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDelay = Math.random() * 2;
  const randomSize = Math.random() * 10 + 5;
  const randomDuration = Math.random() * 10 + 15;
  const randomOpacity = Math.random() * 0.5 + 0.1;
  
  return (
    <motion.div 
      className="absolute rounded-full bg-[#D4AF37]/20"
      style={{ 
        left: `${randomX}%`, 
        top: `${randomY}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: randomOpacity, 
        scale: 1,
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * -100],
      }}
      transition={{ 
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

// 3D Card with tilt effect
const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / (rect.height / 2) * 5; // Max 5deg tilt
    const tiltY = (centerX - x) / (rect.width / 2) * 5;
    
    setTiltValues({ x: tiltX, y: tiltY });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setTiltValues({ x: 0, y: 0 });
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: tiltValues.x,
        rotateY: tiltValues.y,
        transformPerspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-[#B8860B]/20 rounded-xl z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-0"
        initial={{ opacity: 0, left: "-100%", top: "-100%" }}
        animate={{ 
          opacity: isHovering ? 0.5 : 0, 
          left: isHovering ? "100%" : "-100%", 
          top: isHovering ? "100%" : "-100%" 
        }}
        transition={{ duration: 0.8 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Floating element with subtle animation
const FloatingElement = ({ children, delay = 0, yOffset = 15 }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-yOffset/2, yOffset/2] }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2.5,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Text animation
const AnimatedText = ({ text, className = "", once = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });
  
  const words = text.split(' ');
  
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block mx-[0.15em] first:ml-0">
          {word.split('').map((char, j) => (
            <motion.span
              key={j}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: i * 0.1 + j * 0.03,
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

const Hero = () => {
  // Array of quotes for the slideshow
  const quotes = [
    "Professional printing, binding, thesis writing, and plagiarism checking services to help you excel in your academic journey.",
    "Turn your academic work into professionally presented documents with our comprehensive printing and binding solutions.",
    "Get expert assistance with plagiarism checking and removal to ensure your academic integrity remains uncompromised.",
    "From rough drafts to polished presentations, we provide end-to-end services for all your academic document needs.",
    "Quality academic services designed by students, for students - helping you achieve academic excellence."
  ];
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [scope, animate] = useAnimate();
  const [particles, setParticles] = useState([]);
  
  // Function to handle quote rotation with enhanced animation
  const rotateQuote = async () => {
    await animate(scope.current, { opacity: 0, y: -10 }, { duration: 0.5 });
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    await animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.1 });
  };
  
  // Setup automatic rotation
  useEffect(() => {
    const intervalId = setInterval(rotateQuote, 6000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Generate particles
  useEffect(() => {
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }, (_, i) => i);
    setParticles(newParticles);
  }, []);
  
  return (
    <section className="relative min-h-[90vh] flex items-center py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white via-[#D4AF37]/5 to-white"
          animate={{ background: [
            "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.05), white)",
            "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.08), white)",
            "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.05), white)"
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((index) => (
            <Particle key={index} index={index} />
          ))}
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/50 to-white pointer-events-none"></div>
      </div>

      <div className="container relative px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <FloatingElement delay={0.5} yOffset={10}>
              <div className="absolute -top-8 -left-10 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
            </FloatingElement>
            
            <h1 className="font-serif text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight relative">
              <AnimatedText 
                text="Academic & Printing" 
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent"
              />
              <motion.span 
                className="absolute -z-10 bottom-2 left-0 h-4 bg-[#D4AF37]/20 w-0"
                animate={{ width: ["0%", "100%"], skewX: [0, -6] }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              />
              <br />
              <AnimatedText text="Services for Students" />
            </h1>
            
            {/* Quote Slideshow with enhanced animations */}
            <div className="relative h-[100px] xs:h-[90px] sm:h-[80px] md:h-[120px] mb-8 sm:mb-10 flex items-center">
              <motion.div 
                ref={scope}
                className="text-base xs:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {quotes[currentQuoteIndex]}
              </motion.div>
              
              {/* Quote indicators */}
              <div className="absolute -bottom-2 left-0 flex space-x-2">
                {quotes.map((_, index) => (
                  <motion.div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentQuoteIndex === index 
                        ? 'bg-[#D4AF37]' 
                        : 'bg-gray-300'
                    }`}
                    animate={{ 
                      width: currentQuoteIndex === index ? "1.5rem" : "0.375rem",
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                      setCurrentQuoteIndex(index);
                      animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.5 });
                    }}
                  />
                ))}
              </div>
            </div>
            
            <motion.div 
              className="flex flex-col xs:flex-row gap-4 xs:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Link to="/services" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                  Explore Our Services
                    <motion.span
                      className="ml-2 flex items-center" 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full transform-gpu group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"></span>
                </Button>
              </Link>
              <Link to="/print-order" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <motion.span 
                    className="mr-2 text-[#D4AF37]" 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Printer className="h-4 w-4" />
                  </motion.span>
                  Print Documents
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Service Cards */}
          <motion.div 
            className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Print Order Card */}
            <TiltCard className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <Link to="/print-order" className="block h-full">
                <FloatingElement delay={0.2} yOffset={8}>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3">
                  <Printer className="h-6 w-6 text-white" />
                </div>
                </FloatingElement>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Printing & Binding</h3>
                <p className="text-gray-600">Professional printing services with various paper and binding options.</p>
                <motion.p 
                  className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Order Now 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.p>
            </Link>
            </TiltCard>
            
            {/* Academic Writing Card */}
            <TiltCard className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer" className="block h-full">
                <FloatingElement delay={0.4} yOffset={8}>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                </FloatingElement>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Academic Writing</h3>
                <p className="text-gray-600">Expert assistance with thesis, research papers, dissertations, and more.</p>
                <motion.p 
                  className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Contact Us 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.p>
            </a>
            </TiltCard>
            
            {/* Plagiarism Services Card */}
            <TiltCard className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <Link to="/plagiarism-order" className="block h-full">
                <FloatingElement delay={0.6} yOffset={8}>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                </FloatingElement>
                <h3 className="font-serif text-lg font-semibold mb-2 text-gray-900">Plagiarism Services</h3>
                <p className="text-gray-600">Comprehensive plagiarism checking and removal services.</p>
                <motion.p 
                  className="text-sm text-[#D4AF37] mt-4 font-medium flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Order Now 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.p>
            </Link>
            </TiltCard>
            
            {/* Contact Card */}
            <TiltCard className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FloatingElement delay={0.8} yOffset={8}>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                </FloatingElement>
                <p className="font-serif text-lg font-semibold text-gray-900 mb-4">Need help?</p>
                <motion.a 
                  href="https://wa.me/919311244099" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                  whileHover={{ boxShadow: "0 10px 15px -3px rgba(212, 175, 55, 0.3)" }}
                >
                  <span className="relative z-10 flex items-center">
                    WhatsApp Now
                    <motion.span
                      className="ml-2" 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 w-0 bg-white/20 z-0"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.a>
              </div>
            </TiltCard>
          </motion.div>
        </div>
        
        {/* Scrolling indicator at bottom */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-xs text-gray-500 mb-2">Scroll to explore</p>
          <motion.div 
            className="w-5 h-9 border-2 border-[#D4AF37]/30 rounded-full flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-2 bg-[#D4AF37] rounded-full mt-1"
              animate={{ 
                y: [0, 15, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                times: [0, 0.5, 1]
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
