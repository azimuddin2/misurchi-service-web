import { useState } from 'react';
import { useUploadImageMutation } from '@/redux/features/imageUpload/imageUploadApi';

const useMultipleFileUpload = () => {
  const [uploadFile, { isLoading: isUploading }] = useUploadImageMutation();
  const [progress, setProgress] = useState<number>(0);

  const upload = async (files: File[]) => {
    try {
      // Reset progress before every upload
      setProgress(0);

      const formData = new FormData();
      files.forEach((file) => formData.append('images', file)); // ✅ matches backend

      // Manual progress simulation (RTK Query doesn't provide onUploadProgress natively)
      const totalSteps = 10;
      let currentStep = 0;

      const simulateProgress = setInterval(() => {
        currentStep += 1;
        setProgress(Math.min((currentStep / totalSteps) * 100, 95));
      }, 200);

      const response = await uploadFile(formData).unwrap();

      clearInterval(simulateProgress);
      setProgress(100); // ✅ Complete

      if (response?.data) {
        return response.data; // ✅ returns array of uploaded image URLs or objects
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 800);
    }
  };

  return [upload, isUploading, progress] as const;
};

export default useMultipleFileUpload;
