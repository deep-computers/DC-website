import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Services = () => {
  // Add animations via useEffect to avoid linter errors with style jsx
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    // Define all animations
    styleEl.innerHTML = `
      @keyframes paperPrint {
        0% { transform: translateY(-100%); opacity: 0; }
        40% { transform: translateY(0); opacity: 1; }
        60% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(100%); opacity: 0; }
      }
      @keyframes printerLed {
        0%, 100% { opacity: 0.5; box-shadow: 0 0 2px #22c55e; }
        50% { opacity: 1; box-shadow: 0 0 5px #22c55e; }
      }
      @keyframes bookBinding {
        0% { transform: rotateY(0deg); }
        45% { transform: rotateY(-30deg); }
        55% { transform: rotateY(-30deg); }
        100% { transform: rotateY(0deg); }
      }
      @keyframes bookPageFlip {
        0% { transform: rotateY(0deg); }
        45% { transform: rotateY(-20deg); opacity: 1; }
        90% { transform: rotateY(-160deg); opacity: 0.95; }
        100% { transform: rotateY(-180deg); opacity: 0; }
      }
      @keyframes penWriting {
        0% { transform: translate(0, 0) rotate(45deg); }
        20% { transform: translate(1px, 1px) rotate(45deg); }
        40% { transform: translate(2px, -0.5px) rotate(44deg); }
        60% { transform: translate(3px, 0.5px) rotate(46deg); }
        80% { transform: translate(2px, -0.25px) rotate(45deg); }
        100% { transform: translate(0, 0) rotate(45deg); }
      }
      @keyframes inkAppear {
        0%, 20% { width: 0; opacity: 0; }
        100% { width: 4px; opacity: 1; }
      }
      @keyframes scanLine {
        0% { transform: translateY(0); box-shadow: 0 0 3px rgba(34, 197, 94, 0.4); }
        50% { transform: translateY(6px); box-shadow: 0 0 5px rgba(34, 197, 94, 0.6); }
        100% { transform: translateY(0); box-shadow: 0 0 3px rgba(34, 197, 94, 0.4); }
      }
      @keyframes checkAppear {
        0%, 30% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
        60%, 70% { opacity: 1; transform: scale(1.1) rotate(0deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      @keyframes plagRemove {
        0%, 40% { opacity: 1; transform: scale(1); }
        60% { opacity: 0.3; transform: scale(0.8) rotate(5deg); }
        100% { opacity: 0; transform: scale(0) rotate(15deg); }
      }
      @keyframes eraser {
        0% { transform: translateX(-5px) rotate(-5deg); }
        50% { transform: translateX(0) rotate(0deg); }
        100% { transform: translateX(-5px) rotate(-5deg); }
      }
      @keyframes aiPulse {
        0%, 100% { transform: scale(1); opacity: 0.7; box-shadow: 0 0 0px rgba(59, 130, 246, 0.3); }
        50% { transform: scale(1.2); opacity: 0.9; box-shadow: 0 0 8px rgba(59, 130, 246, 0.6); }
      }
      @keyframes dataScan {
        0% { height: 0; top: 1px; opacity: 0.3; }
        50% { height: 100%; top: 1px; opacity: 0.7; }
        100% { height: 0; top: 100%; opacity: 0.3; }
      }
      
      .paper-print-animation {
        animation: paperPrint 2.5s infinite;
      }
      .printer-led-animation {
        animation: printerLed 1.5s infinite;
      }
      .book-binding-animation {
        animation: bookBinding 4s infinite;
        transform-origin: left;
      }
      .book-page-animation {
        animation: bookPageFlip 4s infinite;
        transform-origin: left;
        animation-delay: 0.5s;
      }
      .pen-writing-animation {
        animation: penWriting 2s infinite;
      }
      .ink-animation {
        animation: inkAppear 2s infinite;
      }
      .scan-line-animation {
        animation: scanLine 2s infinite;
      }
      .check-appear-animation {
        animation: checkAppear 3s infinite;
      }
      .plag-remove-animation {
        animation: plagRemove 3s infinite;
      }
      .eraser-animation {
        animation: eraser 2s infinite;
      }
      .ai-pulse-animation {
        animation: aiPulse 2.5s infinite;
      }
      .data-scan-animation {
        animation: dataScan 2.5s infinite;
      }
    `;
    // Append the style element to the head
    document.head.appendChild(styleEl);
    
    // Clean up on component unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const services = [
    {
      iconAnimation: "print",
      title: "Printing Services",
      description: "High-quality black & white and color printing on various paper types including normal paper, bond paper (80 GSM, 90 GSM, 100 GSM).",
      details: ["Normal Paper", "Bond Paper 80 GSM", "Bond Paper 90 GSM", "Bond Paper 100 GSM", "Color & Black/White Options"],
      actionLink: "/print-order",
      actionText: "Order Prints"
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
      actionText: "WhatsApp Us"
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
      actionText: "AI Plagiarism Services"
    }
  ];

  // Animation component that renders different animations based on the type
  const AnimatedIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "print":
        return (
          <div className="relative w-10 h-10">
            <div className="printer absolute w-10 h-8 bg-primary-200 rounded-t-sm top-2 border border-primary-300"></div>
            <div className="paper absolute w-8 h-1.5 bg-white top-6 left-1 paper-print-animation shadow-sm"></div>
            <div className="printer-button absolute w-2 h-1 bg-gray-400 top-3 left-2 rounded-sm"></div>
            <div className="printer-led absolute w-1.5 h-1.5 rounded-full bg-green-500 top-3 right-2 printer-led-animation"></div>
            <div className="printer-output absolute w-8 h-0.5 bg-gray-300 bottom-0 left-1"></div>
          </div>
        );
      case "binding":
        return (
          <div className="relative w-10 h-10">
            <div className="book w-7 h-8 absolute top-1 left-1.5 bg-primary-200 rounded-r-sm book-binding-animation border border-primary-300 shadow-sm">
              <div className="book-spine absolute left-0 top-0 w-1 h-8 bg-primary-700"></div>
              <div className="book-page absolute w-5 h-7 bg-white left-1.5 top-0.5 z-10"></div>
              <div className="book-page-flipping absolute w-5 h-7 bg-gray-100 left-1.5 top-0.5 opacity-80 book-page-animation"></div>
            </div>
          </div>
        );
      case "writing":
        return (
          <div className="relative w-10 h-10">
            <div className="paper w-7 h-8 absolute top-1 left-1.5 bg-white border border-primary-200 shadow-sm"></div>
            <div className="pen w-1 h-3 absolute top-3 left-5 bg-primary-700 rotate-45 pen-writing-animation"></div>
            <div className="ink-line absolute h-0.5 bg-primary-600 top-5 left-4 ink-animation"></div>
            <div className="paper-lines absolute w-5 h-3 left-2.5 top-2">
              <div className="h-px w-full bg-gray-200 mb-1"></div>
              <div className="h-px w-full bg-gray-200 mb-1"></div>
              <div className="h-px w-full bg-gray-200"></div>
            </div>
          </div>
        );
      case "plagiarism":
        return (
          <div className="relative w-10 h-10">
            <div className="document w-7 h-8 absolute top-1 left-1.5 bg-white border border-primary-200 shadow-sm"></div>
            <div className="scan-line absolute w-5 h-0.5 bg-green-500 top-3 left-2.5 opacity-75 scan-line-animation rounded-full"></div>
            <div className="document-text absolute top-2 left-3 w-4">
              <div className="h-0.5 w-3 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-4 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-2 bg-gray-300"></div>
            </div>
            <div className="check text-green-500 text-xs font-bold absolute top-5 left-4 check-appear-animation">✓</div>
          </div>
        );
      case "plagiarismRemoval":
        return (
          <div className="relative w-10 h-10">
            <div className="document w-7 h-8 absolute top-1 left-1.5 bg-white border border-primary-200 shadow-sm"></div>
            <div className="document-text absolute top-2 left-3 w-4">
              <div className="h-0.5 w-3 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-4 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-2 bg-gray-300"></div>
            </div>
            <div className="plag-mark text-red-500 text-xs font-bold absolute top-3 left-3 plag-remove-animation">P</div>
            <div className="eraser w-3 h-1.5 bg-primary-400 absolute top-3 left-5 eraser-animation rounded-sm shadow-sm"></div>
          </div>
        );
      case "aiPlagiarism":
        return (
          <div className="relative w-10 h-10">
            <div className="document w-7 h-8 absolute top-1 left-1.5 bg-white border border-primary-200 shadow-sm"></div>
            <div className="document-text absolute top-2 left-3 w-4">
              <div className="h-0.5 w-3 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-4 bg-gray-300 mb-0.5"></div>
              <div className="h-0.5 w-2 bg-gray-300"></div>
            </div>
            <div className="ai-circle w-4 h-4 rounded-full border border-primary-700 absolute top-3 left-3 opacity-75 ai-pulse-animation"></div>
            <div className="ai-text text-primary-700 text-[8px] absolute top-4 left-4 font-bold">AI</div>
            <div className="data-scan w-0.5 bg-blue-400 opacity-40 absolute h-0 left-5 data-scan-animation"></div>
          </div>
        );
      default:
        return <div className="w-10 h-10 bg-primary-100 rounded-full"></div>;
    }
  };

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-gray-600 text-lg">
            Professional printing and academic services tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border border-gray-200 transition-all hover:shadow-md hover:border-primary-200">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <AnimatedIcon type={service.iconAnimation} />
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
                    <li key={i} className="flex items-center text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mr-2"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                {service.actionLink && (
                  service.actionText === "WhatsApp Us" ? (
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
                        className="w-full mt-2 border-primary text-primary hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white transition-all duration-300 hover:border-transparent"
                      >
                        {service.actionText}
                      </Button>
                    </Link>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            View All Services
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
