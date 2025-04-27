import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'deepcomputer9200@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'no-reply@dcprintingpress.com';

export async function POST(request: NextRequest) {
  try {
    // Create a directory for storing uploaded files if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.log('Directory already exists or could not be created');
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Extract order information
    const orderType = formData.get('orderType') as string;
    const orderId = formData.get('orderId') as string;
    const contactName = formData.get('contactName') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const contactAddress = formData.get('contactAddress') as string || '';
    const contactNotes = formData.get('contactNotes') as string || '';
    const specifications = formData.get('specifications') as string || '{}';
    const timestamp = formData.get('timestamp') as string;
    
    // Create an object to store all file paths
    const attachmentPaths: string[] = [];
    const uploadedFiles: { filename: string; originalName: string }[] = [];

    // Process the uploaded files
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof Blob) {
        const file = value as File;
        const uniqueFilename = `${orderId}-${key}-${file.name}`;
        const filePath = path.join(uploadDir, uniqueFilename);
        
        // Convert file to buffer and save
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);
        
        // Add to attachments and uploaded files
        attachmentPaths.push(filePath);
        uploadedFiles.push({
          filename: uniqueFilename,
          originalName: file.name
        });
      }
    }
    
    // Process payment proof if provided
    let paymentProofPath = '';
    const paymentProof = formData.get('paymentProof');
    if (paymentProof && paymentProof instanceof Blob) {
      const file = paymentProof as File;
      const uniqueFilename = `${orderId}-payment-proof-${file.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Convert file to buffer and save
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      paymentProofPath = filePath;
    }

    // Format the order information for the email
    const orderTypeMap: Record<string, string> = {
      'print': 'Printing',
      'binding': 'Binding',
      'plagiarism': 'Plagiarism Check',
      'ai': 'AI Plagiarism Service'
    };
    
    // Parse specifications JSON
    const specsObj = JSON.parse(specifications);
    
    // Create the email content
    const emailSubject = `New ${orderTypeMap[orderType] || 'Order'} - ${orderId}`;
    
    let emailContent = `
      <h2>New Order Received: ${orderId}</h2>
      <p><strong>Order Type:</strong> ${orderTypeMap[orderType] || orderType}</p>
      <p><strong>Date/Time:</strong> ${timestamp}</p>
      
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${contactEmail}</p>
      <p><strong>Phone:</strong> ${contactPhone}</p>
    `;
    
    if (contactAddress) {
      emailContent += `<p><strong>Address:</strong> ${contactAddress}</p>`;
    }
    
    if (contactNotes) {
      emailContent += `<p><strong>Notes:</strong> ${contactNotes}</p>`;
    }
    
    // Add order specifications
    emailContent += `<h3>Order Specifications</h3><ul>`;
    for (const [key, value] of Object.entries(specsObj)) {
      if (key !== 'orderType' && value !== null && value !== undefined && value !== '') {
        // Format key for display
        const displayKey = key
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
        
        emailContent += `<li><strong>${displayKey}:</strong> ${value}</li>`;
      }
    }
    emailContent += `</ul>`;
    
    // Add information about uploaded files
    if (uploadedFiles.length > 0) {
      emailContent += `<h3>Uploaded Files</h3><ul>`;
      uploadedFiles.forEach(file => {
        emailContent += `<li>${file.originalName}</li>`;
      });
      emailContent += `</ul>`;
    }
    
    // Prepare email attachments
    const attachments = [
      ...attachmentPaths.map(path => ({
        path,
        filename: path.split('/').pop() || 'file'
      }))
    ];
    
    if (paymentProofPath) {
      attachments.push({
        path: paymentProofPath,
        filename: paymentProofPath.split('/').pop() || 'payment-proof'
      });
      emailContent += `<p><strong>Payment Proof:</strong> Attached</p>`;
    }
    
    // Set up the mail transporter
    const transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    
    // Send the email
    await transporter.sendMail({
      from: `"DC Printing Press" <${SENDER_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailContent,
      attachments
    });
    
    // Also send a confirmation email to the customer
    const customerEmailContent = `
      <h2>Thank you for your order!</h2>
      <p>Dear ${contactName},</p>
      <p>We have received your ${orderTypeMap[orderType] || 'order'} (Order ID: ${orderId}).</p>
      <p>Our team will review your order and contact you soon.</p>
      
      <h3>Order Summary</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Order Type:</strong> ${orderTypeMap[orderType] || orderType}</p>
      <p><strong>Date/Time:</strong> ${timestamp}</p>
      
      <p>If you have any questions about your order, please contact us at:</p>
      <p>Email: support@dcprintingpress.com</p>
      <p>Phone: +91-9311244099</p>
      
      <p>Thank you for choosing DC Printing Press.</p>
    `;
    
    await transporter.sendMail({
      from: `"DC Printing Press" <${SENDER_EMAIL}>`,
      to: contactEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: customerEmailContent
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Order email sent successfully',
      orderId
    });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send order email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 