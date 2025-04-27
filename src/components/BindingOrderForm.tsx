import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, File, X, Plus, FileText, Book, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
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

const BindingOrderForm = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [bindingType, setBindingType] = useState("hard-normal");
  const [paperGsm, setPaperGsm] = useState("80");
  const [colorOption, setColorOption] = useState("detect");
  const [coverColor, setCoverColor] = useState("black");
  const [coverPrintType, setCoverPrintType] = useState("none");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paymentProofRef = useRef<HTMLInputElement>(null);
  const [paymentProof, setPaymentProof] = useState<FileWithPreview | null>(null);
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
  
  // Form validation
  const [formErrors, setFormErrors] = useState<string[]>([]);

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

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error("No files selected");
      return;
    }
    
    setIsProcessing(true);
    setIsLoadingFiles(true);
    
    try {
      const fileArray = Array.from(event.target.files);
      const validFiles = fileArray.filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        const isValidType = extension === 'pdf' || extension === 'doc' || extension === 'docx';
        if (!isValidType) {
          toast.error(`File "${file.name}" is not supported. Only PDF and Word files are allowed.`);
        }
        return isValidType;
      });

      if (validFiles.length === 0) {
        toast.error("No valid files to upload");
        setIsProcessing(false);
        setIsLoadingFiles(false);
        return;
      }

      const newFiles = validFiles.map(file => ({
        ...file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file)
      }) as FileWithPreview);
      
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`Successfully uploaded ${newFiles.length} file(s)`);
      calculatePrice([...files, ...newFiles], bindingType, paperGsm, colorOption, coverPrintType);
    } catch (error) {
      console.error("Error in file upload:", error);
      toast.error("Failed to process files. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsLoadingFiles(false);
      if (event.target.value) event.target.value = "";
    }
  }, [files, bindingType, paperGsm, colorOption, coverPrintType]);

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    calculatePrice(files.filter(file => file.id !== id), bindingType, paperGsm, colorOption, coverPrintType);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      toast.error("No files dropped");
      return;
    }
    
    setIsProcessing(true);
    setIsLoadingFiles(true);
    
    try {
      const fileArray = Array.from(e.dataTransfer.files);
      const validFiles = fileArray.filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        const isValidType = extension === 'pdf' || extension === 'doc' || extension === 'docx';
        if (!isValidType) {
          toast.error(`File "${file.name}" is not supported. Only PDF and Word files are allowed.`);
        }
        return isValidType;
      });

      if (validFiles.length === 0) {
        toast.error("No valid files to drop");
        setIsProcessing(false);
        setIsLoadingFiles(false);
        return;
      }

      const newFiles = validFiles.map(file => ({
        ...file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file)
      }) as FileWithPreview);
      
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`Successfully dropped ${newFiles.length} file(s)`);
      calculatePrice([...files, ...newFiles], bindingType, paperGsm, colorOption, coverPrintType);
    } catch (error) {
      console.error("Error in drop handler:", error);
      toast.error("Failed to process dropped files. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsLoadingFiles(false);
    }
  }, [files, bindingType, paperGsm, colorOption, coverPrintType]);

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

  // Add validation function to check if all required fields are filled
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    
    if (files.length === 0) {
      errors.push("Please upload at least one file");
    }
    
    if (bwCount === 0 && colorCount === 0) {
      errors.push("Please specify at least one page to bind");
    }
    
    if (!paymentProof) {
      errors.push("Please upload payment proof");
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

  const handleSubmitOrder = () => {
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
      
      // Get current date and time
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      
      // Create FormData for the API request
      const formData = new FormData();
      
      // Add order type and ID
      formData.append('orderType', 'binding');
      formData.append('orderId', orderId);
      
      // Add contact information
      formData.append('contactName', contactInfo.email.split('@')[0]); // Use email username as name
      formData.append('contactEmail', contactInfo.email);
      formData.append('contactPhone', contactInfo.phone);
      
      // Add specifications as stringified JSON
      const orderSpecifications = {
        orderType: 'binding',
        bindingType: bindingType,
        paperType: paperGsm === "normal" ? "Normal Paper" : `Bond Paper ${paperGsm} GSM`,
        bwPageCount: bwCount,
        colorPageCount: colorCount,
        copies: copies,
        colorOption: colorOption,
        coverColor: coverColor,
        coverPrintType: coverPrintType,
        specialInstructions: specifications,
        totalPrice: pricingInfo?.totalPrice || 0
      };
      
      formData.append('specifications', JSON.stringify(orderSpecifications));
      
      // Add timestamp
      formData.append('timestamp', now.toISOString());
      
      // Add each file
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });
      
      // Add payment proof if provided
      if (paymentProof) {
        formData.append('paymentProof', paymentProof);
      }
      
      // Send to the API
      fetch('/api/orders/email', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send order details');
        }
        return response.json();
      })
      .then(data => {
        toast.success(`Your binding order #${orderId} has been submitted! We'll contact you shortly.`);
        
        // Reset the form
        setFiles([]);
        setPricingInfo(null);
        setPaymentProof(null);
        setContactInfo({ email: "", phone: "" });
        setBwCount(0);
        setColorCount(0);
        setSpecifications("");
      })
      .catch(error => {
        console.error("Error sending order:", error);
        toast.error("Failed to send order. Please try again.");
      })
      .finally(() => {
        setIsProcessing(false);
      });
    } catch (err) {
      console.error("Error preparing order:", err);
      toast.error("Failed to prepare order. Please try again.");
      setIsProcessing(false);
    }
  };

  // Check if binding type is a hard binding option
  const isHardBinding = bindingType.startsWith('hard-');

  // Add click handler for the upload area
  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37] mb-4">Binding Order Service</h2>
          <p className="text-gray-600 text-lg">
            Professional binding solutions by Deep Computers
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37]">Upload Your Files</h3>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:bg-gray-50 transition-colors relative"
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {isLoadingFiles ? (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium mb-2">Drag and drop your files here</h4>
                      <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                      <p className="text-xs text-gray-400">Supported formats: PDF, DOC, DOCX</p>
                    </>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    onClick={e => e.stopPropagation()} // Prevent double triggers
                    accept=".pdf,.doc,.docx"
                    multiple
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Uploaded Files ({files.length})</h4>
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-[#D4AF37] mr-3" />
                            <div>
                              <p className="text-sm font-medium truncate" style={{ maxWidth: '200px' }}>
                                {file.name}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveFile(file.id)} 
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add More Files
                    </Button>
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
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold mb-6 text-[#D4AF37]">Order Summary</h3>
                
                {/* QR Code Section - Always visible */}
                <div className="bg-white p-3 border border-primary/30 rounded-md mb-4">
                  <p className="text-sm mb-2 text-center font-medium">Scan to pay</p>
                  <div className="flex justify-center">
                    <img 
                      src="/images/payment-qr.jpg" 
                      alt="PhonePe Payment QR" 
                      className="w-full max-w-[200px] mx-auto border border-gray-200 p-1 rounded"
                      style={{ display: 'block' }}
                    />
                  </div>
                  <p className="text-xs text-center text-primary font-medium mt-2">Pay using any UPI app</p>
                </div>
                
                {!pricingInfo ? (
                  <div className="text-center py-8">
                    <div className="binding-animation-container mx-auto mb-4 relative w-32 h-32">
                      <div className="book-pages absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-24">
                        <div className="book-cover absolute w-20 h-24 bg-[#D4AF37] rounded-r"></div>
                        <div className="book-page-1 absolute w-18 h-22 bg-white left-1 top-1 transform book-page-animation-1"></div>
                        <div className="book-page-2 absolute w-18 h-22 bg-white left-1 top-1 transform book-page-animation-2"></div>
                        <div className="book-page-3 absolute w-18 h-22 bg-white left-1 top-1 transform book-page-animation-3"></div>
                        <div className="book-spine absolute left-0 top-0 w-2 h-24 bg-[#915E3F]"></div>
                      </div>
                      <div className="binding-person absolute right-0 bottom-0 w-12 h-24">
                        <div className="person-head w-8 h-8 rounded-full bg-[#F9D5A7] mx-auto"></div>
                        <div className="person-body w-10 h-10 bg-[#3F88C5] mt-1 mx-auto rounded-t-md binding-person-animation"></div>
                        <div className="person-arm absolute w-8 h-2 bg-[#F9D5A7] right-2 top-12 transform origin-right binding-arm-animation"></div>
                      </div>
                      <div className="binding-tool absolute left-4 top-4 w-8 h-3 bg-[#915E3F] binding-tool-animation"></div>
                    </div>
                    <style jsx global>{`
                      @keyframes pageFlip1 {
                        0%, 20% { transform: rotateY(0deg); }
                        30%, 100% { transform: rotateY(-180deg); }
                      }
                      @keyframes pageFlip2 {
                        0%, 35% { transform: rotateY(0deg); }
                        45%, 100% { transform: rotateY(-180deg); }
                      }
                      @keyframes pageFlip3 {
                        0%, 50% { transform: rotateY(0deg); }
                        60%, 100% { transform: rotateY(-180deg); }
                      }
                      @keyframes bindingPersonMove {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                      }
                      @keyframes bindingArmMove {
                        0%, 100% { transform: rotate(0deg); }
                        50% { transform: rotate(-15deg); }
                      }
                      @keyframes bindingToolMove {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(15px) rotate(5deg); }
                      }
                      .book-page-animation-1 {
                        animation: pageFlip1 4s infinite;
                        transform-origin: left;
                      }
                      .book-page-animation-2 {
                        animation: pageFlip2 4s infinite;
                        transform-origin: left;
                      }
                      .book-page-animation-3 {
                        animation: pageFlip3 4s infinite;
                        transform-origin: left;
                      }
                      .binding-person-animation {
                        animation: bindingPersonMove 1.5s infinite;
                      }
                      .binding-arm-animation {
                        animation: bindingArmMove 1.5s infinite;
                      }
                      .binding-tool-animation {
                        animation: bindingToolMove 1.5s infinite;
                      }
                    `}</style>
                    <p className="text-gray-500">Upload files and set page counts to see pricing</p>
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
                          <span>Black & White Pages:</span>
                          <span>{pricingInfo.pageDetails.bwPages}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Color Pages:</span>
                          <span>{pricingInfo.pageDetails.colorPages}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Paper Quality:</span>
                          <span>{paperGsm} GSM</span>
                        </li>
                      </ul>
                      {specifications && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h5 className="font-medium text-sm mb-1">Special Instructions:</h5>
                          <p className="text-xs text-gray-600 whitespace-pre-line">{specifications}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Binding Details</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Binding Type:</span>
                          <span>{bindingType.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                        </li>
                        {isHardBinding && (
                          <>
                            <li className="flex justify-between">
                              <span>Cover Color:</span>
                              <span>{coverColor.charAt(0).toUpperCase() + coverColor.slice(1)}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Cover Print:</span>
                              <span>{coverPrintType === 'none' ? 'No Print' : 
                                     coverPrintType === 'simple' ? 'Simple Text' : 'Premium Design'}</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Pricing Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Printing ({pricingInfo.pageDetails.totalPages} pages):</span>
                          <span>₹{pricingInfo.printPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Binding ({copies} copies):</span>
                          <span>₹{pricingInfo.bindingPrice}</span>
                        </div>
                        {coverPrintType !== 'none' && (
                          <div className="flex justify-between">
                            <span>Cover Printing ({copies} copies):</span>
                            <span>₹{pricingInfo.coverPrice}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total:</span>
                          <span>₹{pricingInfo.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Payment Instructions</h4>
                      <div className="text-xs space-y-1 text-gray-500 mb-4">
                        <p>1. After payment, please take a screenshot of the payment confirmation.</p>
                        <p>2. Include your name and contact number with your order.</p>
                        <p>3. Once verified, your binding will be ready for pickup within 1-2 business days.</p>
                        <p>4. We'll notify you when your order is ready for pickup.</p>
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
                                <FileText className="h-5 w-5 text-[#D4AF37] mr-3" />
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
                      className={`w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-semibold ${
                        formErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={formErrors.length > 0}
                    >
                      Submit Binding Order
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

export default BindingOrderForm; 