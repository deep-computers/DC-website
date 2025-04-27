import emailjs from '@emailjs/browser';

// EmailJS configuration
// You'll need to create an account at https://www.emailjs.com/ (they have a free tier)
// Then create a service (e.g. Gmail, Outlook) and an email template
const EMAILJS_SERVICE_ID = 'dc_printing_service'; // Replace with your service ID
const EMAILJS_ORDER_TEMPLATE_ID = 'order_template'; // General template for all orders
const EMAILJS_CONFIRMATION_TEMPLATE_ID = 'confirmation_template'; // For customer confirmations
const EMAILJS_USER_ID = 'L4CbIgz6e-N-NnwFl'; // Replace with your user ID from EmailJS dashboard

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

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

    // Send the order notification to the business
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_TEMPLATE_ID,
      templateParams
    );
    
    // Also send a confirmation email to the customer if we have a confirmation template
    try {
      // Simplified parameters for customer confirmation
      const confirmationParams = {
        order_id: data.orderId,
        order_type: orderTypeLabel,
        customer_name: data.contactInfo.name || data.contactInfo.email.split('@')[0],
        order_date: new Date(data.timestamp).toLocaleString(),
        total_price: data.orderDetails.totalPrice || 'Not specified',
        contact_email: 'deepcomputer9200@gmail.com',
        contact_phone: '+91-9311244099'
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONFIRMATION_TEMPLATE_ID,
        confirmationParams,
        EMAILJS_USER_ID
      );
    } catch (err) {
      // If confirmation email fails, just log it - the main notification is what matters
      console.warn('Failed to send confirmation email:', err);
    }

    return response.status === 200;
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
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Using file.io as an example (note: files on file.io expire)
    // In production, use a more permanent service
    const response = await fetch('https://file.io/?expires=1w', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    // Return the download link if successful
    if (data.success) {
      return data.link;
    }
    return null;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}; 