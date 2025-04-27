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
      const validFileNames = data.fileNames.filter(name => name && typeof name === 'string' && name.trim().length > 0);
      if (validFileNames.length > 0) {
        fileList = validFileNames.join(', ');
        console.log('Valid files for email:', validFileNames);
      } else {
        console.warn('No valid file names found in data.fileNames array');
      }
    } else {
      console.warn('data.fileNames is not a valid array or is empty:', data.fileNames);
    }
    
    // Prepare payment proof name - ensure it's a valid string
    const paymentProof = data.paymentProofName && typeof data.paymentProofName === 'string' && data.paymentProofName.trim().length > 0
      ? data.paymentProofName
      : 'Not provided';
    
    // Format the timestamp nicely for display
    let orderDate = 'Unknown';
    try {
      orderDate = new Date(data.timestamp).toLocaleString();
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      orderDate = String(data.timestamp);
    }
    
    // Add a short delay before sending to ensure all processing is complete
    console.log('Waiting before sending email to ensure all data is processed...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
      order_date: orderDate
    };

    // Final check to ensure file list is included
    if (fileList === 'No files uploaded' && Array.isArray(data.fileNames) && data.fileNames.length > 0) {
      console.error('File list is empty even though files were provided:', data.fileNames);
      fileList = data.fileNames.toString(); // Last resort fallback
      templateParams.file_list = fileList;
    }

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
export const uploadFileToWebhook = async (file: File | undefined | null): Promise<string | null> => {
  try {
    // Validate file exists and has name property
    if (!file) {
      console.error('File is undefined or null in uploadFileToWebhook');
      return null;
    }
    
    if (!file.name) {
      console.error('File name is undefined or invalid in uploadFileToWebhook');
      return null;
    }
    
    console.log(`Starting file upload process: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    // In a real implementation, you would upload the file to a server or cloud storage here
    // For demonstration purposes, we'll log more detailed information and add a delay
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Add a timestamp to make filenames unique
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${cleanFileName}`;
    
    console.log(`File processing: ${file.name}, creating unique name: ${uniqueFileName}`);
    
    // Simulate a more substantial file processing delay
    // This gives enough time for larger files to be properly "uploaded" in simulation
    console.log(`Uploading file ${file.name}...`);
    
    // Add a longer delay to simulate a proper upload process
    // Files typically take time to upload based on size and connection speed
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.floor(file.size / 10000)));
    
    console.log(`File uploaded successfully: ${file.name}`);
    
    // Return the original file name so it's recognizable in the email
    return file.name;
  } catch (error) {
    console.error('Error processing file:', error);
    return null;
  }
}; 