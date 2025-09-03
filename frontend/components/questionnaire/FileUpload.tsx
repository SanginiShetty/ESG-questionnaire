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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !token) {
      setError('Please select a file and ensure you are logged in.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year.toString());

      const response = await responseApi.upload(formData, token);
      onUploadSuccess(response.response);
    } catch (err: any) {
      setError(err.message || 'An error occurred during file upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Upload ESG Data File</h3>
      <div className="text-sm text-gray-600 mb-4">
        Upload a PDF or Excel file containing your ESG data for the selected year. The system will automatically extract and fill in the data.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.xlsx"
            className="flex-grow"
          />
          <Button type="submit" disabled={!file || isLoading}>
            {isLoading ? <Loader /> : 'Upload and Process'}
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
