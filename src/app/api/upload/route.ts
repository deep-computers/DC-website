import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contactEmail = formData.get('contactEmail') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const orderType = formData.get('orderType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get current timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create a unique identifier from contact info
    const contactIdentifier = contactEmail 
      ? contactEmail.split('@')[0] 
      : contactPhone.replace(/\D/g, '');
    
    // Generate unique filename with contact info and timestamp
    const uniqueFilename = `${orderType}-${contactIdentifier}-${timestamp}-${uuidv4()}-${file.name}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return file information
    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: timestamp,
      contactIdentifier
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 