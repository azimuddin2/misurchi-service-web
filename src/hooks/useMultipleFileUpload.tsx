// import { Error_Modal } from "@/modals/modals";

import { useUploadImageMutation } from '@/redux/features/imageUpload/imageUploadApi';

// import { TError } from "@/type";

const useMultipleFileUpload = () => {
  const [uploadFile, { isLoading: isUploading }] = useUploadImageMutation();
  const upload = async (file: File[]) => {
    try {
      const formData = new FormData();
      file.forEach((item) => formData.append('images', item));
      return await uploadFile(formData).unwrap();
    } catch (error: any) {
      //   Error_Modal({ title: error?.data?.message });
    }
  };
  return [upload, isUploading];
};
export default useMultipleFileUpload;
