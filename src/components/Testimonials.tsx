import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced testimonials with additional data
const testimonials = [
  {
    name: "Priya Singh",
    title: "PhD Candidate",
    review: "Deep Computers helped me with my thesis binding and plagiarism removal. The quality of work was outstanding, and they delivered on time. Highly recommended!",
    initials: "PS",
    image: "/images/team/avatar-female-1.png", // Default female avatar
    rating: 5,
    service: "Plagiarism Removal",
    highlight: true
  },
  {
    name: "Rahul Verma",
    title: "MBA Student",
    review: "I got my project report printed and bound here. Their pricing is reasonable, and the quality of paper and binding exceeded my expectations. Will surely come back!",
    initials: "RV",
    image: "/images/team/avatar-male-1.png", // Default male avatar
    rating: 5,
    service: "Binding Services",
    highlight: false
  },
  {
    name: "Ananya Kapoor",
    title: "Research Scholar",
    review: "The plagiarism checking service is thorough and detailed. They helped me identify issues in my research paper that I hadn't noticed. Very professional service.",
    initials: "AK",
    image: "/images/team/avatar-female-2.png", // Default female avatar
    rating: 4,
    service: "Plagiarism Checking",
    highlight: false
  },
  {
    name: "Vikram Mehta",
    title: "College Professor",
    review: "I've been recommending Deep Computers to my students for years. Their academic writing assistance and printing services are top-notch. A reliable partner for academic needs.",
    initials: "VM",
    image: "/images/team/avatar-male-2.png", // Default male avatar
    rating: 5,
    service: "Academic Writing",
    highlight: true
  },
  {
    name: "Neha Sharma",
    title: "B.Tech Student",
    review: "Got my final year project printed and hard bound here. The emboss quality binding looks extremely professional. Fast service and friendly staff!",
    initials: "NS",
    image: "/images/team/avatar-female-3.png", // Default female avatar
    rating: 5,
    service: "Binding Services",
    highlight: false
  },
  {
    name: "Mohammed Ali",
    title: "Doctoral Student",
    review: "Their AI plagiarism checking service saved my dissertation. They identified AI-generated content that other checkers missed. Worth every rupee!",
    initials: "MA",
    image: "/images/team/avatar-male-3.png", // Default male avatar
    rating: 5,
    service: "AI Plagiarism Services",
    highlight: true
  }
];

const Testimonials = () => {
  // State for featured testimonial index (for mobile carousel)
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  // Handle prev/next
  const goToNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  // Animations
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
        stiffness: 100,
        damping: 15
      }
    }
  };

  const glowingVariants = {
    animate: {
      boxShadow: [
        "0 0 0 rgba(212, 175, 55, 0.2)",
        "0 0 20px rgba(212, 175, 55, 0.4)",
        "0 0 0 rgba(212, 175, 55, 0.2)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('/images/testimonials-pattern.png')] bg-repeat"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-3 px-4 py-1 bg-[#D4AF37]/10 rounded-full"
          >
            <Star className="h-4 w-4 mr-2 text-[#D4AF37]" />
            <span className="text-sm font-medium text-[#B8860B]">Trusted by Students & Researchers</span>
          </motion.div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
              What Our Customers Say
            </span>
            <motion.span 
              className="absolute -z-10 bottom-1 left-0 right-0 h-3 bg-[#D4AF37]/10"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </h2>
          <p className="text-gray-600 text-lg">
            Read testimonials from students and researchers who trust our services
          </p>
        </motion.div>
        
        {/* Mobile Testimonial Carousel (Visible on small screens) */}
        <div className="block md:hidden relative mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className="border border-[#D4AF37]/20 bg-white shadow-lg">
                <CardContent className="pt-6 pb-6">
                  <div className="absolute -top-5 right-6">
                    <motion.div 
                      className="h-10 w-10 rounded-full bg-[#D4AF37] flex items-center justify-center"
                      animate={{ rotate: [0, 15, 0, -15, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <Quote className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="flex flex-col items-center mb-4 text-center">
                    <Avatar className="h-16 w-16 border-2 border-[#D4AF37]/30 mb-3">
                      <AvatarImage src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white text-lg">
                        {testimonials[activeIndex].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-gray-900">{testimonials[activeIndex].name}</h4>
                      <p className="text-sm text-[#D4AF37]">{testimonials[activeIndex].title}</p>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-xs text-gray-500 bg-[#D4AF37]/10 rounded-full px-2 py-0.5">
                          {testimonials[activeIndex].service}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 italic text-center mb-4">
                    "{testimonials[activeIndex].review}"
                  </blockquote>
                  
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonials[activeIndex].rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <div className="flex justify-between absolute inset-0 items-center pointer-events-none">
            <button 
              onClick={goToPrev}
              className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#D4AF37] transition-colors pointer-events-auto"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={goToNext}
              className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#D4AF37] transition-colors pointer-events-auto"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Grid Layout (for medium screens and up) */}
        <motion.div 
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="h-full"
            >
              <Card 
                className={`h-full border ${testimonial.highlight ? 'border-[#D4AF37]/50' : 'border-gray-200'} bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden ${testimonial.highlight ? 'z-10' : ''}`}
              >
                {testimonial.highlight && (
                  <motion.div 
                    className="absolute inset-0 border-2 border-[#D4AF37]/30 rounded-xl pointer-events-none"
                    variants={glowingVariants}
                    animate="animate"
                  ></motion.div>
                )}
                <CardContent className="pt-6 relative z-10">
                  <div className="absolute top-4 right-4">
                    <Quote className="h-7 w-7 text-[#D4AF37]/20" />
                  </div>
                  
                  {testimonial.highlight && (
                    <div className="absolute -top-2 -right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-md">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start mb-4">
                    <Avatar className={`h-10 w-10 border ${testimonial.highlight ? 'border-[#D4AF37]/50' : 'border-gray-200'} shadow-sm`}>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className={`${testimonial.highlight ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                        {testimonial.service && (
                          <span className="text-xs text-gray-500 bg-[#D4AF37]/10 rounded-full px-2 py-0.5 ml-2">
                            {testimonial.service}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 italic relative">
                    <div className="absolute -left-1 -top-1 text-[#D4AF37]/10 font-serif text-5xl">"</div>
                    <div className="pl-3">{testimonial.review}</div>
                  </blockquote>
                  
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
