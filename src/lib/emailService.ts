// Simplified direct API implementation for EmailJS

// EmailJS configuration (confirmed by user)
const SERVICE_ID = 'service_kyceddb';
const ORDER_TEMPLATE_ID = 'order_template';
const CONFIRMATION_TEMPLATE_ID = 'confirmation_template';
const PUBLIC_KEY = 'ImIJIUQhlhqWByJGZ';

// API URL
const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

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

/**
 * Send order notification email using direct REST API call
 */
export const sendOrderEmail = async (data: OrderData): Promise<boolean> => {
  try {
    console.log('Preparing to send email for order:', data.orderId);
    console.log('File names received:', data.fileNames);
    console.log('Payment proof received:', data.paymentProofName);
    
    // Format the order type nicely for the email
    const orderTypeLabels = {
      'print': 'Printing',
      'binding': 'Binding',
      'plagiarism': 'Plagiarism Check',
      'ai': 'AI Plagiarism Service'
    };
    
    const orderTypeLabel = orderTypeLabels[data.orderType as keyof typeof orderTypeLabels] || data.orderType;
    
    // Prepare file names string - ensure we're checking for valid array and valid elements
    let fileList = 'No files uploaded';
    if (Array.isArray(data.fileNames) && data.fileNames.length > 0) {
      // Filter out any undefined or empty values
      const validFileNames = data.fileNames.filter(name => name && name.trim().length > 0);
      if (validFileNames.length > 0) {
        fileList = validFileNames.join(', ');
      }
    }
    
    // Prepare payment proof name - ensure it's a valid string
    const paymentProof = data.paymentProofName && typeof data.paymentProofName === 'string' && data.paymentProofName.trim().length > 0
      ? data.paymentProofName
      : 'Not provided';
    
    // Prepare the email template parameters
    const templateParams = {
      order_id: data.orderId,
      order_type: orderTypeLabel,
      customer_name: data.contactInfo.name || (data.contactInfo.email ? data.contactInfo.email.split('@')[0] : 'Customer'),
      customer_email: data.contactInfo.email || 'No email provided',
      customer_phone: data.contactInfo.phone || 'No phone provided',
      order_details: JSON.stringify(data.orderDetails, null, 2),
      file_list: fileList,
      payment_proof: paymentProof,
      order_date: new Date(data.timestamp).toLocaleString()
    };

    console.log('Sending email with parameters:', templateParams);
    
    // Prepare the request payload
    const payload = JSON.stringify({
      service_id: SERVICE_ID,
      template_id: ORDER_TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: templateParams
    });
    
    // Make the REST API call
    const response = await fetch(EMAILJS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });
    
    const responseText = await response.text();
    
    if (response.ok) {
      console.log('Email sent successfully:', responseText);
      return true;
    } else {
      console.error(`Failed to send email. Status: ${response.status}`, responseText);
      return false;
    }
  } catch (error) {
    console.error('Error in email sending process:', error);
    return false;
  }
};

/**
 * Convert file to base64 for attaching to emails
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Process file upload and return the filename
 * This is a simplified version that just returns the file name
 * In a production environment, you'd upload to a server/cloud storage
 */
export const uploadFileToWebhook = async (file: File): Promise<string | null> => {
  try {
    if (!file) {
      console.log('No file provided to upload');
      return null;
    }
    
    console.log(`Processing file: ${file.name}`);
    
    // Since we don't have a real file storage service,
    // just return the filename so it can be included in the email
    return file.name;
  } catch (error) {
    console.error('Error processing file:', error);
    return null;
  }
}; 