'use client';

import { useGetServiceByIdQuery } from '@/redux/features/service/serviceApi';
import { TService } from '@/types/service.type';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { TReview } from '@/types/review.type';
import ViewReviews from '@/app/(WithMainLayout)/services/_component/view-reviews';
import { AppButton } from '@/components/shared/app-button';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

type Props = {
  serviceId: string;
};

const ViewService = ({ serviceId }: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const { data } = useGetServiceByIdQuery(serviceId);
  const service: TService | undefined = data?.data;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // When data is loaded, set the first image as default
  useEffect(() => {
    if (service?.images?.length) {
      setSelectedImage(service.images[0]?.url);
    }
  }, [service]);

  const firstPricing = service?.savedServices?.[0];
  const price = Number(firstPricing?.price || 0);
  const discountStr = firstPricing?.discount || '0%';

  // Convert discount to number
  const discountPercent = Number(discountStr.replace('%', ''));
  const discountedPrice = price - (price * discountPercent) / 100;

  const totalReviews = service?.reviews?.length ?? 0;

  const progress = [5, 4, 3, 2, 1].map((star) => {
    const count =
      service?.reviews?.filter((r: TReview) => r.rating === star).length ?? 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Product Image Section */}
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
                  selectedImage === image?.url
                    ? 'border-green-800'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(image?.url)}
              >
                <Image
                  src={
                    image?.url ||
                    'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                  }
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md cursor-pointer object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-5 lg:mt-0">
          {/* Product first part */}
          <div className="mb-6">
            <h2>
              {service?.savedServices?.[0]?.discount &&
                service.savedServices[0].discount !== 'none' &&
                service.savedServices[0].discount.trim() !== '' && (
                  <span className="bg-[#FCE9EACC] text-[#5F1011] p-3 rounded font-semibold uppercase">
                    Special Offer
                  </span>
                )}
            </h2>

            <div className="flex items-center gap-2 mt-5">
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

            <h1 className="text-2xl text-[#212529] my-3">{service?.name}</h1>

            <div>
              {/* Original Price */}
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

                {service?.savedServices?.[0]?.discount &&
                  service.savedServices[0].discount !== 'none' &&
                  service.savedServices[0].discount.trim() !== '' && (
                    <p className="px-3 py-1 text-sm font-semibold text-[#E12728] uppercase italic">
                      {service.savedServices[0].discount} Off
                    </p>
                  )}
              </div>

              {/* Discounted Price */}
              {discountPercent > 0 && (
                <p className="text-xl font-semibold text-gray-800">
                  ${discountedPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Product second part  */}
          <div>
            <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
              <span>Service Code</span>
              <span className="font-medium">{service?.serviceId}</span>
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
                  <div key={item.id} className={`${bgClass}`}>
                    {/* Right side: details inline */}
                    <div className="lg:flex justify-around items-center gap-6">
                      <p>Duration: {item.duration}</p>
                      <p>Price: ${item.price}</p>
                      <p>Discount: {item.discount} </p>
                      <p>Final Price: ${item.finalPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <AppButton
              className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white"
              content={
                <Link
                  href={`/${user?.role}/manage-offering/update-service/${service?._id}`}
                  className="flex justify-center items-center space-x-1 font-semibold"
                >
                  <span className="uppercase text-sm font-semibold">
                    Edit Service
                  </span>
                  <Edit />
                </Link>
              }
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h5 className="text-lg font-medium uppercase border-b py-1">
          Description
        </h5>
        <div
          className="mt-5 text-base text-gray-500 prose prose-sm max-w-none
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
      [&_li]:my-0.5
      [&_b]:font-semibold [&_strong]:font-semibold
      [&_a]:text-blue-500 [&_a]:underline
      [&_p]:my-1"
          dangerouslySetInnerHTML={{ __html: service?.description || '' }}
        />
      </div>

      <div className="my-10">
        {/* Average rating */}
        <div className="w-full bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
          <h2 className="text-2xl mb-2">Average Rating</h2>

          <div className="flex items-center gap-2 mt-5">
            {service ? (
              <StarRatings
                rating={Number(service.avgRating) || 0} // default to 0 if undefined
                starRatedColor="#E8B006"
                name={`rating-${service._id}`} // unique name
                starSpacing="1px"
                starDimension="24px"
              />
            ) : (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div> // loading skeleton
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

export default ViewService;
