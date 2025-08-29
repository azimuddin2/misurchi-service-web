'use client';

import { AppButton } from '@/components/shared/app-button';
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

        {/* Service Name Overlay */}
        <div className="absolute bottom-0 bg-black/50 p-2 w-full text-gray-100 text-center text-lg z-10">
          <h1 className="truncate">{service?.name}</h1>
        </div>
      </div>

      <div className="my-3">
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-none">
              <AvatarImage src={service?.user?.image} />
              <AvatarFallback className="bg-[#093954] text-white text-2xl">
                {service?.user?.fullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span>{service?.user?.fullName?.slice(0, 12)}</span>
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
          <div className="flex justify-between items-center">
            <StarRatings
              rating={4}
              starRatedColor="#E8B006"
              name="rating"
              starSpacing="1px"
              starDimension="20px"
            />
            <p className="text-[#6B7280]">(4.0/128 reviews)</p>
          </div>
          <p className="flex items-center mt-3">
            <MapPin className="text-[#6B7280] mr-1" />
            <span className="text-[#6B7280]">{service?.user?.country}</span>
          </p>
        </div>
      </div>

      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/services/${service._id}`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <span className="uppercase text-sm font-semibold mr-2">
              Schedule
            </span>
            <ArrowRight size={24} />
          </Link>
        }
      />
    </div>
  );
};

export default ServiceCard;
