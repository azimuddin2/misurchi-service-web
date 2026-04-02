'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetServiceByIdQuery } from '@/redux/features/service/serviceApi';
import { TService, TStatus } from '@/types/service.type';
import { ArrowRight, MapPin, Send, PackageX } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import ViewReviews from './view-reviews';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { TReview } from '@/types/review.type';
import FollowButton from '@/components/modules/follow-button';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Spinner from '@/components/shared/Spinner';

type Props = {
  serviceId: string;
};

const UnavailableIcon = () => <PackageX className="w-3.5 h-3.5" />;

const statusConfig: Record<
  TStatus,
  {
    label: string;
    badge: string;
    dot: string;
    icon: (() => React.ReactElement) | null;
    blockSchedule: boolean;
    bannerClass: string;
    bannerText: string;
  }
> = {
  available: {
    label: 'Available',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
    icon: null,
    blockSchedule: false,
    bannerClass: '',
    bannerText: '',
  },
  unavailable: {
    label: 'Unavailable',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: UnavailableIcon,
    blockSchedule: true,
    bannerClass: 'bg-red-50 border-red-200 text-red-700',
    bannerText: 'This Service Is Currently Unavailable.',
  },
};

// ✅ discount valid check
const isValidDiscount = (discount?: string): boolean => {
  if (!discount) return false;
  const trimmed = discount.trim();
  return trimmed !== '' && trimmed !== 'none' && trimmed !== '0%';
};

