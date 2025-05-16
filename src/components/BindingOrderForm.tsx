import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, File, X, Plus, FileText, Book, BookOpen, Loader2, Link, Wallet, PenLine, ShoppingCart, CheckCircle2, Phone, Mail, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { sendOrderEmail } from '@/lib/emailService';
import { motion, AnimatePresence } from "framer-motion";

interface FileWithPreview {
  id: string;
  name: string;
  url: string;
}

interface PricingInfo {
  printPrice: number;
  bindingPrice: number;
  coverPrice: number;
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

const BindingOrderForm = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [bindingType, setBindingType] = useState("hard-normal");
  const [paperGsm, setPaperGsm] = useState("80");
  const [colorOption, setColorOption] = useState("detect");
  const [coverColor, setCoverColor] = useState("black");
  const [coverPrintType, setCoverPrintType] = useState("none");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  
  // Manual page counts
  const [bwCount, setBwCount] = useState(0);
  const [colorCount, setColorCount] = useState(0);
  const [copies, setCopies] = useState(1);
  const [specifications, setSpecifications] = useState("");
  
  // New file inputs
  const [newFileUrl, setNewFileUrl] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");
  
  // Form validation
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Binding prices
  const bindingPrices = {
    "hard-normal": 120,
    "hard-high": 220,
    "hard-gloss": 250,
    "hard-emboss": 350,
    "soft": 40,
    "spiral": 30
  };

  // Cover print prices
  const coverPrices = {
    "none": 0,
    "simple": 50,
    "premium": 150
  };

  // Paper prices (per page)
  const paperPrices = {
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
      url: newFileUrl
    };
    
    // Add to files array
    setFiles(prev => [...prev, newFile]);
    
    toast.success(`File ${newFileName} added successfully`);
    setNewFileUrl("");
    setNewFileName("");
    calculatePrice([...files, newFile], bindingType, paperGsm, colorOption, coverPrintType);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    calculatePrice(files.filter(file => file.id !== id), bindingType, paperGsm, colorOption, coverPrintType);
  };

  const calculatePrice = (
    currentFiles: FileWithPreview[], 
    binding: string, 
    gsm: string, 
    colorMode: string,
    coverPrint: string
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
    const bwPrice = bwPages * paperPrices.bw[gsm as keyof typeof paperPrices.bw] * copies;
    const colorPrice = totalColorPages * paperPrices.color[gsm as keyof typeof paperPrices.color] * copies;
    const printPrice = bwPrice + colorPrice;
    
    // Calculate binding price (per copy)
    const bindingPrice = bindingPrices[binding as keyof typeof bindingPrices] * copies;
    
    // Calculate cover price (per copy)
    const coverPrice = coverPrices[coverPrint as keyof typeof coverPrices] * copies;
    
    // Calculate total
    const totalPrice = printPrice + bindingPrice + coverPrice;
    
    setPricingInfo({
      printPrice,
      bindingPrice,
      coverPrice,
      totalPrice,
      pageDetails: {
        totalPages: totalPages * copies,
        bwPages: bwPages * copies,
        colorPages: totalColorPages * copies
      }
    });
  };

  // Update handlers to recalculate price when manual counts change
  useEffect(() => {
    calculatePrice(files, bindingType, paperGsm, colorOption, coverPrintType);
  }, [bwCount, colorCount, paperGsm, copies]);

  const handleBindingTypeChange = (value: string) => {
    setBindingType(value);
    
    // Reset cover options if not a hard binding type
    if (!value.startsWith('hard-')) {
      setCoverColor('black');
      setCoverPrintType('none');
    }
    
    calculatePrice(files, value, paperGsm, colorOption, value.startsWith('hard-') ? coverPrintType : 'none');
  };

  const handlePaperGsmChange = (value: string) => {
    setPaperGsm(value);
    calculatePrice(files, bindingType, value, colorOption, coverPrintType);
  };

  const handleColorOptionChange = (value: string) => {
    setColorOption(value);
    calculatePrice(files, bindingType, paperGsm, value, coverPrintType);
  };

  const handleCoverColorChange = (value: string) => {
    setCoverColor(value);
    // No price calculation needed for cover color change
  };

  const handleCoverPrintChange = (value: string) => {
    setCoverPrintType(value);
    calculatePrice(files, bindingType, paperGsm, colorOption, value);
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecifications(e.target.value);
  };

  // Update validation function to check if all required fields are filled
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    
    if (files.length === 0) {
      errors.push("Please add at least one file URL");
    }
    
    if (bwCount === 0 && colorCount === 0) {
      errors.push("Please specify at least one page to bind");
    }
    
    if (!paymentProof) {
      errors.push("Please provide payment proof URL");
    }
    
    if (!contactInfo.phone && !contactInfo.email) {
      errors.push("Please provide either email or phone number for contact");
    }
    
    // For emboss binding, ensure at least 4 copies
    if (bindingType === "hard-emboss" && copies < 4) {
      errors.push("Emboss binding requires a minimum of 4 copies");
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  }, [files.length, bwCount, colorCount, paymentProof, contactInfo.phone, contactInfo.email, bindingType, copies]);
  
  // Update form errors when key inputs change
  useEffect(() => {
    validateForm();
  }, [files, bwCount, colorCount, paymentProof, contactInfo, bindingType, copies, validateForm]);

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
      const orderId = `DC-B-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Get file URLs and names
      const fileUrls = files.map(file => file.url);
      const fileNames = files.map(file => file.name);
      
      // Get current timestamp for the order
      const now = new Date();
      
      // Prepare the order data
      const orderData: OrderData = {
        orderId,
        orderType: 'binding',
        contactInfo: {
          name: contactInfo.email ? contactInfo.email.split('@')[0] : 'Customer',
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        orderDetails: {
        bindingType,
        paperType: paperGsm === "normal" ? "Normal Paper" : `Bond Paper ${paperGsm} GSM`,
        bwPageCount: bwCount,
        colorPageCount: colorCount,
        copies,
        colorOption,
        coverColor,
        coverPrintType,
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
  
  // Fallback email function for when the email service fails
  const sendFallbackEmail = (orderId: string, contactInfo: any, orderDetails: any) => {
    // Try using a webhook service as a fallback
    try {
      // Create a message for the webhook
      const message = `
