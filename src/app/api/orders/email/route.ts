import { NextRequest, NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'deepcomputer9200@gmail.com'; // Default email 
const SMTP_PASS = process.env.SMTP_PASS || 'kqbw yyci qnsl pqku'; // Default app password
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'deepcomputer9200@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'no-reply@dcprintingpress.com';

export async function POST(request: NextRequest) {
  try {
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
    
    let fileNames: string[] = [];
    let paymentProofName = '';
    
    // In GitHub Pages or environments without filesystem access, we can't save files
    // but we can extract file names for the email content
    try {
      // Create a directory for storing uploaded files if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.log('Directory already exists or could not be created');
      }
      
      // Process the uploaded files
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file-') && value instanceof Blob) {
          const file = value as File;
          const uniqueFilename = `${orderId}-${key}-${file.name}`;
          fileNames.push(file.name);
          
          try {
            const filePath = path.join(uploadDir, uniqueFilename);
            // Convert file to buffer and save
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(filePath, buffer);
          } catch (error) {
            console.error('Error saving file:', error);
            // Continue without failing the whole request
          }
        }
      }
      
      // Process payment proof if provided
      const paymentProof = formData.get('paymentProof');
      if (paymentProof && paymentProof instanceof Blob) {
        const file = paymentProof as File;
        paymentProofName = file.name;
        
        try {
          const uniqueFilename = `${orderId}-payment-proof-${file.name}`;
          const filePath = path.join(uploadDir, uniqueFilename);
          
          // Convert file to buffer and save
          const buffer = Buffer.from(await file.arrayBuffer());
          await writeFile(filePath, buffer);
        } catch (error) {
          console.error('Error saving payment proof:', error);
          // Continue without failing the whole request
        }
      }
    } catch (error) {
      console.warn('File system operations failed, continuing with email only:', error);
      
      // If we can't write files, still capture file names for the email
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('file-') && value instanceof Blob) {
          const file = value as File;
          fileNames.push(file.name);
        }
      }
      
      // Process payment proof name
      const paymentProof = formData.get('paymentProof');
      if (paymentProof && paymentProof instanceof Blob) {
        paymentProofName = (paymentProof as File).name;
      }
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
    if (fileNames.length > 0) {
      emailContent += `<h3>Uploaded Files</h3><ul>`;
      fileNames.forEach(fileName => {
        emailContent += `<li>${fileName}</li>`;
      });
      emailContent += `</ul>`;
      
      // Add note about file access
      emailContent += `<p><em>Note: Due to hosting limitations, files may not be attached. Please ask the customer to share them via WhatsApp or email if needed.</em></p>`;
    }
    
    if (paymentProofName) {
      emailContent += `<p><strong>Payment Proof:</strong> ${paymentProofName}</p>`;
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
    
    // Send the email to the business
    await transporter.sendMail({
      from: `"DC Printing Press" <${SENDER_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailContent,
      // Note: We're not attaching files since GitHub Pages doesn't support file storage
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
      <p>Email: deepcomputer9200@gmail.com</p>
      <p>WhatsApp: +91-9311244099</p>
      
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