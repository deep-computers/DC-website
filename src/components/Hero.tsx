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
  const randomSize = Math.random() * 15 + 5; // Increased size variation
  const randomDuration = Math.random() * 15 + 10; // Longer animation duration
  const randomOpacity = Math.random() * 0.7 + 0.1; // Higher opacity for some particles
  
  return (
    <motion.div 
      className="absolute rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#D4AF37]/10"
      style={{ 
        left: `${randomX}%`, 
        top: `${randomY}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        filter: `blur(${Math.random() * 4}px)`, // Add blur for glow effect
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: randomOpacity, 
        scale: [0, 1, 0.8, 1],
        x: [0, Math.random() * 150 - 75],
        y: [0, Math.random() * -150],
        rotate: [0, Math.random() * 360],
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

// 3D Card with enhanced tilt effect
const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / (rect.height / 2) * 10; // Max 10deg tilt (increased)
    const tiltY = (centerX - x) / (rect.width / 2) * 10;
    
    setTiltValues({ x: tiltX, y: tiltY });
    setMousePosition({ x, y });
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
        transformPerspective: 1500,
        scale: isHovering ? 1.03 : 1, // Add subtle scale on hover
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 35,
      }}
      whileHover={{
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      {/* Background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-[#B8860B]/20 rounded-xl z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent z-0"
        initial={{ opacity: 0, left: "-100%", top: "-100%" }}
        animate={{ 
          opacity: isHovering ? 0.7 : 0, 
          left: isHovering ? "100%" : "-100%", 
          top: isHovering ? "100%" : "-100%" 
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Mouse follower glow */}
      {isHovering && (
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-[#D4AF37]/10 blur-xl z-0 pointer-events-none"
          animate={{
            x: mousePosition.x - 80,
            y: mousePosition.y - 80,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 25,
            mass: 0.8,
          }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Floating element with enhanced animations
const FloatingElement = ({ children, delay = 0, yOffset = 15, xOffset = 0, rotation = 0 }) => {
  return (
    <motion.div
      initial={{ y: 0, x: 0, rotate: 0 }}
      animate={{ 
        y: [-yOffset/2, yOffset/2], 
        x: [-xOffset/2, xOffset/2],
        rotate: [-rotation/2, rotation/2]
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 3,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Smooth text animation using clip-path and transforms
const AnimatedText = ({ text, className = "", once = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  
  // Apply different animation to each word without animating individual characters
  const words = text.split(' ');
  
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span 
          key={i} 
          className="inline-block mx-[0.15em] first:ml-0 overflow-hidden relative"
          style={{
            display: 'inline-block',
            willChange: 'transform'
          }}
        >
          <motion.span
            className="inline-block"
            style={{
              display: 'inline-block',
              willChange: 'transform'
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? {
              y: 0,
              opacity: 1
            } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.41, 0.0, 0.07, 1.0] // Custom bezier curve for a smooth elastic feel
            }}
          >
            {word}
          </motion.span>
        </motion.span>
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
    await animate(scope.current, { opacity: 0, y: -15, filter: "blur(5px)" }, { duration: 0.5, ease: "easeInOut" });
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    await animate(scope.current, { opacity: 1, y: 0, filter: "blur(0px)" }, { duration: 0.7, delay: 0.2, ease: "easeInOut" });
  };
  
  // Setup automatic rotation
  useEffect(() => {
    const intervalId = setInterval(rotateQuote, 6000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Generate particles
  useEffect(() => {
    const particleCount = 25; // Increased particle count
    const newParticles = Array.from({ length: particleCount }, (_, i) => i);
    setParticles(newParticles);
  }, []);
  
  return (
    <section className="relative min-h-[90vh] flex items-center py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white via-[#D4AF37]/5 to-white"
          animate={{ 
            background: [
              "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.05), white)",
              "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.1), white)",
              "linear-gradient(to bottom right, rgba(255,255,255,0.97), rgba(212, 175, 55, 0.08), white)",
              "linear-gradient(to bottom right, white, rgba(212, 175, 55, 0.05), white)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((index) => (
            <Particle key={index} index={index} />
          ))}
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/50 to-white pointer-events-none"></div>
        
        {/* Decorative blurs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <FloatingElement delay={0.5} yOffset={10} xOffset={5} rotation={2}>
              <div className="absolute -top-8 -left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
            </FloatingElement>
            
            <h1 className="font-serif text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight relative">
              {/* Combined header with simple, one-time animation */}
              <motion.div
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
              >
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Academic & Printing</span> Services for Students and Researchers
              </motion.div>
              
              {/* Underline effect */}
              <motion.span 
                className="absolute -z-10 bottom-2 left-0 h-4 bg-[#D4AF37]/20 w-0"
                animate={{ 
                  width: ["0%", "100%"], 
                  skewX: [0, -6],
                  skewY: [0, 2],
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.1, 0.25, 1.0],
                  delay: 0.8
                }}
              />
            </h1>
            
            {/* Quote Slideshow with enhanced animations */}
            <div className="relative h-[100px] xs:h-[90px] sm:h-[80px] md:h-[120px] mb-8 sm:mb-10 flex items-center">
              <motion.div 
                ref={scope}
                className="text-base xs:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              >
                {quotes[currentQuoteIndex]}
              </motion.div>
              
              {/* Quote indicators */}
              <div className="absolute -bottom-2 left-0 flex space-x-2">
                {quotes.map((_, index) => (
                  <motion.div 
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      currentQuoteIndex === index 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' 
                        : 'bg-gray-200'
                    }`}
                    animate={{ 
                      width: currentQuoteIndex === index ? "2rem" : "0.375rem",
                      opacity: currentQuoteIndex === index ? 1 : 0.5,
                      scale: currentQuoteIndex === index ? 1 : 0.8,
                    }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    onClick={() => {
                      setCurrentQuoteIndex(index);
                      animate(scope.current, { opacity: 1, y: 0, filter: "blur(0px)" }, { duration: 0.5 });
                    }}
                  />
                ))}
              </div>
            </div>
            
            <motion.div 
              className="flex flex-col xs:flex-row gap-4 xs:gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
            >
              <Link to="/services" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                  Explore Our Services
                    <motion.span
                      className="ml-2 flex items-center" 
                      animate={{ 
                        x: [0, 5, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full transform-gpu group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"></span>
                </Button>
              </Link>
              <Link to="/print-order" className="group">
                <Button size="lg" 
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                >
                  <motion.span 
                    className="mr-2 text-[#D4AF37]" 
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                    }}
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
            className="grid grid-cols-1 xs:grid-cols-2 gap-5 sm:gap-7"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: 0.1
            }}
          >
            {/* Print Order Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.15)" 
              }}
            >
              <TiltCard className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-100">
                <Link to="/print-order" className="block h-full">
                  <FloatingElement delay={0.2} yOffset={10} rotation={3}>
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative">
                      <Printer className="h-7 w-7 text-white" />
                      <motion.div 
                        className="absolute -inset-2 rounded-xl border-2 border-[#D4AF37]/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </FloatingElement>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300">Printing & Binding</h3>
                  <p className="text-gray-600">Professional printing services with various paper and binding options.</p>
                  <motion.div 
                    className="mt-5 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.p 
                      className="text-sm text-[#D4AF37] font-medium flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Order Now 
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.p>
                  </motion.div>
                </Link>
              </TiltCard>
            </motion.div>
            
            {/* Academic Writing Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.15)" 
              }}
            >
              <TiltCard className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-100">
                <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer" className="block h-full">
                  <FloatingElement delay={0.4} yOffset={10} rotation={3}>
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative">
                      <BookOpen className="h-7 w-7 text-white" />
                      <motion.div 
                        className="absolute -inset-2 rounded-xl border-2 border-[#D4AF37]/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </FloatingElement>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300">Academic Writing</h3>
                  <p className="text-gray-600">Expert assistance with thesis, research papers, dissertations, and more.</p>
                  <motion.div 
                    className="mt-5 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  >
                    <motion.p 
                      className="text-sm text-[#D4AF37] font-medium flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Contact Us 
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.p>
                  </motion.div>
                </a>
              </TiltCard>
            </motion.div>
            
            {/* Plagiarism Services Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.15)" 
              }}
            >
              <TiltCard className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-100">
                <Link to="/plagiarism-order" className="block h-full">
                  <FloatingElement delay={0.6} yOffset={10} rotation={3}>
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative">
                      <FileText className="h-7 w-7 text-white" />
                      <motion.div 
                        className="absolute -inset-2 rounded-xl border-2 border-[#D4AF37]/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </FloatingElement>
                  <h3 className="font-serif text-xl font-semibold mb-3 text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300">Plagiarism Services</h3>
                  <p className="text-gray-600">Comprehensive plagiarism checking and removal services.</p>
                  <motion.div 
                    className="mt-5 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  >
                    <motion.p 
                      className="text-sm text-[#D4AF37] font-medium flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Order Now 
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.p>
                  </motion.div>
                </Link>
              </TiltCard>
            </motion.div>
            
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.15)" 
              }}
            >
              <TiltCard className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FloatingElement delay={0.8} yOffset={10} rotation={3}>
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative">
                      <MessageCircle className="h-7 w-7 text-white" />
                      <motion.div 
                        className="absolute -inset-2 rounded-xl border-2 border-[#D4AF37]/20"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </FloatingElement>
                  <p className="font-serif text-xl font-semibold text-gray-900 mb-3">Need help?</p>
                  <p className="text-gray-600 mb-5">Get quick answers to your questions via WhatsApp.</p>
                  <motion.a 
                    href="https://wa.me/919311244099" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                    whileHover={{ 
                      boxShadow: "0 10px 25px -3px rgba(212, 175, 55, 0.3)",
                      y: -5
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center">
                      WhatsApp Now
                      <motion.span
                        className="ml-2" 
                        animate={{ 
                          x: [0, 5, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatType: "loop", 
                          ease: "easeInOut" 
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 w-0 bg-white/30 z-0"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.a>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
