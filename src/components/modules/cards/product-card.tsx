'use client';

import { AppButton } from '@/components/shared/app-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TProduct } from '@/types/product.type';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StarRatings from 'react-star-ratings';

type ProductProps = {
  product: TProduct;
};

const ProductCard = ({ product }: ProductProps) => {
  const price = Number(product?.price || 0);
  const discountStr = product?.discountPrice || '0%';

  // Remove the '%' and convert to number
  const discountPercent = Number(discountStr.replace('%', ''));

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercent) / 100;

  return (
    <div className="shadow p-4 rounded-lg">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {/* Product Image */}
        {product?.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product?.name || 'Product image'}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No Image</p>
          </div>
        )}

        {/* Discount Badge */}
        {product?.discountPrice &&
          product.discountPrice !== 'none' &&
          product.discountPrice.trim() !== '' && (
            <div className="absolute top-2 left-2 bg-[#FCE9EACC] rounded-sm shadow-md z-10">
              <p className="px-3 py-1 text-xs font-semibold text-[#5F1011] uppercase italic">
                Special Discount - {product.discountPrice} Off
              </p>
            </div>
          )}

        {/* Product Name Overlay */}
        <div className="absolute bottom-0 bg-black/50 p-2 w-full text-gray-100 text-center text-lg z-10">
          <h1 className="truncate">{product?.name}</h1>
        </div>
      </div>

      <div className="my-3">
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-none">
              <AvatarImage src={product?.user?.image} />
              <AvatarFallback className="bg-[#093954] text-white text-xl">
                {product?.user?.fullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span>{product?.user?.fullName?.slice(0, 12)}</span>
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
            <span className="text-[#6B7280]">{product?.user?.country}</span>
          </p>
        </div>
      </div>

      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <span className="uppercase text-sm font-semibold mr-2">
              Add to cart
            </span>
            <ArrowRight size={24} />
          </Link>
        }
      />
    </div>
  );
};

export default ProductCard;
