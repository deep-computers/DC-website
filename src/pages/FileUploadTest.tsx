import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadFileToSupabase } from '@/lib/emailService';
import { FileText, Upload, X } from 'lucide-react';

const FileUploadTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)} - ${message}`]);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      addLog(`File selected: ${file.name} (${Math.round(file.size/1024)} KB, type: ${file.type})`);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      addLog(`Starting upload to Supabase...`);
      
      // Generate a test folder with timestamp
      const testFolder = `test-${Date.now()}`;
      addLog(`Using test folder: ${testFolder}`);
      
      const result = await uploadFileToSupabase(selectedFile, testFolder);
      
      if (result) {
        setUploadUrl(result);
        addLog(`Upload successful! URL: ${result}`);
      } else {
        setError('Upload failed - check browser console for details');
        addLog(`Upload failed - null result returned`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload error: ${errorMessage}`);
      addLog(`Error during upload: ${errorMessage}`);
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Supabase File Upload Test</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Upload</h2>
            
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input" 
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to select file</p>
                  <p className="text-xs text-gray-400 mt-1">Any file type for testing</p>
                </label>
              </div>
            </div>
            
            {selectedFile && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
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
                    onClick={() => setSelectedFile(null)} 
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload to Supabase'}
            </Button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {uploadUrl && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Upload Result:</h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm overflow-auto">
                  <p>File uploaded successfully!</p>
                  <a 
                    href={uploadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {uploadUrl}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Logs</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearLogs}
                disabled={logs.length === 0}
              >
                Clear Logs
              </Button>
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md h-60 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Select and upload a file to see logs.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap mb-1">{log}</div>
                ))
              )}
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <h3 className="font-medium mb-2">How to test:</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select any file using the upload area above</li>
                <li>Click "Upload to Supabase" button</li>
                <li>Check logs for upload progress and results</li>
                <li>If successful, you'll see a link to the uploaded file</li>
                <li>Open browser developer tools (F12) for more detailed logs</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUploadTest; 