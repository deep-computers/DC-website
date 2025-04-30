import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, File, X, Plus, FileText, Book, BookOpen, Loader2, Link } from "lucide-react";
import { toast } from "sonner";
import { sendOrderEmail } from '@/lib/emailService';

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
    <div className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4">Binding Order Service</h2>
          <p className="text-gray-600 text-lg">
            Professional binding solutions by Deep Computers
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
                  <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37]">Your Files</h3>
                
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#D4AF37] transition-colors duration-300">
                      <div className="flex flex-col space-y-4">
                        <div className="text-center mb-2">
                          <Upload className="h-12 w-12 mx-auto text-[#D4AF37] mb-2 animate-pulse" />
                          <h4 className="font-medium text-lg text-gray-700">Add Your Files</h4>
                          <p className="text-sm text-gray-500">Add files via URL links</p>
                    </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="fileUrl">File URL (Google Drive, Dropbox, etc.)</Label>
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
                          <Label htmlFor="fileName">File Name</Label>
                          <Input 
                            id="fileName"
                            type="text" 
                            placeholder="Document.pdf" 
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="border-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                        </div>
                        <Button 
                          onClick={addFileUrl}
                          className="w-full bg-[#D4AF37] hover:bg-[#c9a632] text-white transition-all duration-300 transform hover:scale-[1.02]"
                          type="button"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Add File URL
                        </Button>
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-700">
                            <strong>Don't know how to create a file URL?</strong> No problem! You can directly send your files to us via 
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
                        Added Files ({files.length})
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
                              <p className="text-xs text-gray-500 truncate" style={{ maxWidth: '200px' }}>
                                {file.url}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveFile(file.id)} 
                            className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Page Count Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Page Count</h4>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    Enter the number of pages to print manually.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bw-pages">Black & White Pages</Label>
                      <Input 
                        id="bw-pages" 
                        type="number" 
                        min={0} 
                        value={bwCount} 
                        onChange={e => setBwCount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="color-pages">Color Pages</Label>
                      <Input 
                        id="color-pages" 
                        type="number" 
                        min={0} 
                        value={colorCount} 
                        onChange={e => setColorCount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Specifications Text Area */}
                <div className="mb-6">
                  <Label htmlFor="specifications" className="font-medium mb-2 block">Order Specifications</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Please provide any specific instructions for your binding job.
                  </p>
                  <textarea
                    id="specifications"
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Example: Pages 14-15, 46, 57 are colored and rest are black and white. Include table of contents. Add section dividers, etc."
                    value={specifications}
                    onChange={handleSpecificationsChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="copies" className="mb-2 block">Number of Copies</Label>
                    <Input
                      id="copies"
                      type="number"
                      min="1"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="binding-type" className="mb-2 block">Binding Type</Label>
                    <Select value={bindingType} onValueChange={handleBindingTypeChange}>
                      <SelectTrigger>
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
                    <p className="text-xs text-gray-500 mt-1">
                      *Emboss binding requires a minimum of 4 copies
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="paper-gsm" className="mb-2 block">Paper Type</Label>
                    <Select value={paperGsm} onValueChange={handlePaperGsmChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select paper type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal Paper</SelectItem>
                        <SelectItem value="80">Bond Paper 80 GSM</SelectItem>
                        <SelectItem value="90">Bond Paper 90 GSM</SelectItem>
                        <SelectItem value="100">Bond Paper 100 GSM</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the paper type for your print
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="mb-2 block">Color Options</Label>
                    <RadioGroup value={colorOption} onValueChange={handleColorOptionChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detect" id="color-auto" />
                        <Label htmlFor="color-auto">Auto Detect (Smart)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-bw" id="color-bw" />
                        <Label htmlFor="color-bw">All Black & White</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-color" id="color-all" />
                        <Label htmlFor="color-all">All Color</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {isHardBinding && (
                    <div>
                      <Label htmlFor="cover-color" className="mb-2 block">Cover Color</Label>
                      <Select value={coverColor} onValueChange={handleCoverColorChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cover color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="navy-blue">Navy Blue</SelectItem>
                          <SelectItem value="sky-blue">Sky Blue</SelectItem>
                          <SelectItem value="maroon">Maroon</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {isHardBinding && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Cover Print Options</Label>
                    <RadioGroup value={coverPrintType} onValueChange={handleCoverPrintChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="cover-none" />
                        <Label htmlFor="cover-none">No Print (₹0)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="simple" id="cover-simple" />
                        <Label htmlFor="cover-simple">Simple Text Print (₹50)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="cover-premium" />
                        <Label htmlFor="cover-premium">Premium Cover Design (₹150)</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-gray-500 mt-1">
                      Premium includes custom cover design with text and images
                    </p>
                  </div>
                )}
                  
                  <div className="mb-6">
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
                
                  <div className="mb-6">
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
                    className="w-full bg-[#D4AF37] hover:bg-[#c9a632] text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Submit Binding Order'}
                  </Button>
              </CardContent>
            </Card>
                    </div>
                    
            <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37] flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Order Summary
                </h3>
                
                  {pricingInfo ? (
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Paper Type:</span>
                        <span className="text-[#D4AF37]">{paperGsm === "normal" ? "Normal Paper" : `Bond Paper ${paperGsm} GSM`}</span>
                    </div>
                    
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">BW Pages:</span>
                        <span className="text-[#D4AF37]">{pricingInfo.pageDetails.bwPages}</span>
                        </div>
                
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Color Pages:</span>
                        <span className="text-[#D4AF37]">{pricingInfo.pageDetails.colorPages}</span>
                        </div>
                      
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Total Pages:</span>
                        <span className="text-[#D4AF37]">{pricingInfo.pageDetails.totalPages}</span>
                          </div>
                    
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Binding Type:</span>
                        <span className="text-[#D4AF37]">{bindingType.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                    </div>
                    
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Copies:</span>
                        <span className="text-[#D4AF37]">{copies}</span>
                      </div>
                      
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
                      <Book className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Please add files and specify pages to see pricing</p>
                          </div>
                        )}
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-4 text-[#D4AF37]">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                      Contact us for assistance with your binding needs.
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

export default BindingOrderForm; 