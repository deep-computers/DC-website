import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, File, X, Plus, FileText, Calendar, Clock, Link } from "lucide-react";
import { toast } from "sonner";
import { sendOrderEmail } from "@/lib/emailService";

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

  // Add validation state
  const [formErrors, setFormErrors] = useState<string[]>([]);

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
    <div className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4">Print Order Service</h2>
          <p className="text-gray-600 text-lg">
            Professional printing solutions by Deep Computers
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
                            placeholder="Resume.pdf" 
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
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Page Count</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Enter the number of pages to print. You must enter these values manually.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bwCount" className="mb-2 block">Black & White Pages</Label>
                        <Input 
                          id="bwCount"
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={bwCount} 
                          onChange={(e) => setBwCount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="colorCount" className="mb-2 block">Color Pages</Label>
                        <Input 
                          id="colorCount"
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={colorCount} 
                          onChange={(e) => setColorCount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="copies" className="mb-2 block">Number of Copies</Label>
                    <Input 
                      id="copies"
                      type="number" 
                      min="1" 
                      value={copies} 
                      onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                      className="w-full"
                    />
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Paper Type</h4>
                    <RadioGroup value={gsm} onValueChange={handleGsmChange}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">Normal Paper (₹1/BW, ₹5/Color)</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="80" id="bond80" />
                        <Label htmlFor="bond80">Bond Paper 80 GSM (₹2/BW, ₹6/Color)</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="90" id="bond90" />
                        <Label htmlFor="bond90">Bond Paper 90 GSM (₹2.5/BW, ₹6.5/Color)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="100" id="bond100" />
                        <Label htmlFor="bond100">Bond Paper 100 GSM (₹3/BW, ₹7/Color)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Color Options</h4>
                    <RadioGroup value={colorOption} onValueChange={handleColorOptionChange}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="detect" id="detect" />
                        <Label htmlFor="detect">Auto-detect color pages</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="all-bw" id="all-bw" />
                        <Label htmlFor="all-bw">All Black & White</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-color" id="all-color" />
                        <Label htmlFor="all-color">All Color</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="specifications" className="mb-2 block">Special Instructions</Label>
                    <textarea
                      id="specifications"
                      className="w-full p-2 border rounded-md h-24"
                      value={specifications}
                      onChange={handleSpecificationsChange}
                      placeholder="Any special instructions for printing..."
                    ></textarea>
                  </div>
                  
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
                    {isProcessing ? 'Processing...' : 'Submit Print Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37] flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Order Summary
                  </h3>
                  
                  {pricingInfo ? (
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2 hover:bg-gray-50 transition-all duration-300 p-2 rounded">
                        <span className="font-medium">Paper Type:</span>
                        <span className="text-[#D4AF37]">{gsm === "normal" ? "Normal Paper" : `Bond Paper ${gsm} GSM`}</span>
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
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
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
                      Contact us for assistance with your printing needs.
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

export default PrintOrderForm; 