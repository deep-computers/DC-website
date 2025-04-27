import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Plus, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  totalPages: number;
}

interface PricingInfo {
  servicePrice: number;
  totalPrice: number;
  pageDetails: {
    totalPages: number;
    pageRange: string;
  };
  serviceSummary?: string[];
}

const PlagiarismOrderForm = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [serviceType, setServiceType] = useState("check");
  const [isAiService, setIsAiService] = useState(false);
  const [selectedServices, setSelectedServices] = useState({
    plagiarismCheck: true,
    plagiarismRemoval: false,
    aiCheck: false,
    aiRemoval: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentProofRef = useRef<HTMLInputElement>(null);
  const [paymentProof, setPaymentProof] = useState<FileWithPreview | null>(null);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [specifications, setSpecifications] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Updated pricing structure for more granular services
  const servicePrices = {
    plagiarismCheck: {
      '1-50': 399,
      '51-100': 699,
      '101-150': 1099,
      '151+': 1499,
    },
    plagiarismRemoval: {
      '1-50': 899,
      '51-100': 1699,
      '101-150': 2099,
      '151+': 2499,
    },
    aiCheck: {
      '1-50': 399,
      '51-100': 699,
      '101-150': 1099,
      '151+': 1499,
    },
    aiRemoval: {
      '1-50': 899,
      '51-100': 1699,
      '101-150': 2099,
      '151+': 2499,
    },
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      console.log("No files selected in file input");
      return;
    }
    
    console.log("Files selected:", event.target.files.length, "files");
    setIsLoadingFiles(true);
    
    try {
      const generateSimpleId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const fileArray = Array.from(event.target.files);
      const newFiles = fileArray.map((file) => {
        return {
          ...file,
          id: generateSimpleId(),
          preview: URL.createObjectURL(file),
          totalPages: 0 // Initialize with 0 pages, will be set by user input
        } as FileWithPreview;
      });
      
      setFiles(prev => [...prev, ...newFiles]);
      // Price will be calculated after user inputs page count
      
      toast.success(`${newFiles.length} file(s) uploaded successfully. Please enter the page count for each file.`);
      
      // Clear the input value
      if (event.target.value) event.target.value = "";
    } catch (err) {
      console.error("Error in file upload handler:", err);
      toast.error("Failed to process files. Please try again.");
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    calculatePrice(files.filter(file => file.id !== id), selectedServices);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        console.log("Files dropped:", e.dataTransfer.files.length, "files");
        setIsLoadingFiles(true);
        
        const generateSimpleId = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };
        
        const fileArray = Array.from(e.dataTransfer.files);
        const newFiles = fileArray.map((file) => {
          return {
            ...file,
            id: generateSimpleId(),
            preview: URL.createObjectURL(file),
            totalPages: 0 // Initialize with 0 pages, will be set by user input
          } as FileWithPreview;
        });
        
        setFiles(prev => [...prev, ...newFiles]);
        // Price will be calculated after user inputs page count
        
        toast.success(`${newFiles.length} file(s) uploaded successfully. Please enter the page count for each file.`);
      }
    } catch (err) {
      console.error("Error in drop handler:", err);
      toast.error("Failed to process dropped files. Please try again.");
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const handlePageCountChange = (id: string, pages: number) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.map(file => {
        if (file.id === id) {
          return { ...file, totalPages: pages };
        }
        return file;
      });
      calculatePrice(newFiles, selectedServices);
      return newFiles;
    });
  };

  // Update the calculate price function to handle multiple services
  const calculatePrice = (
    currentFiles: FileWithPreview[],
    services: typeof selectedServices
  ) => {
    if (currentFiles.length === 0) {
      setPricingInfo(null);
      return;
    }
    
    let totalPages = 0;
    
    currentFiles.forEach(file => {
      totalPages += file.totalPages || 0;
    });
    
    // Determine page range
    let pageRange = "1-50";
    if (totalPages > 150) {
      pageRange = "151+";
    } else if (totalPages > 100) {
      pageRange = "101-150";
    } else if (totalPages > 50) {
      pageRange = "51-100";
    }
    
    // Calculate total price based on selected services
    let totalPrice = 0;
    let serviceSummary: string[] = [];
    
    if (services.plagiarismCheck) {
      const price = servicePrices.plagiarismCheck[pageRange as keyof typeof servicePrices.plagiarismCheck];
      totalPrice += price;
      serviceSummary.push(`Plagiarism Check: ₹${price}`);
    }
    
    if (services.plagiarismRemoval) {
      const price = servicePrices.plagiarismRemoval[pageRange as keyof typeof servicePrices.plagiarismRemoval];
      totalPrice += price;
      serviceSummary.push(`Plagiarism Removal: ₹${price}`);
    }
    
    if (services.aiCheck) {
      const price = servicePrices.aiCheck[pageRange as keyof typeof servicePrices.aiCheck];
      totalPrice += price;
      serviceSummary.push(`AI Content Check: ₹${price}`);
    }
    
    if (services.aiRemoval) {
      const price = servicePrices.aiRemoval[pageRange as keyof typeof servicePrices.aiRemoval];
      totalPrice += price;
      serviceSummary.push(`AI Content Removal: ₹${price}`);
    }
    
    setPricingInfo({
      servicePrice: totalPrice,
      totalPrice,
      pageDetails: {
        totalPages,
        pageRange
      },
      serviceSummary
    });
  };

  // Update handlers for service selection
  const handleServiceChange = (service: keyof typeof selectedServices, checked: boolean) => {
    const updatedServices = { ...selectedServices, [service]: checked };
    
    // If selecting removal, uncheck check for the same category
    if (service === 'plagiarismRemoval' && checked) {
      updatedServices.plagiarismCheck = false;
    } else if (service === 'plagiarismCheck' && checked) {
      updatedServices.plagiarismRemoval = false;
    }
    
    if (service === 'aiRemoval' && checked) {
      updatedServices.aiCheck = false;
    } else if (service === 'aiCheck' && checked) {
      updatedServices.aiRemoval = false;
    }
    
    // Ensure at least one service is selected
    if (!Object.values(updatedServices).some(value => value)) {
      // If trying to uncheck the last selected service, prevent it
      return;
    }
    
    setSelectedServices(updatedServices);
    calculatePrice(files, updatedServices);
  };

  const handlePaymentProofUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    try {
      const file = event.target.files[0];
      
      // Generate a simple UUID
      const generateSimpleId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const paymentFile = {
        ...file,
        id: generateSimpleId(),
        preview: URL.createObjectURL(file),
      } as FileWithPreview;
      
      setPaymentProof(paymentFile);
      toast.success("Payment proof uploaded successfully");
      
      // Clear the input value
      if (event.target.value) event.target.value = "";
    } catch (err) {
      console.error("Error in payment proof upload:", err);
      toast.error("Failed to upload payment proof. Please try again.");
    }
  }, []);

  const handleRemovePaymentProof = () => {
    if (paymentProof && paymentProof.preview) {
      URL.revokeObjectURL(paymentProof.preview);
    }
    setPaymentProof(null);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecifications(e.target.value);
  };

  // Update validate form to check for service selection
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    
    if (files.length === 0) {
      errors.push("Please upload at least one document");
    }
    
    // Check if any file is missing page count
    const filesMissingPages = files.some(file => !file.totalPages);
    if (filesMissingPages) {
      errors.push("Please enter page count for all uploaded documents");
    }
    
    // Check if at least one service is selected
    if (!Object.values(selectedServices).some(value => value)) {
      errors.push("Please select at least one service");
    }
    
    if (!paymentProof) {
      errors.push("Please upload payment proof");
    }
    
    if (!contactInfo.phone && !contactInfo.email) {
      errors.push("Please provide either email or phone number for contact");
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  }, [files, selectedServices, paymentProof, contactInfo.phone, contactInfo.email]);
  
  // Update form errors when key inputs change
  useEffect(() => {
    validateForm();
  }, [files, selectedServices, paymentProof, contactInfo, validateForm]);

  // Update handle submit to include the new service structure
  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      // Show toast for each error
      formErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload documents
      const documentUploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('contactEmail', contactInfo.email);
        formData.append('contactPhone', contactInfo.phone);
        formData.append('orderType', 'plagiarism-doc');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload document');
        }
        
        return response.json();
      });

      // Upload payment proof
      const paymentFormData = new FormData();
      paymentFormData.append('file', paymentProof);
      paymentFormData.append('contactEmail', contactInfo.email);
      paymentFormData.append('contactPhone', contactInfo.phone);
      paymentFormData.append('orderType', 'plagiarism-payment');
      
      const paymentResponse = await fetch('/api/upload', {
        method: 'POST',
        body: paymentFormData,
      });
      
      if (!paymentResponse.ok) {
        throw new Error('Failed to upload payment proof');
      }
      
      const paymentUploadResult = await paymentResponse.json();

      // Wait for all document uploads to complete
      const documentUploadResults = await Promise.all(documentUploadPromises);

      // Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: documentUploadResults,
          paymentProof: paymentUploadResult,
          contactInfo,
          services: selectedServices,
          totalPages: pricingInfo?.pageDetails.totalPages,
          totalPrice: pricingInfo?.totalPrice,
          specifications
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      toast.success("Your plagiarism check order has been submitted! We'll contact you shortly with the results.");
      
      // Reset form
      setFiles([]);
      setPricingInfo(null);
      setPaymentProof(null);
      setContactInfo({ email: "", phone: "" });
      setSpecifications("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated service description to handle multiple services
  const getServiceDescription = () => {
    const services = [];
    
    if (selectedServices.plagiarismCheck) {
      services.push("Comprehensive plagiarism checking against published sources using Turnitin to ensure academic integrity");
    }
    
    if (selectedServices.plagiarismRemoval) {
      services.push("Professional rewriting to eliminate traditional plagiarism while preserving your original ideas");
    }
    
    if (selectedServices.aiCheck) {
      services.push("Advanced detection of AI-generated content (from ChatGPT, GPT-4, etc.) that most plagiarism tools miss");
    }
    
    if (selectedServices.aiRemoval) {
      services.push("Specialized rewriting that transforms AI-generated text to pass both AI detectors and human review");
    }
    
    return services.join(". ") || "Please select at least one service";
  };

  return (
    <div className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Plagiarism Services</h2>
          <p className="text-gray-600 text-lg">
            Upload your document and get professional plagiarism checking or removal services
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-6 text-primary">Upload Your Document</h3>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {isLoadingFiles ? (
                    <>
                      <Loader2 className="h-12 w-12 mx-auto text-primary mb-4 animate-spin" />
                      <h4 className="text-lg font-medium mb-2">Processing files...</h4>
                      <p className="text-sm text-gray-500">This may take a moment for larger files</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium mb-2">Drag and drop your files here</h4>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                      <p className="text-xs text-gray-400">Supported formats: PDF, DOCX, DOC, TXT</p>
                    </>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.doc,.txt"
                    multiple
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Files</h4>
                    {files.map((file) => (
                      <div key={file.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-400 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="mt-2">
                            <Label htmlFor={`pages-${file.id}`} className="text-sm text-gray-700">
                              Number of Pages
                            </Label>
                            <Input
                              id={`pages-${file.id}`}
                              type="number"
                              min="1"
                              value={file.totalPages || ""}
                              onChange={(e) => handlePageCountChange(file.id, parseInt(e.target.value) || 0)}
                              className="mt-1 w-32"
                              placeholder="Enter pages"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <Label className="mb-2 block font-medium">Select Services</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Choose the services you need (select at least one option)
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4 space-y-3">
                        <h4 className="font-medium text-primary">Traditional Plagiarism Services</h4>
                        <p className="text-xs text-gray-500 mb-2">Detects/removes content copied from published sources</p>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="plagiarism-check"
                            checked={selectedServices.plagiarismCheck}
                            onChange={(e) => handleServiceChange('plagiarismCheck', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="plagiarism-check" className="cursor-pointer">
                            Plagiarism Check (Turnitin)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="plagiarism-removal"
                            checked={selectedServices.plagiarismRemoval}
                            onChange={(e) => handleServiceChange('plagiarismRemoval', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="plagiarism-removal" className="cursor-pointer">
                            Plagiarism Removal
                          </Label>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-3">
                        <h4 className="font-medium text-primary">AI Content Services</h4>
                        <p className="text-xs text-gray-500 mb-2">Detects/removes content generated by AI tools like ChatGPT</p>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ai-check"
                            checked={selectedServices.aiCheck}
                            onChange={(e) => handleServiceChange('aiCheck', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="ai-check" className="cursor-pointer">
                            AI Content Check
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ai-removal"
                            checked={selectedServices.aiRemoval}
                            onChange={(e) => handleServiceChange('aiRemoval', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor="ai-removal" className="cursor-pointer">
                            AI Content Removal
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Choose at least one service. You can combine traditional and AI services for comprehensive coverage.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Service Description</h4>
                  <p className="text-sm text-gray-600">
                    {getServiceDescription()}
                  </p>
                </div>
                
                {/* Specifications Text Area */}
                <div className="mt-6">
                  <Label htmlFor="specifications" className="font-medium mb-2 block">Additional Instructions</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Please provide any specific instructions or requirements for your plagiarism service.
                  </p>
                  <textarea
                    id="specifications"
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Example: Focus on checking sections 3-5, provide detailed plagiarism report, highlight AI-generated content, etc."
                    value={specifications}
                    onChange={handleSpecificationsChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-6 text-primary">Order Summary</h3>
                
                {!pricingInfo ? (
                  <div className="text-center py-8">
                    <div className="plagiarism-animation-container mx-auto mb-4 relative w-32 h-32">
                      <div className="document-stack absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-28">
                        <div className="document document-main absolute w-20 h-24 bg-white border-2 border-gray-300 rounded-sm shadow-md left-2 top-2"></div>
                        <div className="document document-back absolute w-20 h-24 bg-white border border-gray-300 rounded-sm left-0 top-0"></div>
                        
                        {/* Scan line that moves up and down */}
                        <div className="scan-line absolute left-4 w-16 h-1 bg-green-500 opacity-70 z-10 scan-animation"></div>
                        
                        {/* Shield that appears and shows checkmark */}
                        <div className="shield-container absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-12 shield-animation">
                          <div className="shield-body w-10 h-12 bg-primary rounded-t-full rounded-b-sm flex items-center justify-center">
                            <div className="checkmark text-white text-xl font-bold opacity-0 checkmark-animation">✓</div>
                          </div>
                        </div>
                        
                        {/* Plagiarism symbols that get removed */}
                        <div className="plagiarism-mark absolute left-6 top-6 text-xs text-red-500 font-bold plagiarism-mark-animation-1">P</div>
                        <div className="plagiarism-mark absolute left-14 top-12 text-xs text-red-500 font-bold plagiarism-mark-animation-2">P</div>
                        <div className="plagiarism-mark absolute left-10 top-18 text-xs text-red-500 font-bold plagiarism-mark-animation-3">P</div>
                      </div>
                      
                      {/* Person analyzing the document */}
                      <div className="analyst absolute right-0 bottom-0 w-10 h-16">
                        <div className="person-head w-6 h-6 rounded-full bg-[#F9D5A7] mx-auto"></div>
                        <div className="person-body w-8 h-8 bg-[#3F88C5] mt-1 mx-auto rounded-t-md person-analyze-animation"></div>
                        <div className="person-arm absolute w-6 h-1.5 bg-[#F9D5A7] right-2 top-8 transform origin-right rotate-45"></div>
                      </div>
                    </div>
                    <style jsx global>{`
                      @keyframes scanMove {
                        0% { top: 4px; }
                        50% { top: 22px; }
                        100% { top: 4px; }
                      }
                      @keyframes shieldAppear {
                        0%, 60% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        70%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                      }
                      @keyframes checkmarkAppear {
                        0%, 75% { opacity: 0; }
                        85%, 100% { opacity: 1; }
                      }
                      @keyframes plagiarismFade {
                        0%, 50% { opacity: 1; transform: scale(1); }
                        60%, 100% { opacity: 0; transform: scale(0); }
                      }
                      @keyframes personAnalyze {
                        0%, 100% { transform: translateX(0) rotate(0deg); }
                        25% { transform: translateX(-2px) rotate(-3deg); }
                        75% { transform: translateX(2px) rotate(3deg); }
                      }
                      .scan-animation {
                        animation: scanMove 3s infinite;
                      }
                      .shield-animation {
                        animation: shieldAppear 4s infinite;
                      }
                      .checkmark-animation {
                        animation: checkmarkAppear 4s infinite;
                      }
                      .plagiarism-mark-animation-1 {
                        animation: plagiarismFade 4s infinite;
                        animation-delay: 0.5s;
                      }
                      .plagiarism-mark-animation-2 {
                        animation: plagiarismFade 4s infinite;
                        animation-delay: 1s;
                      }
                      .plagiarism-mark-animation-3 {
                        animation: plagiarismFade 4s infinite;
                        animation-delay: 1.5s;
                      }
                      .person-analyze-animation {
                        animation: personAnalyze 2s infinite;
                      }
                    `}</style>
                    <p className="text-gray-500">Upload files to see pricing</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Document Details</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Total Files:</span>
                          <span>{files.length}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Total Pages:</span>
                          <span>{pricingInfo.pageDetails.totalPages}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Page Range:</span>
                          <span>{pricingInfo.pageDetails.pageRange} pages</span>
                        </li>
                        {specifications && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-sm mb-1">Special Instructions:</h5>
                            <p className="text-xs text-gray-600 whitespace-pre-line">{specifications}</p>
                          </div>
                        )}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Selected Services</h4>
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <ul className="space-y-2 text-sm">
                          {selectedServices.plagiarismCheck && (
                            <li className="flex flex-col">
                              <div className="flex justify-between font-medium text-primary">
                                <span>Plagiarism Check (Turnitin)</span>
                                <span>✓</span>
                              </div>
                              <p className="text-xs text-gray-600">Checks against published sources</p>
                            </li>
                          )}
                          {selectedServices.plagiarismRemoval && (
                            <li className="flex flex-col">
                              <div className="flex justify-between font-medium text-primary">
                                <span>Plagiarism Removal</span>
                                <span>✓</span>
                              </div>
                              <p className="text-xs text-gray-600">Rewrites plagiarized content to be original</p>
                            </li>
                          )}
                          {selectedServices.aiCheck && (
                            <li className="flex flex-col">
                              <div className="flex justify-between font-medium text-primary">
                                <span>AI Content Check</span>
                                <span>✓</span>
                              </div>
                              <p className="text-xs text-gray-600">Detects AI-generated content (ChatGPT, etc.)</p>
                            </li>
                          )}
                          {selectedServices.aiRemoval && (
                            <li className="flex flex-col">
                              <div className="flex justify-between font-medium text-primary">
                                <span>AI Content Removal</span>
                                <span>✓</span>
                              </div>
                              <p className="text-xs text-gray-600">Rewrites AI content to bypass detection</p>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Pricing Breakdown</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="mb-2">
                          <p className="text-sm font-medium">Document Size</p>
                          <p className="text-xs text-gray-600">{pricingInfo.pageDetails.totalPages} pages ({pricingInfo.pageDetails.pageRange})</p>
                        </div>
                        <ul className="space-y-2 text-sm border-t pt-2">
                          {pricingInfo.serviceSummary?.map((service, index) => {
                            const [name, price] = service.split(': ');
                            return (
                              <li key={index} className="flex justify-between">
                                <span>{name}</span>
                                <span className="font-medium">{price}</span>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                          <span>Total</span>
                          <span>₹{pricingInfo.totalPrice}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Pricing based on page range and selected services
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Payment Instructions</h4>
                      <div className="bg-white p-3 border rounded-md mb-3">
                        <p className="text-sm mb-2 text-center font-medium">Scan to pay ₹{pricingInfo.totalPrice}</p>
                        <div className="flex justify-center">
                          <img 
                            src="/images/payment-qr.jpg" 
                            alt="PhonePe Payment QR" 
                            className="w-full max-w-[300px] mx-auto"
                          />
                        </div>
                      </div>
                      <div className="text-xs space-y-1 text-gray-500 mb-4">
                        <p>1. After payment, please take a screenshot of the payment confirmation.</p>
                        <p>2. Include your name and contact number with your order.</p>
                        <p>3. Once payment is verified, we'll begin the plagiarism check/removal process.</p>
                        <p>4. We'll contact you with the results within 24-48 hours.</p>
                      </div>
                      
                      {/* Payment Proof Upload Section */}
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium mb-2">Upload Payment Proof</h4>
                        {!paymentProof ? (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => paymentProofRef.current?.click()}
                          >
                            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload payment screenshot</p>
                            <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, PDF</p>
                            <input
                              type="file"
                              ref={paymentProofRef}
                              className="hidden"
                              onChange={handlePaymentProofUpload}
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm font-medium truncate" style={{ maxWidth: '200px' }}>
                                    {paymentProof.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {Math.round(paymentProof.size / 1024)} KB
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={handleRemovePaymentProof} 
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Contact Information */}
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="email" className="text-sm mb-1 block">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="your@email.com"
                              value={contactInfo.email}
                              onChange={handleContactInfoChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm mb-1 block">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Your mobile number"
                              value={contactInfo.phone}
                              onChange={handleContactInfoChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Please provide at least one contact method
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSubmitOrder} 
                      className={`w-full bg-primary hover:bg-primary-700 ${
                        formErrors.length > 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={formErrors.length > 0 || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                    </Button>
                    
                    {formErrors.length > 0 && (
                      <div className="mt-2 text-xs text-red-500">
                        <p>Please fix the following issues:</p>
                        <ul className="list-disc list-inside mt-1">
                          {formErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 text-center">
                      You'll be contacted to confirm the order details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismOrderForm; 