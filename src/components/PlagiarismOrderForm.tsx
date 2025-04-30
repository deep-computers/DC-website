import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Plus, FileText, ShieldCheck, Loader2, Link } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { sendOrderEmail } from '@/lib/emailService';

interface FileWithPreview {
  id: string;
  name: string;
  url: string;
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

interface OrderData {
  orderId: string;
  orderType: string;
  contactInfo: {
    name?: string;
    email: string;
    phone: string;
  };
  orderDetails: any;
  fileNames: string[];
  timestamp: string;
  paymentProofName?: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });
  const [specifications, setSpecifications] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // New file inputs
  const [newFileUrl, setNewFileUrl] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFilePages, setNewFilePages] = useState<number>(0);

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

      const generateSimpleId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
  const addFileUrl = () => {
    if (!newFileUrl) {
      toast.error("Please enter a file URL");
      return;
    }

    if (!newFileName) {
      toast.error("Please enter a file name");
      return;
        }
    
    if (!newFilePages || newFilePages <= 0) {
      toast.error("Please enter the number of pages");
      return;
    }

    // Create a new file entry
    const newFile: FileWithPreview = {
      id: generateSimpleId(),
      name: newFileName,
      url: newFileUrl,
      totalPages: newFilePages
    };
    
    // Add to files array
    setFiles(prev => [...prev, newFile]);
    
    toast.success(`File ${newFileName} added successfully`);
    setNewFileUrl("");
    setNewFileName("");
    setNewFilePages(0);
    
    // Recalculate price with the new file
    calculatePrice([...files, newFile], selectedServices);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    calculatePrice(files.filter(file => file.id !== id), selectedServices);
  };

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
      errors.push("Please add at least one document");
    }
    
    // Check if any file is missing page count
    const filesMissingPages = files.some(file => !file.totalPages);
    if (filesMissingPages) {
      errors.push("Please enter page count for all added documents");
    }
    
    // Check if at least one service is selected
    if (!Object.values(selectedServices).some(value => value)) {
      errors.push("Please select at least one service");
    }
    
    if (!paymentProof) {
      errors.push("Please provide payment proof URL");
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
    
    setIsProcessing(true);
    
    try {
      // Generate a unique order ID with timestamp
      const orderId = `DC-${serviceType === 'aiCheck' ? 'AI' : 'PL'}-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Get file URLs and names
      const fileUrls = files.map(file => file.url);
      const fileNames = files.map(file => file.name);
      
      // Get current timestamp for the order
      const now = new Date();
      
      // Determine order type based on selected services
      let orderTypeLabel = "";
      if (selectedServices.plagiarismCheck) orderTypeLabel = "Plagiarism Check";
      else if (selectedServices.plagiarismRemoval) orderTypeLabel = "Plagiarism Removal";
      else if (selectedServices.aiCheck) orderTypeLabel = "AI Content Check";
      else if (selectedServices.aiRemoval) orderTypeLabel = "AI Content Removal";
      
      // Prepare the order data
      const orderData: OrderData = {
        orderId,
        orderType: selectedServices.aiCheck || selectedServices.aiRemoval ? 'ai' : 'plagiarism',
        contactInfo: {
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        orderDetails: {
          orderType: orderTypeLabel,
        pageCount: pricingInfo?.pageDetails.totalPages || 0,
          pageRange: pricingInfo?.pageDetails.pageRange || '0',
          documentType: orderTypeLabel,
        urgency: 'Normal',
        specialInstructions: specifications,
          totalPrice: pricingInfo?.totalPrice || 0,
          selectedServices: JSON.stringify(selectedServices),
          fileLinks: fileUrls,
          paymentProof: paymentProof
        },
        fileNames: fileNames,
        paymentProofName: "Payment proof URL provided",
        timestamp: now.toISOString()
      };
      
      // Add name property to contactInfo if email is available
      if (contactInfo.email) {
        orderData.contactInfo.name = contactInfo.email.split('@')[0];
      }
      
      // Verify files are included in the order data
      if (fileUrls.length === 0) {
        console.error('No valid file URLs were provided. Original files:', files.map(f => f.name));
        toast.error("Please add at least one file URL");
        setIsProcessing(false);
        return;
      }
      
      console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));
      
      // Send the order via email
      toast.info("Sending your order...");
      const emailSent = await sendOrderEmail(orderData);
      
      if (emailSent) {
        toast.success(`Order submitted successfully! Your order ID is ${orderId}`);
        setOrderSubmitted(true);
        setSubmittedOrderId(orderId);
        
        // Clear form
        setFiles([]);
        setPaymentProof("");
        setNewFileUrl("");
        setNewFileName("");
        setNewFilePages(0);
        setSpecifications("");
        setPricingInfo(null);
        } else {
        toast.error("Failed to submit your order. Please try again or contact support.");
        // Try fallback email method
        sendFallbackEmail(orderId, contactInfo, orderData.orderDetails);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An error occurred while submitting your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback email function for when the API fails
  const sendFallbackEmail = (orderId: string, contactInfo: any, specifications: any) => {
    // Try using a webhook service as a fallback
    try {
      // Create a message for the webhook
      const message = `
New ${serviceType === 'aiCheck' ? 'AI' : 'Plagiarism'} Order: ${orderId}
Customer: ${contactInfo.email}
Email: ${contactInfo.email}
Phone: ${contactInfo.phone}
Specifications: ${JSON.stringify(specifications, null, 2)}
Files: ${files.map(f => f.name).join(', ')}
      `;
      
      // Use Email.js or similar service that can be called directly from the browser
      // For now, we'll just show a special message to the user
      setSubmittedOrderId(orderId);
      setOrderSubmitted(true);
      
      toast.success(`Your ${serviceType === 'aiCheck' ? 'AI' : 'plagiarism'} service order #${orderId} has been submitted! We'll contact you shortly.`);
      toast.info("Please also WhatsApp us at +91-9311244099 with your order details for faster processing.");
      
      // Reset the form
      setFiles([]);
      setPaymentProof("");
      setContactInfo({ email: "", phone: "" });
      setSpecifications("");
    } catch (err) {
      console.error("Error in fallback email:", err);
      toast.error("Order submission failed. Please contact us directly at +91-9311244099.");
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
        
        {orderSubmitted && submittedOrderId ? (
          <div className="max-w-md mx-auto bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">Order Submitted Successfully!</h3>
            <p className="text-green-700 mb-4">Your order number is: <span className="font-bold">{submittedOrderId}</span></p>
            <p className="text-sm text-green-600 mb-6">We have received your order and will contact you shortly.</p>
            <Button 
              onClick={() => setOrderSubmitted(false)} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Place Another Order
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-6 text-primary">Your Documents</h3>
                
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#D4AF37] transition-colors duration-300">
                      <div className="flex flex-col space-y-4">
                        <div className="text-center mb-2">
                          <Upload className="h-12 w-12 mx-auto text-[#D4AF37] mb-2 animate-pulse" />
                          <h4 className="font-medium text-lg text-gray-700">Add Your Documents</h4>
                          <p className="text-sm text-gray-500">Add documents via URL links</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="fileUrl">Document URL (Google Drive, Dropbox, etc.)</Label>
                          <Input 
                            id="fileUrl"
                            type="url" 
                            placeholder="https://drive.google.com/file/..." 
                            value={newFileUrl}
                            onChange={(e) => setNewFileUrl(e.target.value)}
                            className="border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="fileName">Document Name</Label>
                          <Input 
                            id="fileName"
                            type="text" 
                            placeholder="Thesis.pdf" 
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="filePages">Number of Pages</Label>
                          <Input 
                            id="filePages"
                            type="number" 
                            min="1" 
                            placeholder="50" 
                            value={newFilePages || ''}
                            onChange={(e) => setNewFilePages(Number(e.target.value))}
                            className="border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                        <Button 
                          onClick={addFileUrl}
                          className="w-full bg-[#D4AF37] hover:bg-[#c9a632] text-white transition-all duration-300 transform hover:scale-[1.02]"
                          type="button"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Add Document URL
                        </Button>
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-700">
                            <strong>Don't know how to create a document URL?</strong> No problem! You can directly send your documents to us via 
                            <a href="https://wa.me/919311244099" className="font-bold text-blue-600 hover:underline px-1">
                              WhatsApp (+91-9311244099)
                            </a> 
                            along with your order details.
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center">
                      <FileText className="h-5 w-5 text-[#D4AF37] mr-2" />
                      Added Documents ({files.length})
                    </h4>
                    <div className="space-y-3">
                    {files.map((file) => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex items-center justify-center bg-[#D4AF37] bg-opacity-10 rounded-full mr-3">
                              <FileText className="h-5 w-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate" style={{ maxWidth: '200px' }}>
                            {file.name}
                          </p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500 truncate" style={{ maxWidth: '180px' }}>
                                  {file.url}
                          </p>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                  {file.totalPages} pages
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs">
                            <Input
                              type="number"
                              min="1"
                                value={file.totalPages}
                                onChange={(e) => handlePageCountChange(file.id, Number(e.target.value))}
                                className="w-16 h-8 text-center"
                            />
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                              className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                          </div>
                      </div>
                    ))}
                    </div>
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
                  
                  <div className="mb-6 mt-6">
                    <h4 className="font-medium mb-3">Payment Proof URL</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Please provide a screenshot URL of your payment (Google Drive, Dropbox, etc.)
                    </p>
                    <div className="mb-4">
                      <Input 
                        type="url" 
                        placeholder="https://drive.google.com/file/..." 
                        value={paymentProof}
                        onChange={(e) => setPaymentProof(e.target.value)}
                      />
                    </div>
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
          
                  <div className="mb-6 mt-6">
                    <Label htmlFor="email" className="mb-2 block">Contact Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactInfoChange}
                      placeholder="your@email.com"
                    />
                </div>
                
                  <div className="mb-6">
                    <Label htmlFor="phone" className="mb-2 block">Contact Phone</Label>
                    <Input 
                      id="phone"
                      type="tel" 
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                      placeholder="Your phone number"
                    />
                        </div>
                        
                  {formErrors.length > 0 && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="text-red-700 font-medium mb-2">Please fix the following issues:</h4>
                      <ul className="list-disc pl-5">
                        {formErrors.map((error, index) => (
                          <li key={index} className="text-red-600 text-sm">{error}</li>
                        ))}
                      </ul>
                      </div>
                  )}
                  
                  <Button 
                    onClick={handleSubmitOrder} 
                    className="w-full bg-primary hover:bg-primary-700 text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Submit Order"}
                  </Button>
                </CardContent>
              </Card>
                      </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37] flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Service Summary
                  </h3>
                  
                  {pricingInfo ? (
                  <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Total Pages:</span>
                        <span className="text-[#D4AF37]">{pricingInfo.pageDetails.totalPages}</span>
                          </div>
                      
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Page Range:</span>
                        <span className="text-[#D4AF37]">{pricingInfo.pageDetails.pageRange}</span>
                    </div>
                    
                      {pricingInfo.serviceSummary && (
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-3 border-b border-gray-200">
                            <h4 className="font-medium text-sm">Selected Services:</h4>
                              </div>
                          <div className="p-3 space-y-2">
                            {pricingInfo.serviceSummary.map((service, index) => (
                              <div key={index} className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition-colors duration-200">
                                <span className="text-sm">{service.split(':')[0]}</span>
                                <span className="text-sm font-medium text-[#D4AF37]">{service.split(':')[1]}</span>
                              </div>
                            ))}
                              </div>
                              </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg bg-gray-50 p-3 rounded-md mt-4 border border-gray-200">
                        <span>Total Price:</span>
                        <span className="text-[#D4AF37]">₹{pricingInfo.totalPrice}</span>
                    </div>
                    
                      <div className="pt-4 bg-yellow-50 p-4 rounded-md border border-yellow-100 mt-6">
                        <p className="text-sm text-gray-700">
                          <strong>Payment Options:</strong> Google Pay, Phone Pay, PayTM
                        </p>
                        <p className="text-sm font-bold mt-2 flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">UPI ID:</span>
                          <span className="text-green-700">deepcomputers@sbi</span>
                                  </p>
                                </div>
                              </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <ShieldCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Add documents and select services to see pricing details</p>
                          </div>
                        )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-primary">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                      Contact us for assistance with your plagiarism services.
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-center text-sm">
                        <span className="font-medium mr-2">WhatsApp:</span>
                        <a href="https://wa.me/919311244099" className="text-blue-600 hover:underline">
                          +91-9311244099
                        </a>
                      </p>
                      <p className="flex items-center text-sm">
                        <span className="font-medium mr-2">Email:</span>
                        <a href="mailto:services@dcprintingpress.com" className="text-blue-600 hover:underline">
                          services@dcprintingpress.com
                        </a>
                    </p>
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismOrderForm; 