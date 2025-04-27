import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        serviceType: body.serviceType,
        isAiService: body.isAiService,
        totalPages: body.totalPages,
        totalPrice: body.totalPrice,
        status: 'pending',
        contactEmail: body.contactInfo.email,
        contactPhone: body.contactInfo.phone,
        documents: {
          create: body.documents.map((doc: any) => ({
            filename: doc.filename,
            originalName: doc.originalName,
            size: doc.size,
            type: doc.type
          }))
        },
        paymentProof: {
          create: {
            filename: body.paymentProof.filename,
            originalName: body.paymentProof.originalName,
            size: body.paymentProof.size,
            type: body.paymentProof.type
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
} 