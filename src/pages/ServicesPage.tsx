import React, { useEffect, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Printer, BookOpen, FileText, MessageCircle, CheckCircle, ShieldCheck, BadgeCheck, Star } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ServicesPage = () => {
  // Create refs for each service category section
  const printingRef = useRef<HTMLDivElement>(null);
  const bindingRef = useRef<HTMLDivElement>(null);
  const academicWritingRef = useRef<HTMLDivElement>(null);
  const plagiarismRef = useRef<HTMLDivElement>(null);
  const editingRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a specific service section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Add keyframe animations through JavaScript
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes float-shadow {
        0%, 100% { 
          box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.1),
                      0 5px 10px -5px rgba(212, 175, 55, 0.04);
          transform: translateY(0);
        }
        50% { 
          box-shadow: 0 15px 30px -5px rgba(212, 175, 55, 0.2),
                      0 10px 15px -5px rgba(212, 175, 55, 0.1);
          transform: translateY(-5px);
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
      
      @keyframes shimmer {
        from {
          background-position: -200px 0;
        }
        to {
          background-position: calc(200px + 100%) 0;
        }
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
      
      .shimmer {
        background-image: linear-gradient(
          to right,
          transparent 0%,
          rgba(255, 255, 255, 0.2) 20%,
          rgba(255, 255, 255, 0.5) 60%,
          transparent 100%
        );
        background-size: 200px 100%;
        background-repeat: no-repeat;
        animation: shimmer 2s infinite;
      }
    `;
    
    // Append the style element to the head
    document.head.appendChild(styleEl);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
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

  const staggerListVariants = {
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

  // Sparkle component for visual appeal
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

  const services = [
    {
      icon: <Printer className="h-6 w-6 text-white" />,
      title: "Printing Services",
      description: "High-quality black & white and color printing on various paper types including normal paper, bond paper (80 GSM, 90 GSM, 100 GSM).",
      details: [
        "Normal Paper: ₹1 (B&W), ₹5 (Color)",
        "Bond Paper 80 GSM: ₹2 (B&W), ₹6 (Color)",
        "Bond Paper 90 GSM: ₹2.5 (B&W), ₹6.5 (Color)",
        "Bond Paper 100 GSM: ₹3 (B&W), ₹7 (Color)",
        "Double-sided printing available",
        "Bulk order discounts available"
      ],
      actionLink: "/print-order",
      actionText: "Order Prints",
      badge: "Popular",
      ref: printingRef,
      category: "printing"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Binding Solutions",
      description: "Professional binding services to give your academic work a polished finish with multiple options to choose from.",
      details: [
        "Hard Binding: Normal (₹120), High Quality (₹220), Gloss Quality (₹250), Emboss Quality (₹350)",
        "Soft Binding: ₹40",
        "Spiral Binding: ₹30",
        "Custom cover options available",
        "Same-day binding for urgent orders",
        "Multiple copies at discounted rates"
      ],
      actionLink: "/binding-order",
      actionText: "Order Binding",
      ref: bindingRef,
      category: "binding"
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Academic Writing",
      description: "Expert assistance with all types of academic writing needs for students and researchers.",
      details: [
        "Thesis Writing and Formatting",
        "SIP & Project Reports",
        "Research Papers & Publications",
        "Dissertations & Case Studies",
        "Academic Essays & Assignments",
        "Literature Reviews & Methodology Writing"
      ],
      actionLink: "https://wa.me/919311244099?text=I'm%20interested%20in%20Academic%20Writing%20services",
      actionText: "WhatsApp Us",
      badge: "Recommended",
      ref: academicWritingRef,
      category: "academic-writing"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      title: "Plagiarism Checking",
      description: "Comprehensive plagiarism detection using industry-standard tools like Turnitin.",
      details: [
        "1-50 Pages: ₹399",
        "51-100 Pages: ₹699",
        "101-150 Pages: ₹1099",
        "Detailed similarity reports",
        "Academic standard compliance verification",
        "Quick turnaround (24-48 hours)"
      ],
      actionLink: "/plagiarism-order",
      actionText: "Check Plagiarism",
      ref: plagiarismRef,
      category: "plagiarism"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Plagiarism Removal",
      description: "Professional plagiarism removal services to ensure your work is original and meets academic standards.",
      details: [
        "1-50 Pages: ₹899",
        "51-100 Pages: ₹1699",
        "101-150 Pages: ₹2099",
        "Expert content paraphrasing",
        "Citation and reference correction",
        "Structure and flow improvement"
      ],
      actionLink: "/plagiarism-order",
      actionText: "Remove Plagiarism",
      category: "plagiarism"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      title: "AI Plagiarism Services",
      description: "Advanced AI-powered plagiarism detection and removal for modern academic requirements.",
      details: [
        "AI Text Detection",
        "AI Content Optimization",
        "Academic integrity maintenance",
        "Latest AI detection algorithms",
        "Full document analysis",
        "Comprehensive AI-free certification"
      ],
      actionLink: "/plagiarism-order",
      actionText: "AI Plagiarism Services",
      badge: "New",
      category: "plagiarism"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Editing & Proofreading",
      description: "Professional editing and proofreading services to polish your academic documents.",
      details: [
        "Grammar and spelling correction",
        "Language and style improvement",
        "Formatting and citation checking",
        "Structure and flow enhancement",
        "Feedback and suggestions",
        "Final quality assurance"
      ],
      actionLink: "https://wa.me/919311244099?text=I'm%20interested%20in%20Editing%20and%20Proofreading%20services",
      actionText: "WhatsApp Us",
      ref: editingRef,
      category: "editing"
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Custom Academic Services",
      description: "Tailored academic services designed to meet your specific requirements and deadlines.",
      details: [
        "Customized research assistance",
        "Literature search and review",
        "Methodology development",
        "Data analysis and interpretation",
        "Presentation preparation",
        "Publication guidance"
      ],
      actionLink: "https://wa.me/919311244099?text=I'm%20interested%20in%20Custom%20Academic%20Services",
      actionText: "Contact Us",
      category: "custom"
    }
  ];

  // Navigation links for service categories
  const serviceCategories = [
    { name: 'Printing', ref: printingRef },
    { name: 'Binding', ref: bindingRef },
    { name: 'Academic Writing', ref: academicWritingRef },
    { name: 'Plagiarism', ref: plagiarismRef },
    { name: 'Editing', ref: editingRef }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#f9f7ed]">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url(/images/subtle-pattern.png)] opacity-5"></div>
          
          {/* Background decorative elements */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#B8860B]/5 rounded-full blur-3xl"></div>
          
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16 relative"
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
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-3 px-4 py-1 bg-[#D4AF37]/10 rounded-full"
              >
                <span className="text-sm font-medium text-[#B8860B]">Deep Computers Services</span>
              </motion.div>
              
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Premium</span> Academic Services
              </h1>
              
              <motion.p 
                className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Comprehensive academic and printing solutions to support your educational journey with professional quality and timely delivery.
              </motion.p>
            </motion.div>
            
            {/* Service categories quick links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
              variants={staggerListVariants}
              initial="hidden"
              animate="visible"
            >
              {serviceCategories.map((category, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(category.ref)}
                  variants={listItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:shadow transition-all duration-300"
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Services Grid Section */}
        <section className="pb-16 md:pb-24 relative">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
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
                  variants={cardVariants}
                  className="relative group"
                  whileHover={{ y: -5 }}
                  ref={service.ref}
                  id={service.category}
                >
                  <Card className="h-full border border-gray-200 bg-white/90 backdrop-blur-sm transition-all hover:shadow-xl hover:border-[#D4AF37]/30 card-animate overflow-hidden">
                    {service.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shine-badge">
                          {service.badge === "New" ? (
                            <>
                              <Star className="w-3 h-3 mr-1" />
                              {service.badge}
                            </>
                          ) : service.badge === "Popular" ? (
                            <>
                              <BadgeCheck className="w-3 h-3 mr-1" />
                              {service.badge}
                            </>
                          ) : (
                            service.badge
                          )}
                        </span>
                      </div>
                    )}
                    
                    <CardHeader className="pb-2 relative">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden">
                        {service.icon}
                        <div className="absolute inset-0 shimmer"></div>
                      </div>
                      <CardTitle className="font-serif text-2xl font-semibold text-gray-800 group-hover:text-[#B8860B] transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-4 text-base">
                        {service.description}
                      </CardDescription>
                      
                      <motion.ul 
                        className="space-y-2 mb-4"
                        variants={staggerListVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        {service.details.map((detail, i) => (
                          <motion.li key={i} variants={listItemVariants} className="flex items-start text-sm">
                            <span className="flex-shrink-0 mt-1 mr-2">
                              <svg className="h-4 w-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="text-gray-700">{detail}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                      
                      {service.actionLink && (
                        service.actionText === "WhatsApp Us" || service.actionText === "Contact Us" ? (
                          <a 
                            href={service.actionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full"
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 border-green-500 text-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-300 hover:border-transparent hover:shadow-md group"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 mr-2">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              {service.actionText}
                            </Button>
                          </a>
                        ) : (
                          <Link to={service.actionLink}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 border-[#D4AF37] text-[#D4AF37] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white transition-all duration-300 hover:border-transparent hover:shadow-md group"
                            >
                              {service.actionText}
                              <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </Button>
                          </Link>
                        )
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Call to Action */}
            <motion.div 
              className="mt-16 md:mt-24 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#B8860B]/10"></div>
                <div className="relative z-10">
                  <BadgeCheck className="h-12 w-12 mx-auto text-[#D4AF37] mb-4" />
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4">Need a Custom Service?</h3>
                  <p className="text-gray-600 mb-6 max-w-xl mx-auto text-lg">
                    Don't see what you're looking for? Contact us for custom academic and printing solutions tailored to your specific requirements.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer">
                      <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white transition-all duration-300 hover:shadow-lg px-6 py-6 h-auto text-base">
                        Contact Us Now
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage; 