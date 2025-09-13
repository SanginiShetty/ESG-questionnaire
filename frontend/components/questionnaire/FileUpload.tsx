'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, FileSpreadsheet, Loader } from 'lucide-react';
import { responseApi } from '@/lib/api';
import { ESGResponse } from '@/types';

interface FileUploadProps {
  year: number;
  onUploadSuccess: (data: ESGResponse) => void;
}

interface UploadProgress {
  uploading: boolean;
  processing: boolean;
  progress: number;
  stage: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ year, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    uploading: false,
    processing: false,
    progress: 0,
    stage: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-excel': '.xls'
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!Object.keys(acceptedTypes).includes(file.type)) {
      return 'Please upload a PDF or Excel file (.pdf, .xlsx, .xls)';
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    setSuccess('');
    
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setError('');
    setSuccess('');
    setUploadProgress({
      uploading: true,
      processing: false,
      progress: 0,
      stage: 'Uploading file...'
    });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      // Update stage to processing
      setTimeout(() => {
        setUploadProgress(prev => ({
          ...prev,
          uploading: false,
          processing: true,
          progress: 95,
          stage: 'Processing with AI...'
        }));
      }, 1000);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year.toString());

      const response = await responseApi.upload(formData);

      clearInterval(progressInterval);
      setUploadProgress({
        uploading: false,
        processing: false,
        progress: 100,
        stage: 'Complete!'
      });

      setSuccess('Data extracted and populated successfully!');
      onUploadSuccess(response.extractedData);
      
      // Clear file after successful upload
      setTimeout(() => {
        clearFile();
        setUploadProgress({
          uploading: false,
          processing: false,
          progress: 0,
          stage: ''
        });
      }, 2000);

    } catch (err: any) {
      setUploadProgress({
        uploading: false,
        processing: false,
        progress: 0,
        stage: ''
      });
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Upload failed. Please try again.');
      }
    }
  };

  const isUploading = uploadProgress.uploading || uploadProgress.processing;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Upload className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Data Upload</h3>
            <p className="text-sm text-gray-600">Upload PDF or Excel files to auto-populate ESG data</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        {!file ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {dragActive ? 'Drop your file here' : 'Upload your ESG document'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse files
                  </button>
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </div>
                <span>Max 10MB</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.xlsx,.xls"
              onChange={handleInputChange}
              disabled={isUploading}
            />
          </div>
        ) : (
          /* File Preview */
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              {!isUploading && (
                <button
                  onClick={clearFile}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">{uploadProgress.stage}</span>
                  <span className="text-gray-600">{uploadProgress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.progress}%` }}
                  ></div>
                </div>
                {uploadProgress.processing && (
                  <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    AI is analyzing your document...
                  </div>
                )}
              </div>
            )}

            {/* Upload Button */}
            {!isUploading && (
              <button
                onClick={uploadFile}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Extract Data with AI
              </button>
            )}
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Upload Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-700 font-medium">Success!</p>
              <p className="text-green-600 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}

        {/* Upload Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📄 Upload Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure your document contains ESG metrics with clear labels</li>
            <li>• Include numerical values with units (e.g., "Carbon emissions: 1,234 tonnes CO2e")</li>
            <li>• PDF files should have selectable text (not scanned images)</li>
            <li>• Excel files should have data in the first sheet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};