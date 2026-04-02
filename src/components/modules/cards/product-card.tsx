'use client';

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

        {/* Recommended Type Badges */}
        {product.recommendedType.length > 0 && (
          <div className="absolute bottom-12 right-2 z-10 items-end">
            {product.recommendedType.map((type, index) => (
              <span
                key={index}
                className="bg-[#E9F4FFCC] text-[#0D3C6B] text-xs font-semibold px-2 py-1 rounded mr-1 uppercase italic"
              >
                {type}
              </span>
            ))}
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
              <AvatarImage src={product?.vendor?.image} />
              <AvatarFallback className="bg-[#093954] text-white text-xl">
                {product?.vendor?.businessName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="capitalize">
              {product?.vendor?.businessName?.slice(0, 12)}
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
              rating={product?.avgRating}
              starRatedColor="#E8B006"
              name="rating"
              starSpacing="1px"
              starDimension="24px"
            />
            <p className="text-[#6B7280] text-base">
              ({product?.avgRating?.toFixed(1)} / {product?.reviews?.length}{' '}
              reviews)
            </p>
          </div>
          <p className="flex items-center mt-3 mb-5">
            <MapPin className="text-[#6B7280] mr-1" />
            <span className="text-[#6B7280]">
              {product?.vendor?.country}, {product.vendor.state}
            </span>
          </p>
        </div>
      </div>
      <Link href={`/products/${product._id}`}>
        <button className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 p-[14px] cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500  flex justify-center items-center font-semibold">
          <span className="uppercase text-sm font-semibold mr-2">SHOP NOW</span>
          <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
