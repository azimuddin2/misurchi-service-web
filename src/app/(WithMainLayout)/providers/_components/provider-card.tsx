'use client';

import { TVendorUser } from '@/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppButton } from '@/components/shared/app-button';

type ProviderCardProps = {
  vendor: TVendorUser;
};

const ProviderCard = ({ vendor }: ProviderCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] rounded-xl p-0">
      {/* Cover + Profile */}
      <div className="relative w-full h-36 bg-gray-100">
        <img
          src="https://i.postimg.cc/PqwGnzj2/bfaefb25f7f03744d79c6c214b7e94efb3cf3c14.jpg"
          alt="provider cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <Avatar className="mx-auto w-20 h-20">
            <AvatarImage src={vendor?.image} />
            <AvatarFallback className="bg-gray-100 text-black text-3xl uppercase border-2 border-gray-700">
              {vendor?.businessName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardContent className="pt-12 pb-4 text-center space-y-3">
        {/* Name + Rating */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800">
            {vendor.businessName}
          </h4>
          <div className="flex justify-center items-center gap-1 text-yellow-500 text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <span className="text-gray-500 ml-1 text-xs">(10 reviews)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          Fashion lover 💫 | Curating the best of chic and street style ✨ | 10%
          of my sales go to supporting youth education 📚 | Join me on this
          stylish journey!
        </p>

        {/* Action Button */}
        <AppButton
          className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
          content={
            <Link
              href={`/providers/${vendor?._id}`}
              className="flex justify-center items-center space-x-1 font-semibold"
            >
              <span className="uppercase text-sm font-semibold me-3">
                View Profile
              </span>
              <ArrowRight size={24} />
            </Link>
          }
        />
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
