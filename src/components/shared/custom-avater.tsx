import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

const CustomAvatar = ({
  img,
  name,
  className,
  fallbackClass,
}: {
  img: any;
  name: string;
  className?: string;
  fallbackClass?: string;
}) => {
  return (
    <Avatar className={cn('', className)}>
      <AvatarImage src={img?.src || img} className="object-cover" />
      <AvatarFallback
        className={cn('bg-gray-300 text-black text-3xl', fallbackClass)}
      >
        {name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
