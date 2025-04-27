import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Printer, BookOpen, FileText, MessageCircle, CheckCircle, ShieldCheck } from "lucide-react";

const ServicesPage = () => {
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
      actionText: "Order Prints"
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
      actionText: "Order Binding"
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
      actionText: "WhatsApp Us"
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
      actionText: "Check Plagiarism"
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
      actionText: "Remove Plagiarism"
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
      actionText: "AI Plagiarism Services"
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
      actionText: "WhatsApp Us"
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
      actionText: "Contact Us"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">Our Services</h1>
              <p className="text-gray-600 text-lg md:text-xl">
                Comprehensive academic and printing solutions to support your educational journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="border border-gray-200 transition-all hover:shadow-lg hover:border-primary-200">
                  <CardHeader className="pb-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="font-serif text-xl font-semibold text-primary-800">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4">
                      {service.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-4">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
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
                            className="w-full mt-2 border-green-500 text-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-300 hover:border-transparent"
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
                            className="w-full mt-2 border-primary text-primary hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white transition-all duration-300 hover:border-transparent group"
                          >
                            {service.actionText}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-primary mb-4">Need a Custom Service?</h3>
                <p className="text-gray-600 mb-6">
                  Don't see what you're looking for? Contact us for custom academic and printing solutions tailored to your specific requirements.
                </p>
                <a href="https://wa.me/919311244099" target="_blank" rel="noreferrer">
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white transition-all duration-300 hover:shadow-lg">
                    Contact Us Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage; 