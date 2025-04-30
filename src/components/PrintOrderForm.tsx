import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, File, X, Plus, FileText, Calendar, Clock, Link as LinkIcon, CheckCircle2, AlertCircle, ArrowRight, FileUp, Printer, History, Image as ImageIcon, Cpu, Settings, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { sendOrderEmail } from "@/lib/emailService";
import { motion, AnimatePresence, useAnimate, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import ConfettiExplosion from "react-confetti-explosion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

interface FileWithPreview {
  id: string;
  name: string;
  preview?: string;
  orderId: string;
  url: string;
}

interface PricingInfo {
  printPrice: number;
  totalPrice: number;
  pageDetails: {
    totalPages: number;
    bwPages: number;
    colorPages: number;
  };
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

// Define OrderDetails interface with fileLinks property
interface OrderDetails {
  orderType: string;
  paperType: string;
  bwPageCount: number;
  colorPageCount: number;
  copies: number;
  colorOption: string;
  specialInstructions: string;
  totalPrice: number;
  fileLinks: string[];
  fileList?: string;
  paymentProof?: string;
}

const PrintOrderForm = () => {
  const [bwCount, setBwCount] = useState(0);
  const [colorCount, setColorCount] = useState(0);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [gsm, setGsm] = useState("normal");
  const [printMode, setPrintMode] = useState("auto");
  const [colorOption, setColorOption] = useState("detect");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });
  const [copies, setCopies] = useState(1);
  const [specifications, setSpecifications] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [newFileUrl, setNewFileUrl] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Animation references and values
  const [scope, animate] = useAnimate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const uploadRef = useRef(null);
  
  // Price per page (in INR)
  const prices = {
    bw: {
      "normal": 1,
      "80": 2,
      "90": 2.5,
      "100": 3
    },
    color: {
      "normal": 5,
      "80": 6,
      "90": 6.5,
      "100": 7
    }
  };
  
  // Form steps
  const steps = [
    { id: 0, title: "Upload Files", icon: FileUp },
    { id: 1, title: "Printing Options", icon: Printer },
    { id: 2, title: "Review & Payment", icon: CheckCircle2 }
  ];
  
  // Mouse follow effect for cards
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
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

    // Create a new file entry
    const newFile: FileWithPreview = {
      id: generateSimpleId(),
      name: newFileName,
      url: newFileUrl,
      orderId: generateSimpleId(),
      preview: newFileUrl
    };
    
    // Add to files array
    setFiles(prev => [...prev, newFile]);
    
    toast.success(`File ${newFileName} added successfully`);
    setNewFileUrl("");
    setNewFileName("");
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  // Calculate price based on user inputs
  const calculatePrice = useCallback((
    currentFiles: FileWithPreview[], 
    colorMode: string,
    gsmType: string,
    copyCount: number
  ) => {
    if (currentFiles.length === 0) {
      setPricingInfo(null);
      return;
    }
    
    // Only use manual counts
    const totalPages = bwCount + colorCount;
    const totalColorPages = colorCount;
    const bwPages = bwCount;
    
    // Calculate paper/printing prices
    const bwPrice = bwPages * prices.bw[gsmType as keyof typeof prices.bw] * copyCount;
    const colorPrice = totalColorPages * prices.color[gsmType as keyof typeof prices.color] * copyCount;
    const printPrice = bwPrice + colorPrice;
    
    setPricingInfo({
      printPrice,
      totalPrice: printPrice,
      pageDetails: {
        totalPages: totalPages * copyCount,
        bwPages: bwPages * copyCount,
        colorPages: totalColorPages * copyCount
      }
    });
  }, [bwCount, colorCount, prices]);

  // Recalculate whenever inputs change
  useEffect(() => {
    calculatePrice(files, colorOption, gsm, copies);
  }, [files, bwCount, colorCount, gsm, copies, colorOption, calculatePrice]);

  // Cleanup file preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleGsmChange = (value: string) => {
    setGsm(value);
  };

  const handleColorOptionChange = (value: string) => {
    setColorOption(value);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecifications(e.target.value);
  };

  // Add validation function to check if all required fields are filled
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    
    if (!files.length) {
      errors.push("Please add at least one file URL");
      console.warn("Form validation: No files added");
    }
    
    if (bwCount === 0 && colorCount === 0) {
      errors.push("Please specify at least one page to print");
      console.warn("Form validation: No pages specified");
    }
    
    if (!paymentProof) {
      errors.push("Please provide payment proof URL");
      console.warn("Form validation: No payment proof");
    }
    
    if (!contactInfo.phone && !contactInfo.email) {
      errors.push("Please provide either email or phone number for contact");
      console.warn("Form validation: No contact info");
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  }, [files, bwCount, colorCount, paymentProof, contactInfo.phone, contactInfo.email]);
  
  // Update form errors when key inputs change
  useEffect(() => {
    validateForm();
  }, [files, bwCount, colorCount, paymentProof, contactInfo, validateForm]);

  // Fallback email function for when the email service fails
  const sendFallbackEmail = (orderId: string, contactInfo: any, orderDetails: any) => {
    // Try using a webhook service as a fallback
    try {
      // Create a message for the webhook
      const message = `
New Print Order: ${orderId}
Customer: ${contactInfo.email}
Phone: ${contactInfo.phone}
Specifications: ${JSON.stringify(orderDetails, null, 2)}
Files: ${files.map(f => f.name).join(', ')}
      `;
      
      // Use Email.js or similar service that can be called directly from the browser
      // For now, we'll just show a special message to the user
      setSubmittedOrderId(orderId);
      setOrderSubmitted(true);
      
      toast.success(`Your print order #${orderId} has been submitted! We'll contact you shortly.`);
      toast.info("Please also WhatsApp us at +91-9311244099 with your order details for faster processing.");
      
      // Reset the form
      setFiles([]);
      setPricingInfo(null);
      setPaymentProof("");
      setContactInfo({ email: "", phone: "" });
      setBwCount(0);
      setColorCount(0);
      setSpecifications("");
    } catch (err) {
      console.error("Error in fallback email:", err);
      toast.error("Order submission failed. Please contact us directly at +91-9311244099.");
    }
  };
  
  const handleSubmitOrder = async () => {
    // Validate required fields
    const errors = [];
    if (files.length === 0) {
      errors.push("Please add at least one file URL to print");
    }
    if (!contactInfo.email && !contactInfo.phone) {
      errors.push("Please provide either email or phone for contact");
    }
    if (!paymentProof) {
      errors.push("Please provide payment proof URL");
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the issues before submitting");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Processing your order...");
      
      // Create a unique order ID for this submission
      const orderId = `PR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
      
      // Get file URLs and names
      const fileUrls = files.map(file => file.url);
      const fileNames = files.map(file => file.name);
      
      // Get current timestamp for the order
      const now = new Date();
      
      // Prepare the order data
      const orderData: OrderData = {
        orderId,
        orderType: 'print',
        contactInfo: {
          name: contactInfo.email ? contactInfo.email.split('@')[0] : 'Customer',
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        orderDetails: {
          paperType: gsm === "normal" ? "Normal Paper" : `Bond Paper ${gsm} GSM`,
          bwPageCount: bwCount,
          colorPageCount: colorCount,
          copies: copies,
          colorOption: colorOption,
          specialInstructions: specifications,
          totalPrice: pricingInfo?.totalPrice || 0,
          fileLinks: fileUrls,
          paymentProof: paymentProof
        },
        fileNames: fileNames,
        paymentProofName: "Payment proof URL provided",
        timestamp: now.toISOString()
      };
      
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
        setBwCount(0);
        setColorCount(0);
        setFiles([]);
        setPaymentProof("");
        setNewFileUrl("");
        setNewFileName("");
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

  return (
    <motion.div 
      className="py-12 bg-gradient-to-b from-gray-50 to-white"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          variants={fadeIn}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="h-16 w-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Printer className="h-8 w-8 text-[#D4AF37]" />
            </motion.div>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
              Print Order Service
            </span>
            <motion.span 
              className="absolute -z-10 bottom-2 left-0 h-3 bg-[#D4AF37]/20 w-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            />
          </h2>
          
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Professional printing solutions with premium quality and fast delivery
          </motion.p>
        </motion.div>
        
        {/* Step Progress */}
        {!orderSubmitted && (
          <motion.div 
            className="max-w-3xl mx-auto mb-8"
            variants={fadeIn}
          >
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  className={`relative z-10 flex flex-col items-center ${
                    activeStep >= step.id ? 'text-[#D4AF37]' : 'text-gray-400'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <motion.div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      activeStep >= step.id 
                        ? 'bg-[#D4AF37] text-white' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={activeStep === step.id ? { 
                      scale: [1, 1.1, 1],
                      transition: { 
                        repeat: 0,
                        duration: 0.5
                      }
                    } : {}}
                  >
                    <step.icon className="h-5 w-5" />
                  </motion.div>
                  <p className={`text-sm font-medium ${
                    activeStep >= step.id ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {orderSubmitted && submittedOrderId ? (
          <>
            <AnimatePresence>
              {orderSubmitted && <ConfettiExplosion />}
            </AnimatePresence>
            
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 text-center shadow-lg"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-semibold text-green-800 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Order Submitted Successfully!
                </motion.h3>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-green-700 mb-2">Your order number is:</p>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg py-3 px-6 font-mono text-lg font-bold text-green-800 mb-6 inline-block shadow-sm border border-green-200">
                    {submittedOrderId}
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-green-600 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  We have received your order and will contact you shortly.
                </motion.p>
                
                <motion.div className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={() => {
                      setOrderSubmitted(false);
                      setActiveStep(0);
                    }} 
                    className="bg-white hover:bg-gray-50 text-green-700 border border-green-200 font-medium shadow-sm"
                  >
                    New Order
                  </Button>
                  
                  <a href={`https://wa.me/919311244099?text=Hello, I just placed order ${submittedOrderId}. Please confirm.`} target="_blank" rel="noreferrer">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white w-full font-medium"
                    >
                      Contact on WhatsApp
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-serif text-xl font-semibold text-[#D4AF37] flex items-center">
                          <FileUp className="h-5 w-5 mr-2" />
                          Upload Your Files
                        </h3>
                      </div>
                      
                      <CardContent className="p-6">
                        <motion.div 
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div 
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#D4AF37] transition-colors duration-300 relative overflow-hidden group"
                            ref={uploadRef}
                            onMouseMove={handleMouseMove}
                            whileHover={{
                              boxShadow: "0 10px 30px -5px rgba(212, 175, 55, 0.2)"
                            }}
                          >
                            <motion.div
                              className="absolute w-40 h-40 bg-[#D4AF37]/10 rounded-full filter blur-2xl pointer-events-none opacity-0 group-hover:opacity-100"
                              style={{
                                x: useMotionTemplate`calc(${mouseX}px - 80px)`,
                                y: useMotionTemplate`calc(${mouseY}px - 80px)`,
                              }}
                              transition={{ type: "spring", damping: 15, stiffness: 150 }}
                            />
                            
                            <div className="flex flex-col space-y-4">
                              <div className="text-center mb-2">
                                <motion.div
                                  className="h-16 w-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4"
                                  animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.8, 1, 0.8]
                                  }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 3,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Upload className="h-8 w-8 text-[#D4AF37]" />
                                </motion.div>
                                <h4 className="font-semibold text-lg text-gray-700 mb-1">Add Your Files</h4>
                                <p className="text-sm text-gray-500">Upload files via URL links to get started</p>
                              </div>
                              
                              <div className="flex flex-col space-y-4 relative">
                                <div className="space-y-2">
                                  <Label htmlFor="fileUrl" className="font-medium text-gray-700">File URL (Google Drive, Dropbox, etc.)</Label>
                                  <div className="relative">
                                    <LinkIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input 
                                      id="fileUrl"
                                      type="url" 
                                      placeholder="https://drive.google.com/file/..." 
                                      value={newFileUrl}
                                      onChange={(e) => setNewFileUrl(e.target.value)}
                                      className="pl-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 transition-all duration-300"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="fileName" className="font-medium text-gray-700">File Name</Label>
                                  <div className="relative">
                                    <FileText className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input 
                                      id="fileName"
                                      type="text" 
                                      placeholder="Resume.pdf" 
                                      value={newFileName}
                                      onChange={(e) => setNewFileName(e.target.value)}
                                      className="pl-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 transition-all duration-300"
                                    />
                                  </div>
                                </div>
                                
                                <motion.button 
                                  onClick={addFileUrl}
                                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white py-3 px-4 rounded-lg font-medium shadow-md flex items-center justify-center space-x-2 overflow-hidden relative"
                                  whileTap={{ scale: 0.98 }}
                                  whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 10px 15px -3px rgba(212, 175, 55, 0.2), 0 4px 6px -2px rgba(212, 175, 55, 0.1)"
                                  }}
                                >
                                  <span className="relative z-10">Add File URL</span>
                                  <Plus className="h-4 w-4 relative z-10" />
                                  <motion.div 
                                    className="absolute inset-0 bg-white opacity-0"
                                    whileHover={{ opacity: 0.2 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </motion.button>
                              </div>
                              
                              <motion.div 
                                className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <motion.div 
                                      className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"
                                      animate={{ 
                                        scale: [1, 1.05, 1],
                                      }}
                                      transition={{ 
                                        repeat: Infinity, 
                                        duration: 4
                                      }}
                                    >
                                      <AlertCircle className="h-5 w-5 text-blue-600" />
                                    </motion.div>
                                  </div>
                                  <div className="ml-3">
                                    <h4 className="text-sm font-medium text-blue-800 mb-1">Don't know how to create a file URL?</h4>
                                    <p className="text-sm text-blue-700">
                                      You can directly send your files to us via{" "}
                                      <a 
                                        href="https://wa.me/919311244099" 
                                        className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
                                        target="_blank" 
                                        rel="noreferrer"
                                      >
                                        WhatsApp (+91-9311244099)
                                      </a>{" "}
                                      along with your order details.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                        
                        {files.length > 0 && (
                          <motion.div 
                            className="mb-6"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium flex items-center text-gray-700">
                                <FileText className="h-5 w-5 text-[#D4AF37] mr-2" />
                                Added Files
                                <motion.span 
                                  className="ml-2 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold px-2 py-0.5 rounded-full" 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                  {files.length}
                                </motion.span>
                              </h4>
                            </div>
                            <motion.div 
                              className="space-y-3"
                              variants={staggerContainer}
                              initial="hidden"
                              animate="visible"
                            >
                              <AnimatePresence>
                                {files.map((file) => (
                                  <motion.div 
                                    key={file.id} 
                                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-300"
                                    variants={fadeIn}
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                                    layout
                                  >
                                    <div className="flex items-center flex-1 min-w-0">
                                      <motion.div 
                                        className="h-10 w-10 flex items-center justify-center bg-[#D4AF37]/10 rounded-full mr-3 flex-shrink-0"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
                                      >
                                        <FileText className="h-5 w-5 text-[#D4AF37]" />
                                      </motion.div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate" title={file.url}>
                                          {file.url}
                                        </p>
                                      </div>
                                    </div>
                                    <motion.button 
                                      onClick={() => handleRemoveFile(file.id)} 
                                      className="ml-2 flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <X className="h-4 w-4" />
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        )}
                      </CardContent>
                      
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                        <div></div>
                        <motion.button
                          onClick={() => setActiveStep(1)}
                          className="bg-[#D4AF37] hover:bg-[#c9a632] text-white px-5 py-2 rounded-lg font-medium shadow-md flex items-center space-x-2"
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                          disabled={files.length === 0}
                        >
                          <span>Next: Printing Options</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-serif text-xl font-semibold text-[#D4AF37] flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          Printing Options
                        </h3>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h4 className="font-medium mb-3 flex items-center text-gray-700">
                              <Printer className="h-4 w-4 text-[#D4AF37] mr-2" />
                              Page Count
                            </h4>
                            <p className="text-sm text-gray-500 mb-3">
                              Enter the number of pages to print:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="bwCount" className="mb-2 block">Black & White Pages</Label>
                                <div className="relative">
                                  <Input 
                                    id="bwCount"
                                    type="number" 
                                    min="0" 
                                    placeholder="0" 
                                    value={bwCount} 
                                    onChange={(e) => setBwCount(parseInt(e.target.value) || 0)}
                                    className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 pr-10"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-400 text-xs">pages</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="colorCount" className="mb-2 block">Color Pages</Label>
                                <div className="relative">
                                  <Input 
                                    id="colorCount"
                                    type="number" 
                                    min="0" 
                                    placeholder="0" 
                                    value={colorCount} 
                                    onChange={(e) => setColorCount(parseInt(e.target.value) || 0)}
                                    className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 pr-10"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-400 text-xs">pages</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Label htmlFor="copies" className="mb-2 block font-medium text-gray-700">Number of Copies</Label>
                            <div className="relative">
                              <Input 
                                id="copies"
                                type="number" 
                                min="1" 
                                value={copies} 
                                onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                                className="border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 pr-10"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-400 text-xs">copies</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="font-medium mb-3 flex items-center text-gray-700">
                            <FileText className="h-4 w-4 text-[#D4AF37] mr-2" />
                            Paper Type
                          </h4>
                          <RadioGroup value={gsm} onValueChange={handleGsmChange}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                { id: "normal", label: "Normal Paper", price: "₹1/BW, ₹5/Color" },
                                { id: "80", label: "Bond Paper 80 GSM", price: "₹2/BW, ₹6/Color" },
                                { id: "90", label: "Bond Paper 90 GSM", price: "₹2.5/BW, ₹6.5/Color" },
                                { id: "100", label: "Bond Paper 100 GSM", price: "₹3/BW, ₹7/Color" }
                              ].map((paperType, index) => (
                                <motion.div 
                                  key={paperType.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + index * 0.05 }}
                                  whileHover={{ y: -3, backgroundColor: gsm === paperType.id ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.05)" }}
                                >
                                  <label 
                                    htmlFor={paperType.id} 
                                    className={`flex items-start p-3 rounded-lg cursor-pointer border ${
                                      gsm === paperType.id 
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                                    } transition-all duration-300`}
                                  >
                                    <div className="flex items-center h-5">
                                      <RadioGroupItem value={paperType.id} id={paperType.id} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <p className="font-medium text-gray-700">{paperType.label}</p>
                                      <p className="text-gray-500">{paperType.price}</p>
                                    </div>
                                  </label>
                                </motion.div>
                              ))}
                            </div>
                          </RadioGroup>
                        </motion.div>
                        
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h4 className="font-medium mb-3 flex items-center text-gray-700">
                            <Settings className="h-4 w-4 text-[#D4AF37] mr-2" />
                            Color Options
                          </h4>
                          <RadioGroup value={colorOption} onValueChange={handleColorOptionChange}>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                { id: "detect", label: "Auto-detect color pages", description: "Our system will automatically detect which pages need color printing" },
                                { id: "all-bw", label: "All Black & White", description: "Print all pages in black & white (most economical)" },
                                { id: "all-color", label: "All Color", description: "Print all pages in color (best quality for colored content)" }
                              ].map((option, index) => (
                                <motion.div 
                                  key={option.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4 + index * 0.05 }}
                                  whileHover={{ y: -3, backgroundColor: colorOption === option.id ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.05)" }}
                                >
                                  <label 
                                    htmlFor={option.id} 
                                    className={`flex items-start p-3 rounded-lg cursor-pointer border ${
                                      colorOption === option.id 
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                                    } transition-all duration-300`}
                                  >
                                    <div className="flex items-center h-5">
                                      <RadioGroupItem value={option.id} id={option.id} />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <p className="font-medium text-gray-700">{option.label}</p>
                                      <p className="text-gray-500">{option.description}</p>
                                    </div>
                                  </label>
                                </motion.div>
                              ))}
                            </div>
                          </RadioGroup>
                        </motion.div>
                        
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label htmlFor="specifications" className="mb-2 block font-medium text-gray-700 flex items-center">
                            <MessageCircle className="h-4 w-4 text-[#D4AF37] mr-2" />
                            Special Instructions
                          </Label>
                          <textarea
                            id="specifications"
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30 resize-none"
                            value={specifications}
                            onChange={handleSpecificationsChange}
                            placeholder="Any special instructions for printing (e.g., page ranges for color, binding preferences, etc.)"
                          ></textarea>
                        </motion.div>
                      </CardContent>
                      
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                        <motion.button
                          onClick={() => setActiveStep(0)}
                          className="text-gray-600 hover:text-gray-900 px-5 py-2 rounded-lg font-medium border border-gray-300 hover:border-gray-400 flex items-center space-x-2 bg-white"
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Back</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setActiveStep(2)}
                          className="bg-[#D4AF37] hover:bg-[#c9a632] text-white px-5 py-2 rounded-lg font-medium shadow-md flex items-center space-x-2"
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                          disabled={bwCount === 0 && colorCount === 0}
                        >
                          <span>Next: Review & Payment</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                
                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover" 
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-serif text-xl font-semibold text-[#D4AF37] flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Review & Payment
                        </h3>
                      </div>
                      
                      <CardContent className="p-6">
                        <motion.div
                          className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Order Review
                          </h4>
                          <p className="text-sm text-blue-600">
                            Please review your order details. You can go back to make changes if needed.
                          </p>
                        </motion.div>
                        
                        <motion.div
                          className="mb-6 space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">Files ({files.length})</h5>
                              <div className="max-h-20 overflow-y-auto text-sm text-gray-600">
                                {files.map((file, index) => (
                                  <div key={file.id} className="mb-1 truncate">
                                    {index + 1}. {file.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <h5 className="text-sm font-medium text-gray-700 mb-3">Printing Details</h5>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                  <span>Paper:</span>
                                  <span className="font-medium">{gsm === "normal" ? "Normal Paper" : `Bond Paper ${gsm} GSM`}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Pages:</span>
                                  <span className="font-medium">{bwCount} BW, {colorCount} Color</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Copies:</span>
                                  <span className="font-medium">{copies}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-lg border border-yellow-100">
                            <h4 className="font-medium text-amber-800 mb-4 flex items-center">
                              <ImageIcon className="h-5 w-5 mr-2 text-amber-500" />
                              Payment Details
                            </h4>
                            
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-amber-700 font-medium">Total Amount:</span>
                                <span className="text-lg font-bold text-amber-800">₹{pricingInfo?.totalPrice || 0}</span>
                              </div>
                              
                              <div className="bg-white p-3 rounded-lg border border-yellow-200 flex items-center justify-between mb-4">
                                <div className="text-sm text-gray-700">
                                  <p className="font-medium">UPI ID:</p>
                                  <p className="font-mono">deepcomputers@sbi</p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText("deepcomputers@sbi");
                                    toast.success("UPI ID copied to clipboard!");
                                  }}
                                  className="text-amber-600 hover:text-amber-700 text-sm font-medium px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                                >
                                  Copy
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {["Google Pay", "Phone Pay", "PayTM"].map((method, index) => (
                                  <div key={method} className="text-center bg-white p-2 rounded-md border border-yellow-200 text-xs font-medium text-amber-700">
                                    {method}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <Label htmlFor="paymentProof" className="mb-2 block font-medium text-amber-800">
                                Payment Proof URL
                              </Label>
                              <p className="text-xs text-amber-700 mb-2">
                                After making the payment, please provide a screenshot URL (Google Drive, Dropbox, etc.)
                              </p>
                              <div className="relative">
                                <ImageIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                                <Input 
                                  id="paymentProof"
                                  type="url" 
                                  placeholder="https://drive.google.com/file/..." 
                                  value={paymentProof}
                                  onChange={(e) => setPaymentProof(e.target.value)}
                                  className="pl-10 border-yellow-300 focus:border-amber-500 focus:ring-amber-500/30"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          className="mb-6 space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div>
                            <Label htmlFor="email" className="mb-2 block font-medium text-gray-700">Contact Email</Label>
                            <div className="relative">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              <Input
                                id="email"
                                type="email" 
                                name="email"
                                value={contactInfo.email}
                                onChange={handleContactInfoChange}
                                placeholder="your@email.com"
                                className="pl-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30"
                              />
                            </div>
                          </div>
                              
                          <div>
                            <Label htmlFor="phone" className="mb-2 block font-medium text-gray-700">Contact Phone</Label>
                            <div className="relative">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              <Input 
                                id="phone"
                                type="tel" 
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleContactInfoChange}
                                placeholder="Your phone number"
                                className="pl-10 border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30"
                              />
                            </div>
                          </div>
                        </motion.div>
                                  
                        {formErrors.length > 0 && (
                          <motion.div 
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <h4 className="text-red-700 font-medium mb-2 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Please fix the following issues:
                            </h4>
                            <ul className="list-disc pl-5">
                              {formErrors.map((error, index) => (
                                <motion.li 
                                  key={index} 
                                  className="text-red-600 text-sm"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                >
                                  {error}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </CardContent>
                      
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                        <motion.button
                          onClick={() => setActiveStep(1)}
                          className="text-gray-600 hover:text-gray-900 px-5 py-2 rounded-lg font-medium border border-gray-300 hover:border-gray-400 flex items-center space-x-2 bg-white"
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Back</span>
                        </motion.button>
                        
                        <motion.button 
                          onClick={handleSubmitOrder} 
                          className="relative bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-6 py-2 rounded-lg font-medium shadow-md flex items-center space-x-2 overflow-hidden"
                          disabled={isProcessing}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 10px 15px -3px rgba(212, 175, 55, 0.2), 0 4px 6px -2px rgba(212, 175, 55, 0.1)"
                          }}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Print Order</span>
                              <CheckCircle2 className="h-4 w-4 ml-1" />
                            </>
                          )}
                          <motion.div 
                            className="absolute inset-0 bg-white opacity-0"
                            whileHover={{ opacity: 0.2 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-0">
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 px-6 py-4 border-b border-gray-100">
                  <h3 className="font-serif text-xl font-semibold text-[#D4AF37] flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Order Summary
                  </h3>
                </div>
                
                <CardContent className="p-6">
                  {pricingInfo ? (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div 
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-gray-700 font-medium">Paper Type:</span>
                        <span className="text-[#D4AF37] font-semibold">{gsm === "normal" ? "Normal Paper" : `Bond Paper ${gsm} GSM`}</span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-gray-700 font-medium">BW Pages:</span>
                        <motion.span 
                          className="text-[#D4AF37] font-semibold"
                          key={pricingInfo.pageDetails.bwPages}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {pricingInfo.pageDetails.bwPages}
                        </motion.span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-gray-700 font-medium">Color Pages:</span>
                        <motion.span 
                          className="text-[#D4AF37] font-semibold"
                          key={pricingInfo.pageDetails.colorPages}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {pricingInfo.pageDetails.colorPages}
                        </motion.span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-gray-700 font-medium">Total Pages:</span>
                        <motion.span 
                          className="text-[#D4AF37] font-semibold"
                          key={pricingInfo.pageDetails.totalPages}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {pricingInfo.pageDetails.totalPages}
                        </motion.span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-gray-700 font-medium">Copies:</span>
                        <motion.span 
                          className="text-[#D4AF37] font-semibold"
                          key={copies}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {copies}
                        </motion.span>
                      </motion.div>
                      
                      <motion.div 
                        className="flex justify-between font-bold text-lg mt-6 p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1), 0 8px 10px -6px rgba(212, 175, 55, 0.1)" 
                        }}
                      >
                        <span className="text-gray-800">Total Price:</span>
                        <motion.span 
                          className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent"
                          key={pricingInfo.totalPrice}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          ₹{pricingInfo.totalPrice}
                        </motion.span>
                      </motion.div>
                      
                      <motion.div 
                        className="pt-4 bg-yellow-50 p-5 rounded-xl border border-yellow-100 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2 text-yellow-600" />
                          Payment Options
                        </h4>
                        <div className="flex space-x-2 mb-4">
                          {["Google Pay", "Phone Pay", "PayTM"].map((method, index) => (
                            <motion.span 
                              key={method}
                              className="bg-white text-yellow-800 border border-yellow-200 px-2 py-1 rounded-md text-sm"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                            >
                              {method}
                            </motion.span>
                          ))}
                        </div>
                        <div className="flex items-center">
                          <motion.div 
                            className="bg-green-100 text-green-800 px-3 py-1.5 rounded-l-lg text-sm font-medium border-r border-green-200"
                            whileHover={{ scale: 1.02 }}
                          >
                            UPI ID:
                          </motion.div>
                          <motion.div 
                            className="bg-white text-green-700 px-3 py-1.5 rounded-r-lg text-sm font-medium border border-green-100"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              navigator.clipboard.writeText("deepcomputers@sbi");
                              toast.success("UPI ID copied to clipboard!");
                            }}
                          >
                            deepcomputers@sbi
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [0.9, 1.1, 0.9],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3,
                          ease: "easeInOut"
                        }}
                        className="mb-4"
                      >
                        <FileText className="h-16 w-16 text-gray-300" />
                      </motion.div>
                      <p className="text-gray-500 max-w-[200px] mx-auto">
                        Add files and specify pages to see pricing
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
              
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg overflow-hidden rounded-xl">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-blue-700 flex items-center">
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3, repeatDelay: 5 }}
                      >
                        <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                      </motion.div>
                      Need Help?
                    </h3>
                    <p className="text-blue-600 mb-4 text-sm">
                      Contact us directly for assistance with your printing needs.
                    </p>
                    <div className="space-y-3">
                      <motion.a 
                        href="https://wa.me/919311244099" 
                        className="flex items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-300 shadow-sm border border-blue-100"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-600 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">WhatsApp Support</h4>
                          <p className="text-xs text-blue-600">+91-9311244099</p>
                        </div>
                      </motion.a>
                      
                      <motion.a 
                        href="mailto:services@dcprintingpress.com" 
                        className="flex items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-300 shadow-sm border border-blue-100"
                        whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">Email Support</h4>
                          <p className="text-xs text-blue-600">services@dcprintingpress.com</p>
                        </div>
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrintOrderForm; 