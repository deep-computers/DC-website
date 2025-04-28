import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadFileToSupabase } from '@/lib/emailService';
import { FileText, Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (fileUrl: string, file: File) => void;
  onFileRemove?: () => void;
  fileTypes?: string;
  maxSizeMB?: number;
  label?: string;
  showFileDetails?: boolean;
  folder?: string;
  orderId?: string;
}

interface FileWithDetails extends File {
  id: string;
  preview?: string;
  lastModifiedDate?: Date;
}

const FileUpload = ({
  onFileUpload,
  onFileRemove,
  fileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 5,
  label = "Upload File",
  showFileDetails = true,
  folder,
  orderId
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<FileWithDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // File size validation
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB`);
      if (event.target.value) event.target.value = "";
      return;
    }

    // File type validation based on extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const acceptedExtensions = fileTypes.split(',').map(ext => 
      ext.startsWith('.') ? ext.substring(1) : ext
    );
    
    if (!acceptedExtensions.includes(fileExtension)) {
      toast.error(`Please select a valid file type: ${fileTypes}`);
      if (event.target.value) event.target.value = "";
      return;
    }
    
    // All validations passed
    try {
      setIsUploading(true);
      
      // Create file with details
      const fileWithDetails = file as FileWithDetails;
      fileWithDetails.id = crypto.randomUUID();
      fileWithDetails.lastModifiedDate = new Date();
      
      setSelectedFile(fileWithDetails);
      
      // Upload to Supabase
      const supabaseUrl = await uploadFileToSupabase(file, folder, orderId);
      
      if (supabaseUrl) {
        fileWithDetails.preview = supabaseUrl;
        onFileUpload(supabaseUrl, file);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Failed to upload file to storage");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("An error occurred while uploading the file");
    } finally {
      setIsUploading(false);
      if (event.target.value) event.target.value = "";
    }
  };
  
  const handleRemoveFile = () => {
    if (selectedFile && selectedFile.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    
    if (onFileRemove) {
      onFileRemove();
    }
  };
  
  const renderFileDetails = () => {
    if (!selectedFile) {
      return (
        <div className="text-sm text-gray-500 mt-2">
          <p>No file selected</p>
        </div>
      );
    }
    
    return (
      <div className="text-sm mt-2 bg-gray-50 p-3 rounded">
        <h3 className="font-medium mb-1">File Details:</h3>
        <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
        <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
        <p><span className="font-medium">Size:</span> {Math.round(selectedFile.size / 1024)} KB</p>
        {selectedFile.lastModifiedDate && (
          <p><span className="font-medium">Last Modified:</span> {selectedFile.lastModifiedDate.toDateString()}</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">Supported: {fileTypes}</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept={fileTypes}
          />
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium truncate" style={{ maxWidth: '200px' }}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile} 
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {showFileDetails && renderFileDetails()}
      
      {isUploading && (
        <div className="text-sm text-blue-600 mt-2 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading...
        </div>
      )}
    </div>
  );
};

export default FileUpload; 