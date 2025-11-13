'use client';

import PreviewImageModal from '@/components/shared/preview-image-modal';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar } from '@radix-ui/react-avatar';
import { useState } from 'react';

const ReceiverMsgCard = ({
  date,
  message,
  files,
}: {
  date: string;
  message: string;
  files: any[];
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  // 🔹 Format date to readable format
  const formattedDate = date
    ? new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <>
      <div className="max-w-max rounded-xl border bg-[#DFE1E3] px-4 py-2">
        {files && files.length > 0 && (
          <div
            className={cn(
              'grid grid-cols-1 gap-2',
              files.length === 2 && 'grid-cols-2',
              files.length >= 3 && 'grid-cols-3',
            )}
          >
            {files.map((file: any, index: number) => (
              <Avatar
                onClick={() => {
                  setOpenPreviewModal(true);
                  setImageUrl(file);
                }}
                key={index}
                className="h-24 w-full xl:h-28"
              >
                <AvatarImage src={file} />
                <AvatarFallback className="rounded-none">
                  <Skeleton className="h-24 xl:h-28 w-28 bg-[#9991e6]"></Skeleton>
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
        <p className="text-primary-black break-words">{message}</p>
        {formattedDate && (
          <p className="text-[11px] text-gray-500 mt-1">{formattedDate}</p>
        )}
      </div>

      <PreviewImageModal
        open={openPreviewModal}
        setOpen={setOpenPreviewModal}
        url={imageUrl}
      />
    </>
  );
};

export default ReceiverMsgCard;
