'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TService } from '@/types/service.type';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StarRatings from 'react-star-ratings';

type ServiceProps = {
  service: TService;
};

const ServiceCard = ({ service }: ServiceProps) => {
  const firstPricing = service?.savedServices?.[0];
  const price = Number(firstPricing?.price || 0);
  const discountStr = firstPricing?.discount || '0%';

  // Convert discount to number
  const discountPercent = Number(discountStr.replace('%', ''));
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div className="shadow p-4 rounded-lg">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {/* Service Image */}
        {service?.images?.[0]?.url ? (
          <Image
            src={service.images[0].url}
            alt={service?.name || 'Service image'}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No Image</p>
          </div>
        )}

        {/* Discount Badge */}
        {service?.savedServices?.[0]?.discount &&
          service.savedServices[0].discount !== 'none' &&
          service.savedServices[0].discount.trim() !== '' && (
            <div className="absolute top-2 left-2 bg-red-100/90 rounded-sm shadow-md z-10">
              <p className="px-3 py-1 text-xs font-semibold text-red-800 uppercase italic">
                Special Discount - {service.savedServices[0].discount} Off
              </p>
            </div>
          )}

        {/* Recommended Type Badges */}
        {service?.recommendedType?.length > 0 && (
          <div className="absolute bottom-12 right-2 z-10 items-end">
            {service.recommendedType.map((type, index) => (
              <span
                key={index}
                className="bg-[#E9F4FFCC] text-[#0D3C6B] text-xs font-semibold px-2 py-1 rounded mr-1 uppercase italic"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* Service Name Overlay */}
        <div className="absolute bottom-0 bg-black/50 p-2 w-full text-gray-100 text-center text-lg z-10">
          <h1 className="truncate">{service?.name}</h1>
        </div>
      </div>

      <div className="my-3">
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center gap-2">
            <Link href={`/providers/${service?.vendor?._id}`}>
              <Avatar className="w-10 h-10 border-none">
                <AvatarImage src={service?.vendor?.image} />
                <AvatarFallback className="bg-[#093954] text-white text-2xl">
                  {service?.vendor?.businessName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <span className="capitalize">
              {service?.vendor?.businessName?.slice(0, 12)}
            </span>
          </div>

          <div className="flex items-center">
            {/* Original Price */}
            <p
              className={`text-lg font-semibold ${
                discountPercent > 0
                  ? 'text-gray-500 line-through border-r border-gray-300 pr-3'
                  : 'text-gray-800'
              }`}
            >
              ${price.toFixed(2)}
            </p>

            {/* Discounted Price */}
            {discountPercent > 0 && (
              <p className="text-lg font-semibold text-gray-800 pl-3">
                ${discountedPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mt-5">
            <StarRatings
              rating={service?.avgRating}
              starRatedColor="#E8B006"
              name="rating"
              starSpacing="1px"
              starDimension="24px"
            />
            <p className="text-[#6B7280] text-base">
              ({service?.avgRating?.toFixed(1)} / {service?.reviews?.length}{' '}
              reviews)
            </p>
          </div>
          <p className="flex items-center mt-3">
            <MapPin className="text-[#6B7280] mr-1" />
            <span className="text-[#6B7280]">
              {service?.vendor?.country} {service?.vendor?.state}
            </span>
          </p>
        </div>
      </div>
      <Link href={`/services/${service._id}`}>
        <button className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 p-[14px] cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500  flex justify-center items-center font-semibold">
          <span className="uppercase text-sm font-semibold mr-2">Schedule</span>
          <ArrowRight size={20} />
        </button>
      </Link>
    </div>
  );
};

export default ServiceCard;
