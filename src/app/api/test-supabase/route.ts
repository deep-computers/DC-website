import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;
    
    // Test connection by listing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Supabase',
        details: bucketsError,
        config: {
          supabaseUrlExists: !!supabaseUrl,
          supabaseKeyExists: !!supabaseKey,
          // Don't include actual values for security reasons
        }
      }, { status: 500 });
    }
    
    // Check if uploads bucket exists
    const uploadsBucket = buckets?.find(bucket => bucket.name === 'uploads');
    
    if (!uploadsBucket) {
      return NextResponse.json({
        success: false,
        error: 'Uploads bucket not found',
        availableBuckets: buckets?.map(b => b.name) || [],
        message: 'You need to create an "uploads" bucket in Supabase Storage'
      }, { status: 404 });
    }
    
    // Test listing files in uploads bucket
    const { data: files, error: filesError } = await supabase.storage.from('uploads').list();
    
    if (filesError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to list files in uploads bucket',
        details: filesError,
        message: 'This may be a permissions issue. Check bucket policies.'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      buckets: buckets?.map(b => b.name) || [],
      uploadsBucketExists: !!uploadsBucket,
      fileCount: files?.length || 0,
      recentFiles: files?.slice(0, 5).map(f => ({
        name: f.name,
        size: f.metadata?.size || 'unknown',
        created: f.created_at
      })) || []
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error testing Supabase connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 