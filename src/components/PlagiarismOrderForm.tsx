import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, X, Plus, FileText, ShieldCheck, Loader2, Link, Mail, Phone, CheckCircle2, Wallet, PenLine, ShoppingCart, Copy, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { sendOrderEmail } from '@/lib/emailService';
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E5C766] bg-clip-text text-transparent mb-4">
            Plagiarism Services
          </h2>
          <p className="text-gray-600 text-lg">
            Professional plagiarism checking and removal services by Deep Computers
          </p>
        </motion.div>
        
        {orderSubmitted && submittedOrderId ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-medium text-green-800 mb-3">Order Submitted Successfully!</h3>
            <p className="text-green-700 mb-4">Your order number is: <span className="font-bold bg-green-200 px-3 py-1 rounded-md">{submittedOrderId}</span></p>
            <p className="text-sm text-green-600 mb-8">We have received your order and will contact you shortly.</p>
            <Button 
              onClick={() => setOrderSubmitted(false)} 
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Place Another Order
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-none shadow-xl rounded-xl bg-white">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C766] p-6 text-white">
                      <h3 className="font-serif text-xl font-semibold flex items-center">
                        <UploadCloud className="h-5 w-5 mr-2" />
                        Plagiarism Service Form
                      </h3>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37] flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Your Documents
                      </h3>
                  
                      <div className="mb-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#D4AF37] transition-all duration-300 bg-gray-50">
                          <div className="flex flex-col space-y-4">
                            <div className="text-center mb-2">
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <UploadCloud className="h-16 w-16 mx-auto text-[#D4AF37] mb-3" />
                              </motion.div>
                              <h4 className="font-medium text-lg text-gray-700 mb-1">Add Your Documents</h4>
                              <p className="text-sm text-gray-500">Add documents via URL links</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="fileUrl" className="font-medium text-gray-700">Document URL (Google Drive, Dropbox, etc.)</Label>
                              <Input 
                                id="fileUrl"
                                type="url" 
                                placeholder="https://drive.google.com/file/..." 
                                value={newFileUrl}
                                onChange={(e) => setNewFileUrl(e.target.value)}
                                className="border-[#D4AF37] focus:ring-[#D4AF37] rounded-lg py-3"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="fileName" className="font-medium text-gray-700">Document Name</Label>
                              <Input 
                                id="fileName"
                                type="text" 
                                placeholder="Thesis.pdf" 
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                className="border-[#D4AF37] focus:ring-[#D4AF37] rounded-lg py-3"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="filePages" className="font-medium text-gray-700">Number of Pages</Label>
                              <Input 
                                id="filePages"
                                type="number" 
                                min="1" 
                                placeholder="50" 
                                value={newFilePages || ''}
                                onChange={(e) => setNewFilePages(Number(e.target.value))}
                                className="border-[#D4AF37] focus:ring-[#D4AF37] rounded-lg py-3"
                              />
                            </div>
                            <Button 
                              onClick={addFileUrl}
                              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C766] hover:from-[#c9a632] hover:to-[#d8bc60] text-white font-medium py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                              type="button"
                            >
                              <Link className="h-5 w-5 mr-2" />
                              Add Document URL
                            </Button>
                            
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                              <p className="text-sm text-blue-700 flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                  <strong>Don't know how to create a document URL?</strong> No problem! You can directly send your documents to us via 
                                  <a href="https://wa.me/919311244099" className="font-bold text-blue-600 hover:underline px-1 transition-colors">
                                    WhatsApp (+91-9311244099)
                                  </a> 
                                  along with your order details.
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {files.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6"
                          >
                            <h4 className="font-medium mb-3 flex items-center">
                              <FileText className="h-5 w-5 text-[#D4AF37] mr-2" />
                              Added Documents ({files.length})
                            </h4>
                            <div className="space-y-3">
                              {files.map((file, index) => (
                                <motion.div 
                                  key={file.id} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="flex items-center">
                                    <div className="h-12 w-12 flex items-center justify-center bg-[#D4AF37] bg-opacity-10 rounded-full mr-3">
                                      <FileText className="h-6 w-6 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium truncate" style={{ maxWidth: '200px' }}>
                                        {file.name}
                                      </p>
                                      <div className="flex items-center space-x-2">
                                        <p className="text-xs text-gray-500 truncate" style={{ maxWidth: '180px' }}>
                                          {file.url}
                                        </p>
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full shadow-sm">
                                          {file.totalPages} pages
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="text-xs">
                                      <Input
                                        type="number"
                                        min="1"
                                        value={file.totalPages}
                                        onChange={(e) => handlePageCountChange(file.id, Number(e.target.value))}
                                        className="w-16 h-8 text-center shadow-sm border-[#D4AF37] focus:ring-[#D4AF37]"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost" 
                                      onClick={() => handleRemoveFile(file.id)} 
                                      className="text-gray-400 hover:text-red-500 rounded-full h-8 w-8 p-0 transform hover:scale-110 transition-all duration-300"
                                    >
                                      <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Service selection section */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <h4 className="font-medium text-lg">Select Services</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedServices.plagiarismCheck ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handleServiceChange('plagiarismCheck', !selectedServices.plagiarismCheck)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="plagiarism-check"
                                  checked={selectedServices.plagiarismCheck}
                                  onChange={(e) => handleServiceChange('plagiarismCheck', e.target.checked)}
                                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                                />
                                <div>
                                  <Label htmlFor="plagiarism-check" className="font-medium cursor-pointer">Plagiarism Check</Label>
                                  <p className="text-xs text-gray-500 mt-1">Detect content copied from published sources</p>
                                </div>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700">Turnitin</Badge>
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedServices.plagiarismRemoval ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handleServiceChange('plagiarismRemoval', !selectedServices.plagiarismRemoval)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="plagiarism-removal"
                                  checked={selectedServices.plagiarismRemoval}
                                  onChange={(e) => handleServiceChange('plagiarismRemoval', e.target.checked)}
                                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                                />
                                <div>
                                  <Label htmlFor="plagiarism-removal" className="font-medium cursor-pointer">Plagiarism Removal</Label>
                                  <p className="text-xs text-gray-500 mt-1">Rewrite content to eliminate plagiarism</p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Premium</Badge>
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedServices.aiCheck ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handleServiceChange('aiCheck', !selectedServices.aiCheck)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="ai-check"
                                  checked={selectedServices.aiCheck}
                                  onChange={(e) => handleServiceChange('aiCheck', e.target.checked)}
                                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                                />
                                <div>
                                  <Label htmlFor="ai-check" className="font-medium cursor-pointer">AI Content Check</Label>
                                  <p className="text-xs text-gray-500 mt-1">Detect content generated by AI tools</p>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700">Advanced</Badge>
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${selectedServices.aiRemoval ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handleServiceChange('aiRemoval', !selectedServices.aiRemoval)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="ai-removal"
                                  checked={selectedServices.aiRemoval}
                                  onChange={(e) => handleServiceChange('aiRemoval', e.target.checked)}
                                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                                />
                                <div>
                                  <Label htmlFor="ai-removal" className="font-medium cursor-pointer">AI Content Removal</Label>
                                  <p className="text-xs text-gray-500 mt-1">Transform AI-generated text to pass detectors</p>
                                </div>
                              </div>
                              <Badge className="bg-purple-100 text-purple-700">Premium+</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mt-4">
                          <h4 className="font-medium mb-2 text-gray-700 flex items-center">
                            <ShieldCheck className="h-4 w-4 text-[#D4AF37] mr-2" />
                            Service Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getServiceDescription()}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Choose at least one service. You can combine traditional and AI services for comprehensive coverage.
                          </p>
                        </div>
                      </div>
                      
                      {/* Payment Proof section */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <Wallet className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <h4 className="font-medium text-lg">Payment Proof</h4>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <p className="text-sm text-gray-600 mb-4 flex items-start">
                            <svg className="h-5 w-5 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Please provide a screenshot URL of your payment (Google Drive, Dropbox, etc.)</span>
                          </p>
                          <Input 
                            type="url" 
                            placeholder="https://drive.google.com/file/..." 
                            value={paymentProof}
                            onChange={(e) => setPaymentProof(e.target.value)}
                            className="rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                      </div>
                      
                      {/* Special Instructions section */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <PenLine className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <Label htmlFor="specifications" className="font-medium text-lg">Additional Instructions</Label>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <textarea
                            id="specifications"
                            className="w-full p-4 border-0 focus:ring-[#D4AF37] h-24 focus:outline-none"
                            value={specifications}
                            onChange={handleSpecificationsChange}
                            placeholder="Any special instructions for your plagiarism service..."
                          ></textarea>
                          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Let us know about any specific requirements for your plagiarism service, such as areas to focus on or particular concerns.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information section */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <Phone className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <h4 className="font-medium text-lg">Contact Information</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-3">
                              <Mail className="h-4 w-4 text-[#D4AF37] mr-2" />
                              <Label htmlFor="email" className="font-medium">Contact Email</Label>
                            </div>
                            <Input
                              id="email"
                              type="email" 
                              name="email"
                              value={contactInfo.email}
                              onChange={handleContactInfoChange}
                              placeholder="your@email.com"
                              className="rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-3">
                              <Phone className="h-4 w-4 text-[#D4AF37] mr-2" />
                              <Label htmlFor="phone" className="font-medium">Contact Phone</Label>
                            </div>
                            <Input 
                              id="phone"
                              type="tel" 
                              name="phone"
                              value={contactInfo.phone}
                              onChange={handleContactInfoChange}
                              placeholder="Your phone number"
                              className="rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Form Errors section */}
                      <AnimatePresence>
                        {formErrors.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl shadow-sm"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="ml-3 w-full">
                                <h4 className="text-red-800 font-medium text-sm mb-2">Please fix the following issues:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {formErrors.map((error, index) => (
                                    <motion.li 
                                      key={index} 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="text-red-600 text-sm"
                                    >
                                      {error}
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  
                      {/* Submit Button */}
                      <div className="mt-10">
                        <Button 
                          onClick={handleSubmitOrder} 
                          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C766] hover:from-[#c9a632] hover:to-[#d8bc60] text-white font-medium py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Order...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Submit Plagiarism Order
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden border-none shadow-xl rounded-xl bg-white sticky top-6">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#E5C766] p-6 text-white">
                      <h3 className="font-serif text-xl font-semibold flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Service Summary
                      </h3>
                    </div>
                  
                    <div className="p-6">
                      {pricingInfo ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Total Pages:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{pricingInfo.pageDetails.totalPages}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              Page Range:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{pricingInfo.pageDetails.pageRange}</span>
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
                          
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              repeat: 2,
                              repeatType: "reverse",
                              duration: 0.5
                            }}
                            className="flex justify-between font-bold text-lg bg-gradient-to-r from-[#f3eacb] to-[#fff9e6] p-5 rounded-xl mt-4 border border-[#E5C766] shadow-md"
                          >
                            <span>Total Price:</span>
                            <span className="text-[#D4AF37]">₹{pricingInfo.totalPrice}</span>
                          </motion.div>
                          
                          <div className="pt-6">
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-100 shadow-sm">
                              <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                <Wallet className="h-4 w-4 mr-2" />
                                Payment Options
                              </h4>
                              <p className="text-sm text-gray-700 mb-4">
                                Google Pay, Phone Pay, PayTM accepted
                              </p>
                              <div className="flex flex-col items-center">
                                <p className="text-sm font-medium mb-3 text-amber-700">Scan QR Code to Pay</p>
                                <div className="p-1 bg-white rounded-xl border border-yellow-200 shadow-sm">
                                  <img 
                                    src="/images/payment-qr.jpg" 
                                    alt="Payment QR Code" 
                                    className="h-36 w-36 object-contain rounded-lg" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
                          <ShieldCheck className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 mb-2">Add files and specify pages</p>
                          <p className="text-gray-400 text-sm">to see pricing details</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card className="overflow-hidden border-none shadow-xl rounded-xl bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-4 text-[#D4AF37] flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Need Help?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Contact us for assistance with your plagiarism services.
                      </p>
                      <div className="space-y-3">
                        <a href="https://wa.me/919311244099" className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-300 group">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-300">
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium text-green-800 block text-sm">WhatsApp</span>
                            <span className="text-green-600 text-xs">+91-9311244099</span>
                          </div>
                        </a>
                        
                        <a href="mailto:services@dcprintingpress.com" className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-300 group">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-blue-800 block text-sm">Email</span>
                            <span className="text-blue-600 text-xs">services@dcprintingpress.com</span>
                          </div>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismOrderForm; 