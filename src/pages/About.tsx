import { motion } from "framer-motion";
import { BookOpen, Users, Target, Heart, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Number animation component
const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);
  
  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

// Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const stars = [];

  const ref = useRef(null);
  const isInView = useInView(ref);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Create full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star 
        key={`star-${i}`} 
        className={`h-5 w-5 text-[#D4AF37] fill-[#D4AF37] transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} 
        style={{ transitionDelay: `${i * 150}ms` }}
      />
    );
  }

  // Add partial star if needed
  if (partialStar > 0) {
    stars.push(
      <div key="partial-star" className="relative inline-block h-5 w-5">
        {/* Empty star background */}
        <Star className={`absolute h-5 w-5 text-[#D4AF37] transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} 
              style={{ transitionDelay: `${fullStars * 150}ms` }} />
        {/* Filled portion of star */}
        <div className="absolute overflow-hidden h-full" style={{ width: `${partialStar * 100}%` }}>
          <Star className={`h-5 w-5 text-[#D4AF37] fill-[#D4AF37] transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} 
                style={{ transitionDelay: `${fullStars * 150 + 150}ms` }} />
        </div>
      </div>
    );
  }

  // Add empty stars to reach 5 total
  for (let i = Math.ceil(rating); i < 5; i++) {
    stars.push(
      <Star 
        key={`empty-star-${i}`} 
        className={`h-5 w-5 text-[#D4AF37] transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${i * 150}ms` }}
      />
    );
  }

  return <div ref={ref} className="flex items-center gap-1">{stars}</div>;
};

const About = () => {
  return (
    <div className="bg-gradient-to-b from-white to-[#D4AF37]/5">
      <Header />
      <div className="min-h-screen pt-4">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
          <div className="container px-4 mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  Our Story
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                From a small printing shop to becoming a trusted name in academic services
              </p>
            </motion.div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold mb-6">Our Journey</h2>
                <p className="text-gray-600 mb-4">
                  In 2010, Deep Computers began as a small printing shop in Greater Noida, founded by Deep Nagar with a simple mission: to help students with their academic needs. What started as a modest operation quickly grew into something extraordinary.
                </p>
                <p className="text-gray-600 mb-4">
                  The turning point came when a group of MBA students approached us with their thesis work. They were struggling to find a service that could handle both printing and academic assistance with the quality they needed. We stepped up, not just providing printing services but also offering guidance and support throughout their academic journey.
                </p>
                <p className="text-gray-600">
                  Today, many of those students have gone on to achieve remarkable success, with some securing positions at top companies with packages exceeding 10 Crore INR, and others becoming faculty members at prestigious institutions. Their success stories fuel our passion to continue supporting students in their academic endeavors.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#D4AF37]/5 p-6 rounded-xl">
                      <Trophy className="h-8 w-8 text-[#D4AF37] mb-4" />
                      <h3 className="font-serif font-bold text-xl mb-2">
                        <AnimatedCounter value={15} suffix="+ Years" />
                      </h3>
                      <p className="text-gray-600">Of Excellence</p>
                    </div>
                    <div className="bg-[#D4AF37]/5 p-6 rounded-xl">
                      <Users className="h-8 w-8 text-[#D4AF37] mb-4" />
                      <h3 className="font-serif font-bold text-xl mb-2">
                        <AnimatedCounter value={2000000} suffix="+" prefix="" />
                      </h3>
                      <p className="text-gray-600">Students Served</p>
                    </div>
                    <div className="bg-[#D4AF37]/5 p-6 rounded-xl">
                      <BookOpen className="h-8 w-8 text-[#D4AF37] mb-4" />
                      <h3 className="font-serif font-bold text-xl mb-2">
                        <AnimatedCounter value={50} suffix="+" />
                      </h3>
                      <p className="text-gray-600">Colleges</p>
                    </div>
                    <div className="bg-[#D4AF37]/5 p-6 rounded-xl">
                      <Star className="h-8 w-8 text-[#D4AF37] mb-4" />
                      <h3 className="font-serif font-bold text-xl mb-2 flex flex-col items-center">
                        <StarRating rating={4.8} />
                        <span className="mt-1 text-sm text-gray-500">4.8/5</span>
                      </h3>
                      <p className="text-gray-600">Customer Rating</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-[#D4AF37]/5 p-8 rounded-2xl"
              >
                <Target className="h-8 w-8 text-[#D4AF37] mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide high-quality academic services to students at competitive prices, ensuring that every student receives the support they need to excel in their academic journey.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#D4AF37]/5 p-8 rounded-2xl"
              >
                <Heart className="h-8 w-8 text-[#D4AF37] mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To make Deep Computers an emotion and the first name that comes to mind when students need academic assistance, creating a legacy of trust and excellence.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold mb-4">Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the dedicated individuals who make Deep Computers a trusted name in academic services
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Deep Nagar",
                  role: "Founder & Owner",
                  description: "With over a decade of experience in academic services, Deep leads the team with his vision and dedication to student success."
                },
                {
                  name: "Rahul Nagar",
                  role: "Co-Owner",
                  description: "Bringing technical expertise and innovative solutions to enhance our service quality."
                },
                {
                  name: "Rajesh",
                  role: "Digital Transformation Lead",
                  description: "The visionary behind our online presence, ensuring we stay connected with students in the digital age."
                },
                {
                  name: "Mohit",
                  role: "Designer",
                  description: "A creative designer specializing in Flex, Posters, Business/Visiting Cards, bill books, and various other design projects."
                },
                {
                  name: "Ravinder",
                  role: "Screen Printing Expert",
                  description: "A master of Screen Printing with over 30 years of experience in the field, ensuring the highest quality in all printing work."
                },
                {
                  name: "Vipin",
                  role: "Binding Expert",
                  description: "A master in both Hard Binding and Soft Binding techniques. Also skilled in Screen Printing, providing backup support when needed."
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  {member.name === "Deep Nagar" ? (
                    <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/30">
                      <img 
                        src="/images/team/Deepak.webp" 
                        alt="Deep Nagar" 
                        width="96"
                        height="96"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : member.name === "Rajesh" ? (
                    <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/30">
                      <img 
                        src="/images/team/Rajesh.webp" 
                        alt="Rajesh" 
                        width="96"
                        height="96"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : member.name === "Vipin" ? (
                    <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/30">
                      <img 
                        src="/images/team/Vipin.webp" 
                        alt="Vipin" 
                        width="96"
                        height="96"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : member.name === "Rohan Chauhan" ? (
                      <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/30">
                        <img 
                          src="/images/team/Rohan.webp" 
                          alt="Rohan Chauhan" 
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                  ) : member.name === "Mohit" ? (
                      <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]/30">
                        <img 
                          src="/images/team/Mohit.webp" 
                          alt="Mohit" 
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                  ) : (
                    <div className="h-20 w-20 bg-[#D4AF37]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-[#D4AF37]" />
                    </div>
                  )}
                  <h3 className="text-xl font-serif font-bold text-center mb-2">{member.name}</h3>
                  <p className="text-[#D4AF37] text-center mb-4">{member.role}</p>
                  <p className="text-gray-600 text-center mb-4">{member.description}</p>
                  {member.name === "Deep Nagar" && (
                    <a href="https://wa.me/919999629200" target="_blank" rel="noreferrer" className="block w-full">
                      <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0">
                        WhatsApp Deep
                      </Button>
                    </a>
                  )}
                  {member.name === "Rahul Nagar" && (
                    <a href="https://wa.me/919911809200" target="_blank" rel="noreferrer" className="block w-full">
                      <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white border-0">
                        WhatsApp Rahul
                      </Button>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold mb-4">What Our Students Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Success stories from students who trusted us with their academic journey
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  role: "MBA Graduate, GL Bajaj",
                  testimonial: "Deep Computers transformed my thesis into a masterpiece. Their attention to detail and support throughout the process was exceptional. Today, I'm working at a top MNC with a package of 12 Crore INR, and I owe part of my success to their guidance."
                },
                {
                  name: "Amit Kumar",
                  role: "Faculty, Galgotias University",
                  testimonial: "As a former student and now a faculty member, I can confidently say that Deep Computers sets the standard for academic services. Their commitment to quality and student success is unmatched."
                },
                {
                  name: "Neha Patel",
                  role: "Law Student, Sharda University",
                  testimonial: "The team at Deep Computers went above and beyond to help me with my research papers. Their expertise and dedication made a significant difference in my academic performance."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#D4AF37]/5 p-6 rounded-xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold">{testimonial.name}</h3>
                      <p className="text-[#D4AF37] text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.testimonial}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-2xl p-8 text-center"
            >
              <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Start Your Academic Journey?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of successful students who have trusted Deep Computers with their academic needs
              </p>
              <Link to="/services">
                <Button size="lg" className="bg-white text-[#D4AF37] hover:bg-white/90">
                  Explore Our Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About; 