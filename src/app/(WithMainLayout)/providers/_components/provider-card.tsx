'use client';

import { TVendorUser } from '@/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppButton } from '@/components/shared/app-button';
import coverImg from '@/assets/images/cover-img.png';
import { useGetAllReviewByUserQuery } from '@/redux/features/review/reviewApi';
import { TReview } from '@/types/review.type';

type ProviderCardProps = {
  vendor: TVendorUser;
};

const ProviderCard = ({ vendor }: ProviderCardProps) => {
  const { data } = useGetAllReviewByUserQuery({
    vendorId: vendor._id,
  });

  const reviews: TReview[] = data?.data || [];

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
        reviewCount
      : 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] rounded-xl p-0">
      <div className="relative w-full h-36 bg-gray-100">
        {/* Cover Image */}
        <img
          src={vendor?.coverImage || coverImg.src}
          alt="provider cover"
          className="w-full h-full object-cover"
        />

        {/* Profile Avatar */}
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
        {/* Name + Rating */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800">
            {vendor.businessName}
          </h4>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={
                  i < Math.round(averageRating) ? 'currentColor' : 'transparent'
                }
                stroke="currentColor"
                className="text-yellow-500"
              />
            ))}
            <span className="ml-1 text-gray-500 text-sm">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {vendor?.description}
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
