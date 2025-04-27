import emailjs from '@emailjs/browser';

// EmailJS configuration
// You'll need to create an account at https://www.emailjs.com/ (they have a free tier)
// Then create a service (e.g. Gmail, Outlook) and an email template
const SERVICE_ID = 'service_dtsv62p';
const ORDER_TEMPLATE_ID = 'template_zihqclr'; // Change to the actual template ID
const CONFIRMATION_TEMPLATE_ID = 'template_bjsjyck'; // Change to the actual template ID
const PUBLIC_KEY = 'L4CbIgz6e-N-NnwFl';

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
 * Send order notification email
 */
export const sendOrderEmail = async (data: OrderData): Promise<boolean> => {
  try {
    console.log('Sending email for order:', data.orderId);
    
    // Format the order type nicely for the email
    const orderTypeLabels = {
      'print': 'Printing',
      'binding': 'Binding',
      'plagiarism': 'Plagiarism Check',
      'ai': 'AI Plagiarism Service'
    };
    
    const orderTypeLabel = orderTypeLabels[data.orderType as keyof typeof orderTypeLabels] || data.orderType;
    
    // Prepare the email template parameters
    const templateParams = {
      order_id: data.orderId,
      order_type: orderTypeLabel,
      customer_name: data.contactInfo.name || data.contactInfo.email.split('@')[0],
      customer_email: data.contactInfo.email,
      customer_phone: data.contactInfo.phone,
      order_details: JSON.stringify(data.orderDetails, null, 2),
      file_list: data.fileNames.join(', '),
      payment_proof: data.paymentProofName || 'Not provided',
      order_date: new Date(data.timestamp).toLocaleString(),
      order_summary: JSON.stringify(data.orderDetails, null, 2)
    };

    console.log('Email template params:', templateParams);

    // Send the order notification to the business using the latest pattern
    console.log('Sending business notification email...');
    try {
      const response = await emailjs.send(
        SERVICE_ID,
        ORDER_TEMPLATE_ID,
        templateParams,
        {
          publicKey: PUBLIC_KEY,
        }
      );
      console.log('Business notification email sent successfully:', response);
    } catch (err) {
      console.error('Failed to send business notification email:', err);
      throw err;
    }
    
    // Also send a confirmation email to the customer
    try {
      // Simplified parameters for customer confirmation
      const confirmationParams = {
        order_id: data.orderId,
        order_type: orderTypeLabel,
        customer_name: data.contactInfo.name || data.contactInfo.email.split('@')[0],
        customer_email: data.contactInfo.email,
        order_date: new Date(data.timestamp).toLocaleString(),
        total_price: data.orderDetails.totalPrice || 'Not specified',
        contact_email: 'deepcomputer9200@gmail.com',
        contact_phone: '+91-9311244099'
      };
      
      console.log('Sending customer confirmation email...');
      const confirmResponse = await emailjs.send(
        SERVICE_ID,
        CONFIRMATION_TEMPLATE_ID,
        confirmationParams,
        {
          publicKey: PUBLIC_KEY,
        }
      );
      console.log('Customer confirmation email sent successfully:', confirmResponse);
      return true;
    } catch (err) {
      // If confirmation email fails, just log it - the main notification is what matters
      console.error('Failed to send confirmation email:', err);
      return true; // Still return true if only the confirmation fails
    }
  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    return false;
  }
};

/**
 * Convert file to base64 for attaching to emails
 * Note: This has limitations based on file size
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
 * Send file to a webhook for storage (simpler alternative to S3)
 * This is using a service like file.io or similar
 */
export const uploadFileToWebhook = async (file: File): Promise<string | null> => {
  try {
    if (!file) {
      console.log('No file provided to upload');
      return null;
    }
    
    // Just return a dummy link for now
    console.log('Simulating file upload for:', file.name);
    return `https://storage.example.com/files/${file.name}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}; 