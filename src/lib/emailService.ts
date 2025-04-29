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
    
    // Prepare file links list if available in orderDetails
    let fileLinks = '';
    if (data.orderDetails && data.orderDetails.fileLinks && Array.isArray(data.orderDetails.fileLinks)) {
      // Convert array of links to a formatted string with one link per line
      fileLinks = data.orderDetails.fileLinks.map((link: string, index: number) => 
        `${index + 1}. ${data.fileNames[index] || 'File'}: ${link}`
      ).join('\n');
      
      // Add file links to orderDetails for storage/reference
      data.orderDetails.fileList = fileLinks;
    }
    
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
    
    // Add payment proof URL if it exists in orderDetails
    const paymentProofUrl = data.orderDetails?.paymentProof || 'Not provided';
    
    // Prepare the email template parameters
    const templateParams = {
      order_id: data.orderId,
      order_type: orderTypeLabel,
      customer_name: data.contactInfo.name || (data.contactInfo.email ? data.contactInfo.email.split('@')[0] : 'Customer'),
      customer_email: data.contactInfo.email || 'No email provided',
      customer_phone: data.contactInfo.phone || 'No phone provided',
      order_details: JSON.stringify(data.orderDetails, null, 2),
      file_list: fileList,
      file_links: fileLinks,
      payment_proof: paymentProofUrl,
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