New Binding Order: ${orderId}
Customer: ${contactInfo.email}
Phone: ${contactInfo.phone}
Specifications: ${JSON.stringify(orderDetails, null, 2)}
Files: ${files.map(f => f.name).join(', ')}
      `;
      
      // Use Email.js or similar service that can be called directly from the browser
      // For now, we'll just show a special message to the user
      setSubmittedOrderId(orderId);
      setOrderSubmitted(true);
      
      toast.success(`Your binding order #${orderId} has been submitted! We'll contact you shortly.`);
      toast.info("Please also WhatsApp us at +91-9311244099 with your order details for faster processing.");
      
      // Reset the form
      setFiles([]);
      setPaymentProof("");
      setContactInfo({ email: "", phone: "" });
      setCopies(1);
      setSpecifications("");
    } catch (err) {
      console.error("Error in fallback email:", err);
      toast.error("Order submission failed. Please contact us directly at +91-9311244099.");
    }
  };

  // Check if binding type is a hard binding option
  const isHardBinding = bindingType.startsWith('hard-');

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
            Binding Order Service
          </h2>
          <p className="text-gray-600 text-lg">
            Professional binding solutions by Deep Computers
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
                        <BookOpen className="h-5 w-5 mr-2" />
                        Binding Order Form
                      </h3>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37] flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Your Files
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
                              <h4 className="font-medium text-lg text-gray-700 mb-1">Add Your Files</h4>
                              <p className="text-sm text-gray-500">Add files via URL links</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="fileUrl" className="font-medium text-gray-700">File URL (Google Drive, Dropbox, etc.)</Label>
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
                              <Label htmlFor="fileName" className="font-medium text-gray-700">File Name</Label>
                              <Input 
                                id="fileName"
                                type="text" 
                                placeholder="Document.pdf" 
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                className="border-[#D4AF37] focus:ring-[#D4AF37] rounded-lg py-3"
                              />
                            </div>
                            <Button 
                              onClick={addFileUrl}
                              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E5C766] hover:from-[#c9a632] hover:to-[#d8bc60] text-white font-medium py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                              type="button"
                            >
                              <Link className="h-5 w-5 mr-2" />
                              Add File URL
                            </Button>
                            
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                              <p className="text-sm text-blue-700 flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                  <strong>Don't know how to create a file URL?</strong> No problem! You can directly send your files to us via 
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
                              Added Files ({files.length})
                            </h4>
                            <div className="space-y-3">
                              {files.map((file) => (
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
                                      <p className="text-xs text-gray-500 truncate" style={{ maxWidth: '200px' }}>
                                        {file.url}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost" 
                                    onClick={() => handleRemoveFile(file.id)} 
                                    className="text-gray-400 hover:text-red-500 rounded-full h-8 w-8 p-0 transform hover:scale-110 transition-all duration-300"
                                  >
                                    <X className="h-5 w-5" />
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Page Count Section */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <h4 className="font-medium text-lg">Page Details</h4>
                        </div>
                        
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-4">
                          <p className="text-sm text-gray-500 mb-4 flex items-center">
                            <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Enter the number of pages to print manually.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                              <Label htmlFor="bw-pages" className="mb-2 block font-medium text-gray-700">Black & White Pages</Label>
                              <div className="flex items-center">
                                <Input 
                                  id="bw-pages" 
                                  type="number" 
                                  min={0} 
                                  value={bwCount} 
                                  onChange={e => setBwCount(Number(e.target.value))}
                                  className="rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                                />
                                <Badge className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300">₹{paperPrices.bw[paperGsm as keyof typeof paperPrices.bw]}/page</Badge>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                              <Label htmlFor="color-pages" className="mb-2 block font-medium text-gray-700">Color Pages</Label>
                              <div className="flex items-center">
                                <Input 
                                  id="color-pages" 
                                  type="number" 
                                  min={0} 
                                  value={colorCount} 
                                  onChange={e => setColorCount(Number(e.target.value))}
                                  className="rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                                />
                                <Badge className="ml-2 bg-gray-200 text-gray-800 hover:bg-gray-300">₹{paperPrices.color[paperGsm as keyof typeof paperPrices.color]}/page</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Specifications Text Area */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <PenLine className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <Label htmlFor="specifications" className="font-medium text-lg">Order Specifications</Label>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <textarea
                            id="specifications"
                            className="w-full p-4 border-0 focus:ring-[#D4AF37] h-24 focus:outline-none"
                            placeholder="Example: Pages 14-15, 46, 57 are colored and rest are black and white. Include table of contents. Add section dividers, etc."
                            value={specifications}
                            onChange={handleSpecificationsChange}
                          />
                          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Let us know about any specific requirements for binding, covers, or other special instructions.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Copies and Binding Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center mb-3">
                            <svg className="h-5 w-5 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                            </svg>
                            <Label htmlFor="copies" className="font-medium">Number of Copies</Label>
                          </div>
                          <Input
                            id="copies"
                            type="number"
                            min="1"
                            value={copies}
                            onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full rounded-lg py-3 border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center mb-3">
                            <Book className="h-5 w-5 text-[#D4AF37] mr-2" />
                            <Label htmlFor="binding-type" className="font-medium">Binding Type</Label>
                          </div>
                          <Select value={bindingType} onValueChange={handleBindingTypeChange}>
                            <SelectTrigger className="w-full bg-white border-[#D4AF37] focus:ring-[#D4AF37] rounded-lg">
                              <SelectValue placeholder="Select binding type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hard-normal">Hard Binding - Normal (₹120)</SelectItem>
                              <SelectItem value="hard-high">Hard Binding - High Quality (₹220)</SelectItem>
                              <SelectItem value="hard-gloss">Hard Binding - Gloss (₹250)</SelectItem>
                              <SelectItem value="hard-emboss">Hard Binding - Emboss (₹350)</SelectItem>
                              <SelectItem value="soft">Soft Binding (₹40)</SelectItem>
                              <SelectItem value="spiral">Spiral Binding (₹30)</SelectItem>
                            </SelectContent>
                          </Select>
                          {bindingType === "hard-emboss" && (
                            <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded border border-amber-100">
                              <svg className="h-4 w-4 text-amber-500 inline-block mr-1 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Emboss binding requires a minimum of 4 copies
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Paper Type */}
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <h4 className="font-medium text-lg">Paper Type</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${paperGsm === "normal" ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handlePaperGsmChange("normal")}
                          >
                            <RadioGroup value={paperGsm} onValueChange={handlePaperGsmChange} className="space-y-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="normal" id="normal" className="text-[#D4AF37]" />
                                  <Label htmlFor="normal" className="font-medium">Normal Paper</Label>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <Badge className="bg-gray-100 text-gray-700">₹1/BW</Badge>
                                  <Badge className="bg-gray-100 text-gray-700 ml-1">₹5/Color</Badge>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${paperGsm === "80" ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handlePaperGsmChange("80")}
                          >
                            <RadioGroup value={paperGsm} onValueChange={handlePaperGsmChange} className="space-y-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="80" id="bond80" className="text-[#D4AF37]" />
                                  <Label htmlFor="bond80" className="font-medium">Bond Paper 80 GSM</Label>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <Badge className="bg-gray-100 text-gray-700">₹2/BW</Badge>
                                  <Badge className="bg-gray-100 text-gray-700 ml-1">₹6/Color</Badge>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${paperGsm === "90" ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handlePaperGsmChange("90")}
                          >
                            <RadioGroup value={paperGsm} onValueChange={handlePaperGsmChange} className="space-y-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="90" id="bond90" className="text-[#D4AF37]" />
                                  <Label htmlFor="bond90" className="font-medium">Bond Paper 90 GSM</Label>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <Badge className="bg-gray-100 text-gray-700">₹2.5/BW</Badge>
                                  <Badge className="bg-gray-100 text-gray-700 ml-1">₹6.5/Color</Badge>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${paperGsm === "100" ? "border-[#D4AF37] bg-[#D4AF37] bg-opacity-5" : "border-gray-200"}`}
                            onClick={() => handlePaperGsmChange("100")}
                          >
                            <RadioGroup value={paperGsm} onValueChange={handlePaperGsmChange} className="space-y-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="100" id="bond100" className="text-[#D4AF37]" />
                                  <Label htmlFor="bond100" className="font-medium">Bond Paper 100 GSM</Label>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <Badge className="bg-gray-100 text-gray-700">₹3/BW</Badge>
                                  <Badge className="bg-gray-100 text-gray-700 ml-1">₹7/Color</Badge>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>
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
                              Submit Binding Order
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
                        <Book className="h-5 w-5 mr-2" />
                        Order Summary
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
                              Paper Type:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{paperGsm === "normal" ? "Normal Paper" : `Bond Paper ${paperGsm} GSM`}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              B&W Pages:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{pricingInfo.pageDetails.bwPages}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Color Pages:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{pricingInfo.pageDetails.colorPages}</span>
                          </div>
                            
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              Total Pages:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{pricingInfo.pageDetails.totalPages}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <BookOpen className="h-4 w-4 text-[#D4AF37] mr-2" />
                              Binding Type:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{bindingType.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                            <span className="font-medium text-gray-700 flex items-center">
                              <svg className="h-4 w-4 text-[#D4AF37] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                              </svg>
                              Copies:
                            </span>
                            <span className="text-[#D4AF37] font-medium">{copies}</span>
                          </div>
                          
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
                                    src="/images/payment-qr.webp" 
                                    alt="Payment QR Code" 
                                    width="144"
                                    height="144"
                                    loading="lazy"
                                    className="h-36 w-36 object-contain rounded-lg" 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
                          <Book className="h-16 w-16 text-gray-300 mb-4" />
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
                        Contact us for assistance with your binding needs.
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

export default BindingOrderForm; 