'use client';
import React, { useState, useRef } from 'react';
import { Loader2, Paperclip } from 'lucide-react';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  uploadedImages: UploadedImage[];
}

export function MessageImageUpload({
  onImagesChange,
  maxImages = Infinity,
  uploadedImages,
  setUploadedImages,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);

    try {
      const filesArray = Array.from(files);
      const newImages: UploadedImage[] = filesArray
        .slice(0, maxImages - uploadedImages.length)
        .map((file) => ({
          id: Math.random().toString(36).substring(7),
          file: file,
          previewUrl: URL.createObjectURL(file),
          isImage: file.type.startsWith('image/'),
        }));

      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-fit space-y-1">
      <div className="flex justify-center ">
        <label className="relative cursor-pointer group w-fit">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleUpload}
            disabled={isUploading || uploadedImages.length >= maxImages}
            accept="image/*"
          />
          <div className="">
            <Paperclip></Paperclip>
          </div>
        </label>
      </div>

      {isUploading && (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin " />
        </div>
      )}
    </div>
  );
}
