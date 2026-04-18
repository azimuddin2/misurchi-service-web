'use client';

import { TVendorUser } from '@/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppButton } from '@/components/shared/app-button';
import coverImg from '@/assets/images/cover-img.png';
import StarRatings from 'react-star-ratings';

type ProviderCardProps = {
  vendor: TVendorUser;
};

const ProviderCard = ({ vendor }: ProviderCardProps) => {
  const avgRating = vendor.avgRating || 0;
  const reviewCount = vendor.reviewCount || 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] rounded-xl p-0">
      <div className="relative w-full h-36 bg-gray-100">
        <img
          src={vendor?.coverImage || coverImg.src}
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

      <CardContent className="pt-6 pb-4 text-center space-y-3">
        <div>
          <h4 className="font-semibold text-lg text-gray-800">
            {vendor.businessName}
          </h4>
          <div className="flex items-center justify-center gap-2 mt-1">
            <StarRatings
              rating={avgRating}
              starRatedColor="#E8B006"
              name="rating"
              starSpacing="1px"
              starDimension="22px"
            />
            <p className="text-[#6B7280] text-sm">
              ( {avgRating.toFixed(1)} / {reviewCount} reviews )
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {vendor?.description}
        </p>

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
