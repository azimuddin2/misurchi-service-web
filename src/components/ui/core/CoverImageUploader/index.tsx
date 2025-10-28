'use client';

import { Dispatch, SetStateAction } from 'react';
import { Input } from '../../input';
import uploadIcon from '@/assets/icons/upload-icon.png';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type TImageUploaderProps = {
  label?: string;
  className?: string;
  setCoverImageFiles: Dispatch<SetStateAction<File[] | []>>;
  setCoverImagePreview: Dispatch<SetStateAction<[] | string[]>>;
};

const CoverImageUploader = ({
  label = 'Upload Images',
  className,
  setCoverImageFiles,
  setCoverImagePreview,
}: TImageUploaderProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setCoverImageFiles((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  return (
    <div className={cn('w-full flex flex-col items-center gap-4', className)}>
      <Input
        onChange={handleImageChange}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id="cover-image-uploader"
      />

      <label
        htmlFor="cover-image-uploader"
        className="w-full h-56 flex flex-col items-center border-2 border-dashed border-gray-300 cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition rounded-lg"
      >
        <Image
          src={uploadIcon || '/placeholder.png'}
          alt="upload"
          width={50}
          height={50}
          className="mb-2 opacity-70 mt-12"
        />
        <span className="font-medium uppercase">{label}</span>
      </label>
    </div>
  );
};

export default CoverImageUploader;
