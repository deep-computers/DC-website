import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, FileText } from "lucide-react";
import { toast } from "sonner";

export interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface OrderFileUploadProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  maxFiles?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
  label?: string;
  helpText?: string;
}

const OrderFileUpload = ({
  files,
  setFiles,
  maxFiles = 10,
  allowedFileTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  maxFileSize = 25, // Default 25MB max file size
  label = "Upload Documents",
  helpText = "Upload PDF, Word, or image files",
}: OrderFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const generateSimpleId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    // Check file type
    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
      return { 
        valid: false, 
        message: `Invalid file type. Allowed types: ${allowedFileTypes.map(type => type.split('/')[1]).join(', ')}` 
      };
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return { 
        valid: false, 
        message: `File too large. Maximum size allowed is ${maxFileSize}MB` 
      };
    }
    
    return { valid: true };
  };

  const processFiles = (filesToProcess: FileList | File[]) => {
    if (files.length >= maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const remainingSlots = maxFiles - files.length;
    const filesToAdd = Array.from(filesToProcess).slice(0, remainingSlots);
    
    const validFiles: FileWithPreview[] = [];
    
    filesToAdd.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          ...file,
          id: generateSimpleId(),
          preview: URL.createObjectURL(file)
        } as FileWithPreview);
      } else if (validation.message) {
        toast.error(validation.message);
      }
    });
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    try {
      processFiles(event.target.files);
      // Reset input value to allow uploading the same file again
      event.target.value = "";
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file. Please try again.");
      if (event.target.value) event.target.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(file => file.id !== id);
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!e.dataTransfer.files) return;
    processFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium">{label}</div>
        <div 
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/70'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm font-medium">
              Drag & drop files here or click to browse
            </div>
            <div className="text-xs text-gray-500">
              {helpText}
            </div>
            <div className="text-xs text-gray-500">
              Maximum {maxFiles} files (up to {maxFileSize}MB each)
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            multiple
            accept={allowedFileTypes.join(',')}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploaded Files ({files.length}/{maxFiles})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 bg-white group hover:border-primary/50 transition-colors"
              >
                <div className="shrink-0">
                  <FileText className="h-8 w-8 text-primary/70" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-50 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFileUpload; 