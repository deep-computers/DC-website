import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Printer, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("printing");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 30px rgba(212, 175, 55, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  // Features for each plan type
  const printingFeatures = {
    basic: [
      "Black & White Printing",
      "Standard Paper Quality",
      "Standard Binding",
      "24-Hour Turnaround",
      "Email Support"
    ],
    standard: [
      "Color & B&W Printing",
      "Premium Paper Options",
      "Multiple Binding Options",
      "12-Hour Express Turnaround",
      "Email & Phone Support",
      "Free Digital Proof"
    ],
    premium: [
      "Full Color High-Resolution",
      "Premium & Specialty Papers",
      "Custom Binding Solutions",
      "6-Hour Priority Turnaround",
      "Dedicated Support Manager",
      "Free Digital Proof & Revisions",
      "Free Delivery Options"
    ]
  };

  const bindingFeatures = {
    basic: [
      "Spiral Binding",
      "Standard Cover Options",
      "Up to 100 Pages",
      "48-Hour Turnaround",
      "Email Support"
    ],
    standard: [
      "Spiral or Hardcover Binding",
      "Premium Cover Options",
      "Up to 300 Pages",
      "24-Hour Turnaround",
      "Email & Phone Support",
      "Basic Customization"
    ],
    premium: [
      "All Binding Options",
      "Customized Cover Design",
      "Unlimited Pages",
      "12-Hour Priority Turnaround",
      "Dedicated Support Manager",
      "Full Customization Options",
      "Free Delivery"
    ]
  };

  const plagiarismFeatures = {
    basic: [
      "Basic Similarity Check",
      "Up to 10 Pages",
      "Standard Report",
      "48-Hour Turnaround",
      "Email Support"
    ],
    standard: [
      "Advanced Similarity Check",
      "Up to 50 Pages",
      "Detailed Report",
      "24-Hour Turnaround",
      "Email & Phone Support",
      "Basic Rewrite Suggestions"
    ],
    premium: [
      "Comprehensive Plagiarism Detection",
      "Unlimited Pages",
      "Premium Detailed Report",
      "12-Hour Priority Turnaround",
      "Dedicated Support Manager",
      "Advanced Rewrite Assistance",
      "Free Consultation"
    ]
  };

  const aiFeatures = {
    basic: [
      "Basic AI Writing Assistance",
      "Up to 5 Pages",
      "Standard Templates",
      "48-Hour Turnaround",
      "Email Support"
    ],
    standard: [
      "Advanced AI Writing Tools",
      "Up to 20 Pages",
      "Premium Templates",
      "24-Hour Turnaround",
      "Email & Phone Support",
      "Revision Support"
    ],
    premium: [
      "Complete AI Writing & Editing",
      "Unlimited Pages",
      "Custom Templates & Formats",
      "12-Hour Priority Turnaround",
      "Dedicated Support Manager",
      "Unlimited Revisions",
      "Academic Consultation"
    ]
  };

  // Pricing data
  const pricingData = {
    printing: {
      title: "Printing Services",
      description: "Professional printing services for all your academic needs",
      icon: <Printer className="h-6 w-6" />,
      plans: [
        {
          name: "Normal Paper",
          price: "₹1",
          unit: "per page B&W",
          secondaryPrice: "₹5",
          secondaryUnit: "per page Color",
          description: "Standard quality paper for everyday prints",
          features: printingFeatures.basic,
          buttonText: "Get Started",
          link: "/print-order",
          popular: false
        },
        {
          name: "Bond Paper 80 GSM",
          price: "₹2",
          unit: "per page B&W",
          secondaryPrice: "₹6",
          secondaryUnit: "per page Color",
          description: "Higher quality paper for professional documents",
          features: printingFeatures.standard,
          buttonText: "Get Started",
          link: "/print-order",
          popular: true
        },
        {
          name: "Bond Paper 90 GSM",
          price: "₹2.5",
          unit: "per page B&W",
          secondaryPrice: "₹6.5",
          secondaryUnit: "per page Color",
          description: "Premium paper for reports and presentations",
          features: printingFeatures.standard,
          buttonText: "Get Started",
          link: "/print-order",
          popular: false
        },
        {
          name: "Bond Paper 100 GSM",
          price: "₹3",
          unit: "per page B&W",
          secondaryPrice: "₹7",
          secondaryUnit: "per page Color",
          description: "Premium paper for important documents",
          features: printingFeatures.premium,
          buttonText: "Get Started",
          link: "/print-order",
          popular: false
        }
      ]
    },
    binding: {
      title: "Binding Services",
      description: "Professional binding to give your work the finish it deserves",
      icon: <BookOpen className="h-6 w-6" />,
      plans: [
        {
          name: "Soft Binding",
          price: "₹40",
          unit: "per document",
          description: "Simple binding for everyday documents",
          features: bindingFeatures.basic,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: false
        },
        {
          name: "Spiral Binding",
          price: "₹30",
          unit: "per document",
          description: "Quality binding for professional documents",
          features: bindingFeatures.standard,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: true
        },
        {
          name: "Hard Binding (Normal)",
          price: "₹120",
          unit: "per document",
          description: "Standard hard binding for academic work",
          features: bindingFeatures.premium,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: false
        },
        {
          name: "Hard Binding (High Quality)",
          price: "₹220",
          unit: "per document",
          description: "Higher quality hard binding with premium materials",
          features: bindingFeatures.premium,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: false
        },
        {
          name: "Hard Binding (Gloss)",
          price: "₹250",
          unit: "per document",
          description: "Premium glossy finish hard binding",
          features: bindingFeatures.premium,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: false
        },
        {
          name: "Hard Binding (Emboss)",
          price: "₹350",
          unit: "per document",
          description: "Embossed hard binding (Min. 4 copies required)",
          features: bindingFeatures.premium,
          buttonText: "Get Started",
          link: "/binding-order",
          popular: false
        }
      ]
    },
    plagiarism: {
      title: "Plagiarism Check (Turnitin)",
      description: "Verify your work's originality with industry-standard Turnitin detection",
      icon: <ShieldCheck className="h-6 w-6" />,
      plans: [
        {
          name: "1-50 Pages (Check)",
          price: "₹399",
          unit: "per document",
          description: "Essential similarity check for shorter documents",
          features: plagiarismFeatures.basic,
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: true
        },
        {
          name: "51-100 Pages (Check)",
          price: "₹699",
          unit: "per document",
          description: "Comprehensive check for most academic papers",
          features: plagiarismFeatures.standard,
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: false
        },
        {
          name: "101-150 Pages (Check)",
          price: "₹1099",
          unit: "per document",
          description: "Advanced plagiarism detection for critical works",
          features: plagiarismFeatures.premium,
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: false
        },
        {
          name: "1-50 Pages (Removal)",
          price: "₹899",
          unit: "per document",
          description: "Plagiarism detection and removal for shorter documents",
          features: [...plagiarismFeatures.basic, "Plagiarism removal", "Content rewriting"],
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: false
        },
        {
          name: "51-100 Pages (Removal)",
          price: "₹1699",
          unit: "per document",
          description: "Comprehensive plagiarism removal for medium-length works",
          features: [...plagiarismFeatures.standard, "Plagiarism removal", "Content rewriting"],
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: false
        },
        {
          name: "101-150 Pages (Removal)",
          price: "₹2099",
          unit: "per document",
          description: "Advanced plagiarism removal for critical works",
          features: [...plagiarismFeatures.premium, "Plagiarism removal", "Content rewriting"],
          buttonText: "Get Started",
          link: "/plagiarism-order",
          popular: false
        }
      ]
    },
    ai: {
      title: "AI Plagiarism Services",
      description: "Protect your AI-generated content with our specialized services",
      icon: <Sparkles className="h-6 w-6" />,
      plans: [
        {
          name: "1-50 Pages (Check)",
          price: "₹399",
          unit: "per document",
          description: "AI content detection check for shorter documents",
          features: aiFeatures.basic,
          buttonText: "Get Started",
          link: "/services",
          popular: true
        },
        {
          name: "51-100 Pages (Check)",
          price: "₹699",
          unit: "per document",
          description: "AI content detection for larger documents",
          features: aiFeatures.standard,
          buttonText: "Get Started",
          link: "/services",
          popular: false
        },
        {
          name: "1-50 Pages (Removal)",
          price: "₹1599",
          unit: "per document",
          description: "AI detection prevention and humanization",
          features: [...aiFeatures.basic, "AI detection removal", "Content humanization"],
          buttonText: "Get Started",
          link: "/services",
          popular: false
        },
        {
          name: "51-100 Pages (Removal)",
          price: "₹2999",
          unit: "per document",
          description: "Comprehensive AI detection removal for larger works",
          features: [...aiFeatures.standard, "AI detection removal", "Content humanization", "Advanced rewriting"],
          buttonText: "Get Started",
          link: "/services",
          popular: false
        }
      ]
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-[#D4AF37]/5">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
              Our Pricing
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options tailored to meet your academic needs
          </p>
        </motion.div>

        <Tabs 
          defaultValue="printing" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-5xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1 mb-8 bg-[#D4AF37]/10 rounded-lg mx-auto w-full max-w-3xl">
            <TabsTrigger 
              value="printing"
              className={cn(
                "flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm",
                activeTab === "printing" ? "text-[#D4AF37]" : "text-gray-600"
              )}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden md:inline">Printing</span>
            </TabsTrigger>
            <TabsTrigger 
              value="binding"
              className={cn(
                "flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm",
                activeTab === "binding" ? "text-[#D4AF37]" : "text-gray-600"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Binding</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plagiarism"
              className={cn(
                "flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm",
                activeTab === "plagiarism" ? "text-[#D4AF37]" : "text-gray-600"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Plagiarism</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai"
              className={cn(
                "flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm",
                activeTab === "ai" ? "text-[#D4AF37]" : "text-gray-600"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">AI Writing</span>
            </TabsTrigger>
          </TabsList>

          {Object.keys(pricingData).map((key) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-[#D4AF37]/10 rounded-full mb-4">
                  {pricingData[key].icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">{pricingData[key].title}</h3>
                <p className="text-gray-600">{pricingData[key].description}</p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-wrap"
              >
                {pricingData[key].plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className={cn(
                      "relative rounded-xl overflow-hidden",
                      plan.popular ? "border-2 border-[#D4AF37]" : "border border-gray-200"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                        Most Popular
                      </div>
                    )}
                    <Card className={cn(
                      "flex flex-col h-full border-0",
                      plan.popular ? "bg-[#D4AF37]/5" : "bg-white"
                    )}>
                      <CardContent className="flex-1 p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                          <div className="mb-2">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-gray-500 ml-1">{plan.unit}</span>
                            {plan.secondaryPrice && (
                              <div className="mt-1">
                                <span className="text-2xl font-bold">{plan.secondaryPrice}</span>
                                <span className="text-gray-500 ml-1">{plan.secondaryUnit}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        
                        <div className="space-y-3 my-6">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-[#D4AF37] mr-2 shrink-0" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-auto pt-4">
                          <Button 
                            asChild 
                            className={cn(
                              "w-full", 
                              plan.popular 
                                ? "bg-[#D4AF37] hover:bg-[#B8860B] text-white" 
                                : "bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                            )}
                          >
                            <Link to={plan.link}>
                              {plan.buttonText}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
