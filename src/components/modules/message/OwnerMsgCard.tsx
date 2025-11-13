'use client';

import PreviewImageModal from '@/components/shared/preview-image-modal';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface OwnerMsgCardProps {
  date: string;
  message: string;
  files?: any[];
}

const OwnerMsgCard = ({ date, message, files = [] }: OwnerMsgCardProps) => {
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-max rounded-xl border border-primary-blue/20 bg-gradient-to-tr from-[#004b63] to-[#006884] px-4 py-2 text-white shadow-md"
      >
        {/* Image Grid */}
        {files?.length > 0 && (
          <div
            className={cn(
              'mb-2 grid gap-2',
              files.length === 1 && 'grid-cols-1',
              files.length === 2 && 'grid-cols-2',
              files.length >= 3 && 'grid-cols-3',
            )}
          >
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg border border-white/20 hover:scale-[1.02] transition-all"
                onClick={() => {
                  setImageUrl(file);
                  setOpenPreviewModal(true);
                }}
              >
                <Avatar className="h-24 w-full xl:h-28">
                  <AvatarImage
                    src={file}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback>
                    <Skeleton className="h-24 xl:h-28 w-full bg-[#1f5a73]" />
                  </AvatarFallback>
                </Avatar>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm">
                  🔍 View
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Text */}
        {message && (
          <p className="break-words text-[15px] leading-relaxed tracking-wide">
            {message}
          </p>
        )}

        {/* Formatted Date */}
        {formattedDate && (
          <p className="text-[11px] text-gray-300 mt-1 text-right">
            {formattedDate}
          </p>
        )}
      </motion.div>

      {/* Image Preview Modal */}
      <PreviewImageModal
        open={openPreviewModal}
        setOpen={setOpenPreviewModal}
        url={imageUrl}
      />
    </>
  );
};

export default OwnerMsgCard;
