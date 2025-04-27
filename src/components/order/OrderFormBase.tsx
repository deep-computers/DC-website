import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Upload, FileCheck, CheckCircle, AlertCircle, User, FileText } from "lucide-react";
import { toast } from "sonner";

import OrderFileUpload, { FileWithPreview } from "./OrderFileUpload";
import OrderContactForm, { ContactInfo } from "./OrderContactForm";
import { OrderSpecifications, OrderDetails, sendOrderEmail, generateOrderId } from "./OrderEmailService";

interface OrderFormBaseProps {
  orderType: 'print' | 'binding' | 'plagiarism' | 'ai';
  children: React.ReactNode;
  title: string;
  description: string;
  specificationsSection?: React.ReactNode;
  showPaymentSection?: boolean;
  onOrderSubmitted?: (orderId: string) => void;
}

const OrderFormBase = ({
  orderType,
  children,
  title,
  description,
  specificationsSection,
  showPaymentSection = true,
  onOrderSubmitted,
}: OrderFormBaseProps) => {
  // State for file uploads
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [paymentProof, setPaymentProof] = useState<FileWithPreview | null>(null);
  
  // Contact information
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  });

  // Order state
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [specifications, setSpecifications] = useState<OrderSpecifications>({
    orderType: orderType,
  });

  // Error tracking
  const [errors, setErrors] = useState<Record<string, boolean>>({
    files: false,
    contact: false,
    payment: false,
  });

  // Update specifications from child components
  const updateSpecifications = (newSpecs: Partial<OrderSpecifications>) => {
    setSpecifications(prev => ({ ...prev, ...newSpecs }));
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Check if the current tab is completed
  const isTabComplete = (tab: string): boolean => {
    switch (tab) {
      case "upload":
        return files.length > 0;
      case "specifications":
        // This would need to be customized based on your requirements
        return true;
      case "contact":
        return Boolean(contactInfo.name && contactInfo.email && contactInfo.phone);
      case "payment":
        return showPaymentSection ? Boolean(paymentProof) : true;
      default:
        return false;
    }
  };

  // Go to the next tab
  const goToNextTab = () => {
    const tabs = ["upload", "specifications", "contact", "payment", "review"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      // Validate current tab before proceeding
      if (validateCurrentTab()) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  };

  // Validate the current tab
  const validateCurrentTab = (): boolean => {
    switch (activeTab) {
      case "upload":
        if (files.length === 0) {
          toast.error("Please upload at least one file");
          setErrors(prev => ({ ...prev, files: true }));
          return false;
        }
        setErrors(prev => ({ ...prev, files: false }));
        return true;
        
      case "specifications":
        // This would depend on the specific requirements
        return true;
        
      case "contact":
        if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
          toast.error("Please complete all required contact information");
          setErrors(prev => ({ ...prev, contact: true }));
          return false;
        }
        setErrors(prev => ({ ...prev, contact: false }));
        return true;
        
      case "payment":
        if (showPaymentSection && !paymentProof) {
          toast.error("Please upload payment proof");
          setErrors(prev => ({ ...prev, payment: true }));
          return false;
        }
        setErrors(prev => ({ ...prev, payment: false }));
        return true;
        
      default:
        return true;
    }
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!validateCurrentTab()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate order ID if not already present
      const newOrderId = orderId || generateOrderId(orderType);
      setOrderId(newOrderId);
      
      // Create timestamp
      const now = new Date();
      const timestamp = now.toISOString();
      
      // Prepare order details
      const orderDetails: OrderDetails = {
        orderId: newOrderId,
        contactInfo,
        specifications,
        files,
        paymentProof: paymentProof || undefined,
        timestamp,
      };
      
      // Send order email
      const response = await sendOrderEmail(orderDetails);
      
      if (response.success) {
        toast.success("Order submitted successfully!");
        setOrderComplete(true);
        
        // Callback if provided
        if (onOrderSubmitted) {
          onOrderSubmitted(newOrderId);
        }
      } else {
        throw new Error(response.error || "Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear files on component unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      if (paymentProof?.preview) {
        URL.revokeObjectURL(paymentProof.preview);
      }
    };
  }, [files, paymentProof]);

  // Order success screen
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Order Submitted Successfully!</h2>
              <p className="text-green-600 mb-4">Your order ID is: <span className="font-bold">{orderId}</span></p>
              <p className="text-gray-600 mb-6">We have sent a confirmation email to {contactInfo.email}</p>
              
              <div className="bg-white p-4 rounded-md border border-green-200 w-full max-w-md mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
                <div className="text-sm text-gray-600 space-y-1 text-left">
                  <p><span className="font-medium">Order ID:</span> {orderId}</p>
                  <p><span className="font-medium">Service:</span> {orderType.charAt(0).toUpperCase() + orderType.slice(1)}</p>
                  <p><span className="font-medium">Files:</span> {files.length} file(s) uploaded</p>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm">
                Our team will process your order and contact you soon. If you have any questions, please contact us.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
          <p className="text-gray-500">{description}</p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="upload" className="relative">
                <Upload className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Upload</span>
                {isTabComplete("upload") && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              
              <TabsTrigger value="specifications" className="relative">
                <FileText className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Details</span>
                {isTabComplete("specifications") && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              
              <TabsTrigger value="contact" className="relative">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Contact</span>
                {isTabComplete("contact") && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              
              <TabsTrigger value="payment" className="relative">
                <FileCheck className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Payment</span>
                {isTabComplete("payment") && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
              
              <TabsTrigger value="review" className="relative">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <OrderFileUpload
                files={files}
                setFiles={setFiles}
                label="Upload Your Documents"
                helpText="Upload PDF, Word, or image files to print/bind/check"
              />
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={goToNextTab} 
                  disabled={!isTabComplete("upload")}
                  className="bg-primary hover:bg-primary-600"
                >
                  Continue to Specifications
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              {specificationsSection || children}
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={goToNextTab} 
                  disabled={!isTabComplete("specifications")}
                  className="bg-primary hover:bg-primary-600"
                >
                  Continue to Contact Info
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <OrderContactForm 
                contactInfo={contactInfo}
                setContactInfo={setContactInfo}
              />
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={goToNextTab} 
                  disabled={!isTabComplete("contact")}
                  className="bg-primary hover:bg-primary-600"
                >
                  Continue to Payment
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              {showPaymentSection ? (
                <OrderFileUpload
                  files={paymentProof ? [paymentProof] : []}
                  setFiles={(newFiles) => {
                    // Just use the first file if multiple are uploaded
                    if (newFiles.length > 0) {
                      // Clear any previous payment proof
                      if (paymentProof?.preview) {
                        URL.revokeObjectURL(paymentProof.preview);
                      }
                      setPaymentProof(newFiles[0]);
                    } else {
                      setPaymentProof(null);
                    }
                  }}
                  maxFiles={1}
                  label="Upload Payment Proof"
                  helpText="Upload screenshot or image of your payment"
                  allowedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
                />
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-500">No payment required. Proceed to review your order.</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={goToNextTab} 
                  disabled={!isTabComplete("payment")}
                  className="bg-primary hover:bg-primary-600"
                >
                  Continue to Review
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-6">
              <div className="rounded-md border border-gray-200 p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Uploaded Files</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span>
                      <span className="ml-2 text-gray-700">{contactInfo.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Phone:</span>
                      <span className="ml-2 text-gray-700">{contactInfo.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-700">{contactInfo.email}</span>
                    </div>
                    {contactInfo.address && (
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-500">Address:</span>
                        <span className="ml-2 text-gray-700">{contactInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Specifications</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(specifications).map(([key, value]) => {
                      if (key === 'orderType') return null;
                      if (value === undefined || value === null || value === '') return null;
                      
                      // Format key for display
                      const displayKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
                      
                      return (
                        <div key={key}>
                          <span className="font-medium text-gray-500">{displayKey}:</span>
                          <span className="ml-2 text-gray-700">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                             Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {showPaymentSection && paymentProof && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Proof</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{paymentProof.name}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("upload")}
                >
                  Edit Order
                </Button>
                
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderFormBase; 