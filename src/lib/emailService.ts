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
    
    // Format the order type nicely for the email
    const orderTypeLabels = {
      'print': 'Printing',
      'binding': 'Binding',
      'plagiarism': 'Plagiarism Check',
      'ai': 'AI Plagiarism Service'
    };
    
    const orderTypeLabel = orderTypeLabels[data.orderType as keyof typeof orderTypeLabels] || data.orderType;
    
    // Prepare the email template parameters - simplifying to essential fields
    const templateParams = {
      order_id: data.orderId,
      order_type: orderTypeLabel,
      customer_name: data.contactInfo.name || data.contactInfo.email.split('@')[0] || 'Customer',
      customer_email: data.contactInfo.email || 'noemail@example.com',
      customer_phone: data.contactInfo.phone || 'No phone provided',
      order_summary: JSON.stringify(data.orderDetails, null, 2),
      order_date: new Date(data.timestamp).toLocaleString()
    };

    console.log('Attempting to send order notification email');
    
    // Prepare a basic request payload
    const payload = JSON.stringify({
      service_id: SERVICE_ID,
      template_id: ORDER_TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: templateParams
    });
    
    console.log('Sending with payload:', payload);
    
    // Make a simple fetch request
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Simulate file upload
 */
export const uploadFileToWebhook = async (file: File): Promise<string | null> => {
  try {
    if (!file) {
      console.log('No file provided to upload');
      return null;
    }
    
    console.log('Simulating file upload for:', file.name);
    return `https://storage.example.com/files/${file.name}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}; 