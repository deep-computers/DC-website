import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Printer, BookOpen, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

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
    }, 500); // Match the Hero's fadeOut animation time (500ms)
    
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
      }, 5000); // 5 seconds interval, matching the Hero component
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
      
      .pricing-tab-transition-in {
        animation: fadeIn 0.6s forwards;
      }
      
      .pricing-tab-transition-out {
        animation: fadeOut 0.5s forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <section 
      id="pricing" 
      className="py-10 sm:py-12 md:py-16 bg-gray-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl xs:text-3xl md:text-4xl font-bold text-primary mb-2 sm:mb-4">Pricing</h2>
          <p className="text-gray-600 text-base xs:text-lg">
            Competitive rates for all our services
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPrevTab}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Previous tab"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
            
            <TabsList className="grid flex-1 mx-2 sm:mx-4 w-full grid-cols-2 md:grid-cols-4">
              {tabValues.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="text-xs sm:text-sm px-1 py-1.5 sm:px-2 sm:py-2"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${activeTab === tab ? "bg-primary" : "bg-gray-300"}`}></div>
                    {tab === "printing" ? "Printing" : 
                     tab === "binding" ? "Binding" : 
                     tab === "plagiarism" ? "Plagiarism" : "AI Services"}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <button 
              onClick={goToNextTab}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Next tab"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute -top-2 left-0 w-full h-0.5 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{width: `${progress}%`}}
              ></div>
            </div>
            
            <div className={isTransitioning ? 'pricing-tab-transition-out' : 'pricing-tab-transition-in'}>
              <TabsContent value="printing" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <h3 className="font-serif text-lg xs:text-xl font-semibold mb-3 sm:mb-4 text-center text-primary">Printing Prices (Per Page)</h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Paper Type
                            </th>
                            <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              B&W
                            </th>
                            <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Color
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Normal Paper</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹1</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹5</td>
                          </tr>
                          <tr>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Bond Paper 80 GSM</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹2</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹6</td>
                          </tr>
                          <tr>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Bond Paper 90 GSM</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹2.5</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹6.5</td>
                          </tr>
                          <tr>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Bond Paper 100 GSM</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹3</td>
                            <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹7</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 italic">Note: Color printing adds ₹4 per page to the base price.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="binding" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-4 sm:pt-6">
                    <h3 className="font-serif text-lg xs:text-xl font-semibold mb-3 sm:mb-4 text-center text-primary">Binding Prices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                      <div>
                        <h4 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Hard Binding Options</h4>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Normal</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹120</td>
                              </tr>
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">High Quality</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹220</td>
                              </tr>
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Gloss Quality</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹250</td>
                              </tr>
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Emboss Quality*</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹350</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-gray-500 italic">*Minimum 4 copies required for Emboss Quality.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-base sm:text-lg mb-2 sm:mb-3 text-primary-700">Other Binding Options</h4>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th scope="col" className="px-2 xs:px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Soft Binding</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹40</td>
                              </tr>
                              <tr>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">Spiral Binding</td>
                                <td className="px-2 xs:px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">₹30</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-gray-500 italic">Note: Printing charges are not included in binding prices.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="plagiarism" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-center text-primary">Plagiarism Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">Plagiarism Check (Turnitin)</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹399</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">Plagiarism Removal</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹899</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai" className="animate-fade-in space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-center text-primary">AI Plagiarism Services</h3>
                    <p className="text-center text-gray-600 mb-6">
                      Our AI-powered services help ensure your content is free from both traditional and AI-generated plagiarism
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">AI Plagiarism Check</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹399</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-lg mb-3 text-primary-700">AI Plagiarism Removal</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Page Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1–50 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹899</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">51–100 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1699</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">101–150 Pages</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹2099</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
          
          <div className="text-center mt-6">
            {activeTab === "printing" && (
              <Link to="/print-order">
                <Button className="bg-primary hover:bg-primary-600 text-black">
                  Start Printing Order
                </Button>
              </Link>
            )}
            {activeTab === "binding" && (
              <Link to="/binding-order">
                <Button className="bg-primary hover:bg-primary-600 text-black">
                  Start Binding Order
                </Button>
              </Link>
            )}
            {(activeTab === "plagiarism" || activeTab === "ai") && (
              <Link to="/plagiarism-order">
                <Button className="bg-primary hover:bg-primary-600 text-black">
                  Start Plagiarism Order
                </Button>
              </Link>
            )}
          </div>
        </Tabs>
        
        {/* Dot indicators at the bottom */}
        <div className="flex justify-center mt-6 space-x-2">
          {tabValues.map((tab, index) => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTab === tab 
                  ? 'w-6 bg-primary' 
                  : 'w-1.5 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
