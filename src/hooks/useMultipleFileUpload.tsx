import { useUploadImageMutation } from '@/redux/features/imageUpload/imageUploadApi';

const useMultipleFileUpload = () => {
  const [uploadFile, { isLoading: isUploading }] = useUploadImageMutation();

  const upload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file)); // ✅ must match backend field name

      const response = await uploadFile(formData).unwrap();

      // Optional: check structure
      if (response?.data) {
        return response.data; // returns array of uploaded image URLs
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return [upload, isUploading] as const;
};

export default useMultipleFileUpload;
