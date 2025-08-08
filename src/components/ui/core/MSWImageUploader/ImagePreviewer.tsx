import Image from 'next/image';
import { X } from 'lucide-react';

type TImagePreviewer = {
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreview: string[];
  setImagePreview: React.Dispatch<React.SetStateAction<string[]>>;
  currentImages?: { url: string; key: string }[]; // Existing backend images with keys
  handleDeleteImage?: (key: string) => void; // Callback to delete existing images by key
  className?: string;
};

const ImagePreviewer = ({
  setImageFiles,
  imagePreview,
  setImagePreview,
  currentImages = [],
  handleDeleteImage,
  className,
}: TImagePreviewer) => {
  // Check if a preview url belongs to an existing image
  const isExistingImage = (url: string) => {
    return currentImages.some((img) => img.url === url);
  };

  // Remove newly uploaded images by index
  const handleRemoveNewUpload = (index: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== index));
    setImagePreview((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className={className}>
      {imagePreview.map((preview, index) => {
        const existingImage = currentImages.find((img) => img.url === preview);

        return (
          <div
            key={preview + index}
            className="relative w-36 h-36 rounded-lg overflow-hidden border border-dashed border-gray-300"
          >
            <Image
              width={500}
              height={500}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-full"
            />
            {existingImage && handleDeleteImage ? (
              <button
                type="button"
                onClick={() => handleDeleteImage(existingImage.key)}
                className="bg-[#FF4D4F] cursor-pointer hover:bg-red-400 absolute -top-0 -right-0 w-6 h-6 p-0 rounded-full flex justify-center items-center"
                aria-label="Delete Image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRemoveNewUpload(index)}
                className="bg-[#FF4D4F] cursor-pointer hover:bg-red-400 absolute -top-0 -right-0 w-6 h-6 p-0 rounded-full flex justify-center items-center"
                aria-label="Delete Image"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImagePreviewer;
