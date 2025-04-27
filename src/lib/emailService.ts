// Direct REST API implementation for EmailJS
// This bypasses any SDK-related issues

// EmailJS configuration
// You'll need to create an account at https://www.emailjs.com/ (they have a free tier)
// Then create a service (e.g. Gmail, Outlook) and an email template
const SERVICE_ID = 'service_kyceddb';
const ORDER_TEMPLATE_ID = 'template_2p1ejse'; // Update with actual template ID 
const CONFIRMATION_TEMPLATE_ID = 'template_2p1ejse'; // Using same template for now
const PUBLIC_KEY = 'ZkfP2kB43l2L-wA_4'; // Updated public key

// The latest EmailJS API endpoint
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

    console.log('Email template params prepared:', templateParams);

    // Send the order notification to the business using direct REST API
    console.log('Sending business notification email via REST API...');
    try {
      // Prepare request payload for business notification
      const payload = {
        service_id: SERVICE_ID,
        template_id: ORDER_TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams
      };
      
      console.log('REST API payload:', payload);
      
      // Make the REST API call
      const response = await fetch(EMAILJS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(payload)
      });
      
      // Check response
      if (response.ok) {
        console.log('Business notification email sent successfully:', await response.text());
      } else {
        const errorText = await response.text();
        console.error(`Failed to send business email. Status: ${response.status}`, errorText);
        throw new Error(`Email sending failed with status ${response.status}: ${errorText}`);
      }
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
      
      console.log('Sending customer confirmation email via REST API...');
      
      // Prepare request payload for customer confirmation
      const confirmPayload = {
        service_id: SERVICE_ID,
        template_id: CONFIRMATION_TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: confirmationParams
      };
      
      // Make the REST API call
      const confirmResponse = await fetch(EMAILJS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(confirmPayload)
      });
      
      // Check response
      if (confirmResponse.ok) {
        console.log('Customer confirmation email sent successfully:', await confirmResponse.text());
      } else {
        const errorText = await confirmResponse.text();
        console.warn(`Failed to send confirmation email. Status: ${confirmResponse.status}`, errorText);
      }
      
      return true;
    } catch (err) {
      // If confirmation email fails, just log it - the main notification is what matters
      console.error('Failed to send confirmation email:', err);
      return true; // Still return true if only the confirmation fails
    }
  } catch (error) {
    console.error('Error in email sending process:', error);
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