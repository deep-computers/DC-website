import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";

const Services = () => {
  // Add keyframe animations through JavaScript
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes printer-led-animation {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      
      @keyframes paper-print-animation {
        0% { transform: translateY(-5px); opacity: 0; }
        20% { transform: translateY(0); opacity: 1; }
        80% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(5px); opacity: 0; }
      }
      
      @keyframes book-binding-animation {
        0%, 100% { transform: rotateY(0deg); }
        50% { transform: rotateY(-30deg); }
      }
      
      @keyframes book-page-animation {
        0% { transform: rotateY(0deg); }
        25% { transform: rotateY(-120deg); }
        50% { transform: rotateY(-120deg); }
        100% { transform: rotateY(0deg); }
      }
      
      @keyframes writing-animation {
        0% { width: 0%; }
        100% { width: 100%; }
      }
      
      @keyframes cursor-blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      
      @keyframes scan-animation {
        0% { transform: translateY(0); }
        50% { transform: translateY(5px); }
        100% { transform: translateY(0); }
      }
      
      @keyframes highlight-animation {
        0% { opacity: 0; width: 0; }
        50% { opacity: 1; width: 80%; }
        100% { opacity: 0; width: 0; }
      }
      
      @keyframes ai-pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      
      @keyframes float-shadow {
        0%, 100% { 
          box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.1),
                      0 5px 10px -5px rgba(212, 175, 55, 0.04);
        }
        50% { 
          box-shadow: 0 15px 30px -5px rgba(212, 175, 55, 0.2),
                      0 10px 15px -5px rgba(212, 175, 55, 0.1);
        }
      }
      
      @keyframes gradient-shine {
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
      
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        20% { opacity: 1; transform: scale(1.2) rotate(20deg); }
        80% { opacity: 1; transform: scale(1.2) rotate(-20deg); }
      }
      
      .card-animate {
        animation: float-shadow 5s ease-in-out infinite;
      }
      
      .shine-badge {
        background: linear-gradient(
          90deg,
          rgba(212, 175, 55, 0.6) 0%,
          rgba(184, 134, 11, 0.8) 50%,
          rgba(212, 175, 55, 0.6) 100%
        );
        background-size: 200% auto;
        animation: gradient-shine 4s linear infinite;
      }
    `;
    
    // Append the style element to the head
    document.head.appendChild(styleEl);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Services data
  const services = [
    {
      iconAnimation: "print",
      title: "Printing Services",
      description: "High-quality black & white and color printing on various paper types including normal paper, bond paper (80 GSM, 90 GSM, 100 GSM).",
      details: ["Normal Paper", "Bond Paper 80 GSM", "Bond Paper 90 GSM", "Bond Paper 100 GSM", "Color & Black/White Options"],
      actionLink: "/print-order",
      actionText: "Order Prints",
      badge: "Popular"
    },
    {
      iconAnimation: "binding",
      title: "Binding Solutions",
      description: "Professional binding services to give your academic work a polished finish with multiple options to choose from.",
      details: ["Hard Binding (Normal, High Quality, Gloss, Emboss)", "Soft Binding", "Spiral Binding", "Custom Cover Options"],
      actionLink: "/binding-order",
      actionText: "Order Binding"
    },
    {
      iconAnimation: "writing",
      title: "Academic Writing",
      description: "Expert assistance with all types of academic writing needs for students and researchers.",
      details: ["Thesis Writing", "SIP & Project Reports", "Research Papers", "Dissertations", "Academic Essays"],
      actionLink: "https://wa.me/919311244099?text=I'm%20interested%20in%20Academic%20Writing%20services",
      actionText: "WhatsApp Us",
      badge: "Recommended"
    },
    {
      iconAnimation: "plagiarism",
      title: "Plagiarism Checking",
      description: "Comprehensive plagiarism detection using industry-standard tools like Turnitin.",
      details: ["Multiple Page Range Options", "Detailed Reports", "Academic Standard Compliance", "Quick Turnaround"],
      actionLink: "/plagiarism-order",
      actionText: "Check Plagiarism"
    },
    {
      iconAnimation: "plagiarismRemoval",
      title: "Plagiarism Removal",
      description: "Professional plagiarism removal services to ensure your work is original and meets academic standards.",
      details: ["Content Paraphrasing", "Citation Correction", "Structure Improvement", "Guaranteed Originality"],
      actionLink: "/plagiarism-order",
      actionText: "Remove Plagiarism"
    },
    {
      iconAnimation: "aiPlagiarism",
      title: "AI Plagiarism Services",
      description: "Advanced AI-powered plagiarism detection and removal for modern academic requirements.",
      details: ["AI Text Detection", "AI Content Optimization", "Maintains Academic Integrity", "Latest AI Detection Algorithms"],
      actionLink: "/plagiarism-order",
      actionText: "AI Plagiarism Services",
      badge: "New"
    }
  ];

  // Animation component that renders different animations based on the type
  const AnimatedIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "print":
        return (
          <div className="relative w-10 h-10">
            <div className="printer absolute w-10 h-8 bg-primary-200 rounded-t-sm top-2 border border-primary-300"></div>
            <div 
              className="paper absolute w-8 h-1.5 bg-white top-6 left-1 shadow-sm"
              style={{ animation: 'paper-print-animation 2.5s infinite' }}
            ></div>
            <div className="printer-button absolute w-2 h-1 bg-gray-400 top-3 left-2 rounded-sm"></div>
            <div 
              className="printer-led absolute w-1.5 h-1.5 rounded-full bg-green-500 top-3 right-2"
              style={{ animation: 'printer-led-animation 1.5s infinite' }}
            ></div>
            <div className="printer-output absolute w-8 h-0.5 bg-gray-300 bottom-0 left-1"></div>
          </div>
        );
      case "binding":
        return (
          <div className="relative w-10 h-10">
            <div 
              className="book w-7 h-8 absolute top-1 left-1.5 bg-primary-200 rounded-r-sm border border-primary-300 shadow-sm"
              style={{ animation: 'book-binding-animation 4s infinite', transformOrigin: 'left' }}
            >
              <div className="book-spine absolute left-0 top-0 w-1 h-8 bg-primary-700"></div>
              <div className="book-page absolute w-5 h-7 bg-white left-1.5 top-0.5 z-10"></div>
              <div 
                className="book-page-flipping absolute w-5 h-7 bg-gray-100 left-1.5 top-0.5 opacity-80"
                style={{ animation: 'book-page-animation 4s infinite', transformOrigin: 'left', animationDelay: '0.5s' }}
              ></div>
            </div>
          </div>
        );
      case "writing":
        return (
          <div className="relative w-10 h-10">
            <div className="paper w-8 h-8 absolute top-1 left-1 bg-white border border-gray-300 rounded-sm shadow-sm">
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-2 left-1"></div>
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-3.5 left-1"></div>
              <div 
                className="writing-line h-0.5 bg-primary-500 absolute top-5 left-1"
                style={{ animation: 'writing-animation 2.5s infinite alternate', width: 0 }}
              ></div>
              <div 
                className="cursor w-0.5 h-2 bg-primary-700 absolute top-4 left-1"
                style={{ animation: 'cursor-blink 1s infinite' }}
              ></div>
            </div>
          </div>
        );
      case "plagiarism":
        return (
          <div className="relative w-10 h-10">
            <div className="scanner w-8 h-8 absolute top-1 left-1 bg-white border border-gray-300 rounded-sm shadow-sm">
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-2 left-1"></div>
              <div 
                className="scan-line w-6 h-0.5 bg-red-500 absolute top-2 left-1 opacity-50"
                style={{ animation: 'scan-animation 2s infinite' }}
              ></div>
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-3.5 left-1"></div>
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-5 left-1"></div>
              <div className="line w-4 h-0.5 bg-gray-300 absolute top-6.5 left-1"></div>
            </div>
          </div>
        );
      case "plagiarismRemoval":
        return (
          <div className="relative w-10 h-10">
            <div className="scanner w-8 h-8 absolute top-1 left-1 bg-white border border-gray-300 rounded-sm shadow-sm">
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-2 left-1"></div>
              <div 
                className="highlight h-1 bg-yellow-300 absolute top-1.5 left-1"
                style={{ animation: 'highlight-animation 3s infinite', width: 0, opacity: 0 }}
              ></div>
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-3.5 left-1"></div>
              <div className="line w-6 h-0.5 bg-gray-300 absolute top-5 left-1"></div>
              <div className="line w-4 h-0.5 bg-gray-300 absolute top-6.5 left-1"></div>
            </div>
          </div>
        );
      case "aiPlagiarism":
        return (
          <div className="relative w-10 h-10">
            <div 
              className="ai-circle w-4 h-4 rounded-full absolute top-3 left-3 bg-primary-100"
              style={{ animation: 'ai-pulse 2s infinite' }}
            ></div>
            <div 
              className="ai-circle-outer w-6 h-6 rounded-full absolute top-2 left-2 border border-primary-300 opacity-50"
              style={{ animation: 'ai-pulse 2.5s infinite reverse' }}
            ></div>
            <div 
              className="ai-circle-outer-2 w-8 h-8 rounded-full absolute top-1 left-1 border border-primary-200 opacity-30"
              style={{ animation: 'ai-pulse 3s infinite' }}
            ></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

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

  const titleGradient = useMotionTemplate`linear-gradient(90deg, #D4AF37, #B8860B ${useSpring(0)}%, #D4AF37)`;

  return (
    <section id="services" className="py-16 bg-white overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12 relative"
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
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-4 relative">
            Our Services
            <motion.span 
              className="absolute -z-10 bottom-1 left-0 right-0 h-3 bg-[#D4AF37]/10"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </h2>
          <p className="text-gray-600 text-lg">
            Professional printing and academic services tailored to your needs
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Card className="border border-gray-200 transition-all hover:shadow-lg hover:border-primary-200 relative overflow-hidden group card-animate">
                {service.badge && (
                  <div className="absolute -right-12 top-5 rotate-45 z-10">
                    <div className="shine-badge py-1 px-12 text-xs text-white font-medium">
                      {service.badge}
                    </div>
                  </div>
                )}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              <CardHeader className="pb-2">
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                  <AnimatedIcon type={service.iconAnimation} />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </motion.div>
                <CardTitle className="font-serif text-xl font-semibold text-primary-800">
                    <motion.span
                      initial={{ backgroundSize: "100%" }}
                      whileHover={{ backgroundSize: "200%" }}
                      style={{ 
                        background: "linear-gradient(90deg, #D4AF37, #B8860B, #D4AF37)",
                        backgroundSize: "200%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        backgroundPosition: "left",
                        transition: "background-position 0.5s"
                      }}
                    >
                  {service.title}
                    </motion.span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {service.description}
                </CardDescription>
                  <motion.ul 
                    className="space-y-2 mb-4"
                    variants={staggerChildren}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                  {service.details.map((detail, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center text-sm"
                        variants={listItemVariants}
                      >
                        <motion.span 
                          className="h-1.5 w-1.5 rounded-full bg-accent mr-2"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                        />
                      <span>{detail}</span>
                      </motion.li>
                  ))}
                  </motion.ul>
                {service.actionLink && (
                  service.actionText === "WhatsApp Us" ? (
                    <a 
                      href={service.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                      >
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                            className="w-full mt-2 border-green-500 text-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-300 hover:border-transparent relative overflow-hidden group"
                      >
                            <span className="relative z-10 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 mr-2">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {service.actionText}
                            </span>
                            <motion.div
                              className="absolute inset-0 w-0 bg-white/20 z-0"
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.4 }}
                            />
                      </Button>
                        </motion.div>
                    </a>
                    ) :
                    <Link to={service.actionLink}>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                      <Button 
                        variant="outline" 
                        size="sm" 
                            className="w-full mt-2 border-primary text-primary hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white transition-all duration-300 hover:border-transparent relative overflow-hidden group"
                      >
                            <span className="relative z-10 flex items-center">
                        {service.actionText}
                              <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </span>
                            <motion.div
                              className="absolute inset-0 w-0 bg-white/20 z-0"
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.4 }}
                            />
                      </Button>
                        </motion.div>
                    </Link>
                )}
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/services">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center text-base">
            View All Services
                  <motion.div
                    className="ml-2 flex items-center"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute inset-0 w-0 bg-white/10 z-0"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
