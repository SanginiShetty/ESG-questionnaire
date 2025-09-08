'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { responseApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';

interface FileUploadProps {
  year: number;
  onUploadSuccess: (data: any) => void;
}

export const FileUpload = ({ year, onUploadSuccess }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const validateFile = (file: File) => {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload only PDF or Excel (.xlsx) files';
    }

    // Check if file is empty
    if (file.size === 0) {
      return 'File appears to be empty';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate the file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      if (e.target) e.target.value = ''; // Reset the input
      return;
    }

    console.log('Selected file:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size
    });

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !token) {
      setError('Please select a file and ensure you are logged in.');
      return;
    }

    // Double-check file before upload
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year.toString());

      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await responseApi.upload(formData, token);
      onUploadSuccess(response.response);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred during file upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-black mb-4">Upload ESG Data File</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-800 mb-2">File Requirements:</h4>
        <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Accepted formats: PDF or Excel (.xlsx)</li>
          <li>Maximum file size: 10MB</li>
          <li>File must contain readable text (PDFs cannot be scanned images)</li>
          <li>Data should be clearly formatted for better extraction</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.xlsx"
            className="border-2 border-gray-300 rounded-lg p-2"
            disabled={isLoading}
          />

          {file && !error && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!file || isLoading}
            className="w-full py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader />
                <span>Processing...</span>
              </div>
            ) : (
              'Upload and Process'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
