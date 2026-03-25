'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TReview } from '@/types/review.type';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';

type ReviewProps = {
  review: TReview;
};

const ReviewCard = ({ review }: ReviewProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Avatar className="cursor-pointer border border-gray-300 h-12 w-12">
          <AvatarImage src={review?.user?.image} />
          <AvatarFallback>{review?.user?.fullName?.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="my-3">
          <p className="text-base">{review?.user?.fullName}</p>
          <div className="flex items-center gap-1">
            <StarRatings
              rating={review.rating}
              starRatedColor="#E8B006"
              name="rating"
              starSpacing="1px"
              starDimension="20px"
            />
          </div>
        </div>
      </div>
      <div>
        <p>{review.review}</p>

        {/* <div className="flex gap-2 mt-2">
          {review.product?.images?.map((img, index) => (
            <div key={index} className="relative w-20 h-20">
              <Image
                src={img.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ReviewCard;
