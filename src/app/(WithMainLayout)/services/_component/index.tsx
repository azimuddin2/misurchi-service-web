'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetServiceByIdQuery } from '@/redux/features/service/serviceApi';
import { TService } from '@/types/service.type';
import { ArrowRight, MapPin, Plus, Send } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';

type Props = {
  serviceId: string;
};

const ServiceDetails = ({ serviceId }: Props) => {
  const { data } = useGetServiceByIdQuery(serviceId);
  const service: TService | undefined = data?.data;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // When data is loaded, set the first image as default
  useEffect(() => {
    if (service?.images?.length) {
      setSelectedImage(service.images[0].url);
    }
  }, [service]);

  const firstPricing = service?.savedServices?.[0];
  const price = Number(firstPricing?.price || 0);
  const discountStr = firstPricing?.discount || '0%';

  // Convert discount to number
  const discountPercent = Number(discountStr.replace('%', ''));
  const discountedPrice = price - (price * discountPercent) / 100;

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
          <div className="mt-12 hidden lg:block">
            <div className="flex items-center gap-3">
              <Avatar className="cursor-pointer border border-gray-300 h-12 w-12">
                <AvatarImage src={service?.user?.image} />
                <AvatarFallback>
                  {service?.user?.fullName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">{service?.user?.fullName}</p>
                <p className="flex items-center gap-1">
                  {' '}
                  <MapPin /> <span>{service?.user?.country}</span>
                </p>
              </div>
            </div>

            <Button className="w-1/2 text-black border-gray-800 bg-gradient-to-t to-[#fff] from-[#fff] p-6 cursor-pointer text-sm mt-4 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500">
              <Plus className="w-5 h-5" />
              <span className="uppercase text-sm font-semibold">Follow</span>
            </Button>
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
                rating={4.5}
                starRatedColor="#E8B006"
                name="rating"
                starSpacing="1px"
                starDimension="24px"
              />
              <p className="text-[#6B7280] text-base">(4.0/128 reviews)</p>
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
              <span>Service Id</span>
              <span className="font-medium">{service?.serviceId}</span>
            </div>

            <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
              <span>Service Type</span>
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
            <Button className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500">
              <span className="uppercase text-sm font-semibold">Schedule</span>
              <ArrowRight />
            </Button>

            <Button className="w-full text-black border-gray-800 bg-gradient-to-t to-[#fff] from-[#fff] p-6 cursor-pointer text-sm mt-4 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500">
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
        <p className="mt-2 text-base text-gray-500">{service?.description}</p>
      </div>
    </div>
  );
};

export default ServiceDetails;
