import { ContactInfo } from "./OrderContactForm";
import { FileWithPreview } from "./OrderFileUpload";

export interface OrderSpecifications {
  [key: string]: any;
  orderType: 'print' | 'binding' | 'plagiarism' | 'ai';
}

export interface OrderDetails {
  orderId: string;
  contactInfo: ContactInfo;
  specifications: OrderSpecifications;
  files: FileWithPreview[];
  paymentProof?: FileWithPreview;
  timestamp: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  orderId?: string;
  error?: string;
}

/**
 * Prepares and sends an email with detailed order information
 */
export const sendOrderEmail = async (orderDetails: OrderDetails): Promise<EmailResponse> => {
  try {
    // Convert files to FormData for upload
    const formData = new FormData();
    
    // Add order type
    formData.append('orderType', orderDetails.specifications.orderType);
    
    // Add contact information
    formData.append('contactName', orderDetails.contactInfo.name);
    formData.append('contactEmail', orderDetails.contactInfo.email);
    formData.append('contactPhone', orderDetails.contactInfo.phone);
    
    if (orderDetails.contactInfo.address) {
      formData.append('contactAddress', orderDetails.contactInfo.address);
    }
    
    if (orderDetails.contactInfo.notes) {
      formData.append('contactNotes', orderDetails.contactInfo.notes);
    }
    
    // Add order specifications (stringified JSON)
    formData.append('specifications', JSON.stringify(orderDetails.specifications));
    
    // Add order timestamp
    formData.append('timestamp', orderDetails.timestamp);
    
    // Add order ID
    formData.append('orderId', orderDetails.orderId);
    
    // Upload each document file
    orderDetails.files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });
    
    // Upload payment proof if provided
    if (orderDetails.paymentProof) {
      formData.append('paymentProof', orderDetails.paymentProof);
    }
    
    // Send to the API
    const response = await fetch('/api/orders/email', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send order details');
    }
    
    const data = await response.json();
    return {
      success: true,
      message: 'Order details sent successfully',
      orderId: data.orderId
    };
  } catch (error) {
    console.error('Error sending order email:', error);
    return {
      success: false,
      message: 'Failed to send order details',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Generates a unique order ID with a prefix based on order type
 */
export const generateOrderId = (orderType: string): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Prefix based on order type
  let prefix = '';
  switch (orderType) {
    case 'print':
      prefix = 'DC-P';
      break;
    case 'binding':
      prefix = 'DC-B';
      break;
    case 'plagiarism':
      prefix = 'DC-PL';
      break;
    case 'ai':
      prefix = 'DC-AI';
      break;
    default:
      prefix = 'DC';
  }
  
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format order specifications for display in confirmation and email
 */
export const formatOrderSpecifications = (specs: OrderSpecifications): string => {
  // Skip these fields when formatting
  const skipFields = ['orderType'];
  
  let formattedSpecs = '';
  
  Object.entries(specs).forEach(([key, value]) => {
    if (!skipFields.includes(key) && value !== undefined && value !== null && value !== '') {
      // Format keys by capitalizing and adding spaces
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      
      // Format values
      let formattedValue = value;
      if (typeof value === 'boolean') {
        formattedValue = value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        formattedValue = value.join(', ');
      }
      
      formattedSpecs += `${formattedKey}: ${formattedValue}\n`;
    }
  });
  
  return formattedSpecs;
}; 