const ServiceDetails = ({ serviceId }: Props) => {
  const router = useRouter();
  const { data, isLoading } = useGetServiceByIdQuery(serviceId);
  const service: TService | undefined = data?.data;
  const vendorId = service?.vendor._id as string;
  const userId = service?.user._id as string;
  const user = useAppSelector(selectCurrentUser);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (service?.images?.length) {
      setSelectedImage(service.images[0].url);
    }
  }, [service]);

  // ✅ status — lowercase match
  const status: TStatus = service?.status ?? 'available';
  const cfg = statusConfig[status];

  const firstPricing = service?.savedServices?.[0];
  const price = Number(firstPricing?.price || 0);
  const discountStr = firstPricing?.discount || '0%';
  const discountPercent = Number(discountStr.replace('%', ''));
  const discountedPrice = price - (price * discountPercent) / 100;

  const totalReviews = service?.reviews?.length ?? 0;
  const progress = [5, 4, 3, 2, 1].map((star) => {
    const count =
      service?.reviews?.filter((r: TReview) => r.rating === star).length ?? 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const handleMessageVendor = () => {
    router.push(`/user/message?userId=${userId}&serviceId=${serviceId}`);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Images + Vendor */}
        <div>
          <div className="rounded-lg flex items-center justify-center h-[400px] relative overflow-hidden">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Product Image"
                width={400}
                height={400}
                className="rounded object-contain transition-transform duration-300 hover:scale-110"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="gap-3 mt-12 flex justify-start flex-wrap">
            {service?.images?.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`border-2 rounded-md p-1 transition ${
                  selectedImage === image.url
                    ? 'border-green-800'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md cursor-pointer object-cover"
                />
              </button>
            ))}
          </div>

          {/* Vendor Profile */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-5">
              <Avatar className="cursor-pointer border border-gray-300 h-12 w-12">
                <AvatarImage src={service?.vendor?.image} />
                <AvatarFallback>
                  {service?.vendor?.businessName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">{service?.vendor?.businessName}</p>
                <p className="flex items-center gap-1">
                  <MapPin />
                  <span>
                    {service?.vendor?.country} {service?.vendor.state}
                  </span>
                </p>
              </div>
            </div>
            <FollowButton
              vendorId={vendorId}
              className="w-full lg:w-1/2 text-black border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80"
            />
          </div>
        </div>

        {/* RIGHT: Service Info */}
        <div className="mt-5 lg:mt-0">
          {/* Special Offer + Rating + Name */}
          <div className="mb-6">
            {isValidDiscount(firstPricing?.discount) && (
              <span className="bg-[#FCE9EACC] text-[#5F1011] p-3 rounded font-semibold uppercase">
                Special Offer
              </span>
            )}
            <div className="flex items-center gap-2 mt-5">
              <StarRatings
                rating={service?.avgRating ?? 0}
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
            <h1 className="text-2xl text-[#212529] my-3">{service?.name}</h1>

            {/* Price */}
            <div className="flex items-center">
              <p
                className={`text-xl font-medium ${
                  discountPercent > 0
                    ? 'text-gray-500 line-through'
                    : 'text-gray-800'
                }`}
              >
                ${price.toFixed(2)}
              </p>
              {isValidDiscount(firstPricing?.discount) && (
                <p className="px-3 py-1 text-sm font-semibold text-[#E12728] uppercase italic">
                  {firstPricing?.discount} Off
                </p>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-xl font-semibold text-gray-800">
                ${discountedPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* ✅ Status pill */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.badge}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              {cfg.icon && <cfg.icon />}
              {cfg.label}
            </span>
          </div>

          {/* ✅ Unavailable banner */}
          {cfg.blockSchedule && (
            <div
              className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium border mb-4 ${cfg.bannerClass}`}
            >
              {cfg.icon && <cfg.icon />}
              {cfg.bannerText}
            </div>
          )}

          {/* Meta info */}
          <div>
            <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
              <span>Service Code</span>
              <span className="font-mono text-sm bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                {service?.serviceId}
              </span>
            </div>
            <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
              <span>Service Category</span>
              <span className="font-medium">{service?.type}</span>
            </div>
            <div className="my-2 font-medium">
              {service?.savedServices?.map((item, index) => {
                const bgClass =
                  index % 2 === 0
                    ? 'my-2 font-medium p-5'
                    : 'my-2 font-medium bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5';
                return (
                  <div key={item.id} className={bgClass}>
                    <div className="lg:flex justify-around items-center gap-6">
                      <p>Duration: {item.duration}</p>
                      <p>Price: ${item.price}</p>
                      {isValidDiscount(item.discount) && (
                        <p>Discount: {item.discount}</p>
                      )}
                      <p>Final Price: ${item.finalPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ✅ CTA Buttons */}
          <div>
            <Link href={cfg.blockSchedule ? '#' : `/schedule/${service?._id}`}>
              <Button
                disabled={cfg.blockSchedule}
                className={`w-full p-6 text-sm mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 ${
                  cfg.blockSchedule
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 text-white hover:opacity-90 cursor-pointer'
                }`}
              >
                <span className="uppercase text-sm font-semibold">
                  {cfg.blockSchedule ? 'Unavailable' : 'Schedule'}
                </span>
                {!cfg.blockSchedule && <ArrowRight />}
              </Button>
            </Link>

            <Button
              disabled={!user?.userId}
              onClick={handleMessageVendor}
              className="w-full text-black border-gray-800 bg-gradient-to-t to-[#fff] from-[#fff] p-6 cursor-pointer text-sm mt-4 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
            >
              <span className="uppercase text-sm font-semibold">Message</span>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h5 className="text-lg font-medium uppercase border-b py-1">
          Description
        </h5>
        <div
          className="mt-4 text-base text-gray-500 prose prose-sm max-w-none
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
            [&_li]:my-0.5
            [&_b]:font-semibold [&_strong]:font-semibold
            [&_a]:text-blue-500 [&_a]:underline
            [&_p]:my-1"
          dangerouslySetInnerHTML={{ __html: service?.description || '' }}
        />
      </div>

      {/* Reviews */}
      <div className="lg:flex my-10 gap-4">
        <div className="w-full bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
          <h2 className="text-2xl mb-2">Average Rating</h2>
          <div className="flex items-center gap-2 mt-5">
            {service ? (
              <StarRatings
                rating={Number(service.avgRating) || 0}
                starRatedColor="#E8B006"
                name={`rating-${service._id}`}
                starSpacing="1px"
                starDimension="24px"
              />
            ) : (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
            )}
            <p className="text-[#6B7280] text-base">
              ({service?.avgRating?.toFixed(1) || 0} /{' '}
              {service?.reviews?.length || 0} reviews)
            </p>
          </div>
          <div className="mt-5 space-y-2">
            {progress.map(({ star, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-4 text-sm font-medium text-gray-700">
                  {star}
                </span>
                <Progress
                  value={percentage}
                  className="flex-1 h-1 bg-gray-200 rounded-full"
                />
                <span className="w-10 text-sm text-gray-600">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ViewReviews serviceId={serviceId} />
    </div>
  );
};

export default ServiceDetails;
