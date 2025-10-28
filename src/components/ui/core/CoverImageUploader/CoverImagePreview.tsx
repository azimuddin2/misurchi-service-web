'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

type TImagePreviewer = {
  setCoverImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  coverImagePreview: string[];
  setCoverImagePreview: React.Dispatch<React.SetStateAction<string[]>>;
  currentImages?: { url: string; key: string }[]; // Existing backend images with keys
  handleDeleteImage?: (key: string) => void; // Callback to delete existing images by key
  className?: string;
};

const CoverImagePreview = ({
  setCoverImageFiles,
  coverImagePreview,
  setCoverImagePreview,
  currentImages = [],
  handleDeleteImage,
  className,
}: TImagePreviewer) => {
  // Remove newly uploaded images by index
  const handleRemoveNewUpload = (index: number) => {
    setCoverImageFiles((prev) => prev.filter((_, idx) => idx !== index));
    setCoverImagePreview((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className={`w-full flex flex-col gap-5 ${className || ''}`}>
      {coverImagePreview.map((preview, index) => {
        const existingImage = currentImages.find((img) => img.url === preview);

        return (
          <div
            key={preview + index}
            className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
          >
            {/* Image */}
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover w-full h-full transition-transform duration-300"
            />

            {/* Delete Button */}
            {existingImage && handleDeleteImage ? (
              <button
                type="button"
                onClick={() => handleDeleteImage(existingImage.key)}
                className="absolute top-2 right-2 bg-[#FF4D4F] hover:bg-red-500 text-white rounded-full p-1.5 shadow-md transition"
                aria-label="Delete Image"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRemoveNewUpload(index)}
                className="absolute top-2 right-2 bg-[#FF4D4F] hover:bg-red-500 text-white rounded-full p-1.5 shadow-md transition"
                aria-label="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CoverImagePreview;
