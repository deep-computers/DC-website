import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FileUpload from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

interface UploadedFile {
  url: string;
  file: File;
}

const SimpleFileUploadDemo = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileUpload = (fileUrl: string, file: File) => {
    setUploadedFile({ url: fileUrl, file });
  };
  
  const handleFileRemove = () => {
    setUploadedFile(null);
  };
  
  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Example of how you could use both approaches:
      // 1. You already have the Supabase URL from the FileUpload component
      console.log('File uploaded to Supabase at:', uploadedFile.url);
      
      // 2. Traditional form data approach (as in the example)
      const formData = new FormData();
      formData.append('myFile', uploadedFile.file, uploadedFile.file.name);
      
      // Simulating an API call (don't actually send this unless you have a backend endpoint)
      // Commented out to prevent unnecessary API calls
      /*
      const response = await axios.post('api/uploadfile', formData);
      console.log('Server response:', response.data);
      */
      
      toast.success('File submission completed successfully!');
      
      // Example form data that would be sent:
      console.log('Form data that would be sent:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-12 bg-white">
      <div className="container px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Simple File Upload Demo</h2>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Upload a File</h3>
            <p className="text-gray-600 mb-6">
              This component demonstrates a simple file upload with validation for file size and type.
              Files are automatically uploaded to Supabase storage.
            </p>
            
            <div className="mb-6">
              <FileUpload 
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                fileTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                maxSizeMB={5}
                label="Click to upload or drag and drop"
                showFileDetails={true}
                folder="demo-uploads"
              />
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!uploadedFile || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
            
            <div className="mt-6 text-sm text-gray-500">
              <h4 className="font-medium mb-2">How It Works:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select a file using the upload area above</li>
                <li>File is validated for size and type</li>
                <li>File is uploaded to Supabase storage</li>
                <li>Component provides the file URL for further processing</li>
                <li>FormData can be used to send additional data with the file reference</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleFileUploadDemo; 