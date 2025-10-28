import { Dispatch, SetStateAction } from 'react';
import { Input } from '../../input';
import uploadIcon from '@/assets/icons/upload-icon.png';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type TImageUploaderProps = {
  label?: string;
  className?: string;
  setImageFiles: Dispatch<SetStateAction<File[] | []>>;
  setImagePreview: Dispatch<SetStateAction<[] | string[]>>;
};

const MSWImageUploader = ({
  label = 'Upload Images',
  className,
  setImageFiles,
  setImagePreview,
}: TImageUploaderProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setImageFiles((prev) => [...prev, file]);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  return (
    <div
      className={cn(
        'flex justify-center flex-col items-center w-full gap-4',
        className,
      )}
    >
      <Input
        onChange={handleImageChange}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        id="image-uploader"
      />
      <label
        htmlFor="image-uploader"
        className="w-full h-36 md:size-36 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition rounded-lg"
      >
        <p className="text-center">
          <Image
            src={uploadIcon || '/placeholder.png'}
            alt={'upload'}
            width={50}
            height={50}
            className="mx-auto mb-2"
          />
          <span className="font-medium uppercase text-sm">{label}</span>
        </p>
      </label>
    </div>
  );
};

export default MSWImageUploader;
