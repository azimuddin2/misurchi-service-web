'use client';

import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import { ArrowRight, Edit, PackagePlus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import Spinner from '@/components/shared/Spinner';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/redux/hooks';
import { TReview } from '@/types/review.type';
import ViewReviews from '@/app/(WithMainLayout)/products/_component/view-reviews';
import { AppButton } from '@/components/shared/app-button';
import Link from 'next/link';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

type Props = {
  productId: string;
};

const ViewProduct = ({ productId }: Props) => {
  const user = useAppSelector(selectCurrentUser);

  const { data, isLoading } = useGetProductByIdQuery(productId);
  const product: TProduct | undefined = data?.data;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // When data is loaded, set the first image as default
  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  const price = Number(product?.price || 0);
  const discountStr = product?.discountPrice || '0%';

  // Remove the '%' and convert to number
  const discountPercent = Number(discountStr.replace('%', ''));

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercent) / 100;

  const totalReviews = product?.reviews?.length ?? 0;

  const progress = [5, 4, 3, 2, 1].map((star) => {
    const count =
      product?.reviews?.filter((r: TReview) => r.rating === star).length ?? 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  if (isLoading) {
    return <Spinner />;
  }

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
            {product?.images?.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`border-2 rounded-md p-1 transition ${selectedImage === image.url
                  ? 'border-green-800'
                  : 'border-gray-300'
                  }`}
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
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
              {product?.discountPrice && (
                <span className="bg-[#FCE9EACC] text-[#5F1011] p-3 rounded font-semibold uppercase">
                  Special Offer
                </span>
              )}
            </h2>

            <div className="flex items-center gap-2 mt-5">
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

            <h1 className="text-2xl text-[#212529] my-3">{product?.name}</h1>

            <div>
              {/* Original Price */}
              <div className="flex items-center">
                <p
                  className={`text-xl font-medium ${discountPercent > 0
                    ? 'text-gray-500 line-through pr-3'
                    : 'text-gray-800'
                    }`}
                >
                  ${price.toFixed(2)}
                </p>
                {product?.discountPrice && (
                  <span className="text-sm font-semibold text-[#E12728] uppercase italic">
                    {product?.discountPrice} Off
                  </span>
                )}
              </div>

              {/* Discounted Price */}
              {discountPercent > 0 && (
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  ${discountedPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div>
              {product?.recommendedType?.length && (
                <div className="mt-3 right-2 z-10 items-end">
                  {product?.recommendedType.map((type, index) => (
                    <span
                      key={index}
                      className="bg-[#E9F4FFCC] text-[#0D3C6B] text-xs font-semibold px-2 py-1 rounded mr-2 uppercase ring-1 ring-[#d2dfeccc]"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product second part  */}
          <div>
            <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
              <span>Product Code</span>
              <span className="font-medium">{product?.productCode}</span>
            </div>

            <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
              <span>Product Category</span>
              <span className="font-medium">{product?.productType}</span>
            </div>

            <div className="my-2 font-medium flex justify-between items-center p-5">
              <span>Size</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {Array.isArray(product?.size) ? (
                  product.size.map((s: string) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-sm bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="font-medium">{product?.size}</span>
                )}
              </div>
            </div>

            <div className="my-2 font-medium flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5 rounded-md">
              <span className="mb-2 sm:mb-0">Product Colors:</span>
              <div className="flex gap-2 flex-wrap">
                {product?.colors?.map((color: string, index: number) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border shadow-sm"
                    style={{ backgroundColor: '#fff', color: '#000' }} // text color stays black
                  >
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div className="my-2 font-medium flex justify-between items-center p-5">
              <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
                Quantity: {product?.quantity}
              </p>
              <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
                Status: {product?.status}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <AppButton
              className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white"
              content={
                <Link
                  href={`/${user?.role}/manage-offering/update-product/${product?._id}`}
                  className="flex justify-center items-center space-x-1 font-semibold"
                >
                  <span className="uppercase text-sm font-semibold">
                    Edit Product
                  </span>
                  <Edit size={20} />
                </Link>
              }
            />
          </div>

          <div className='mt-3'>
            <Link href={`/vendor/manage-offering/add-product`}>
              <button className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 p-[14px] cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500  flex justify-center items-center font-semibold">
                <span className="uppercase text-sm font-semibold mr-2">Add Another Product</span>
                <PackagePlus size={20} />
              </button>
            </Link>
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
          dangerouslySetInnerHTML={{ __html: product?.description || '' }}
        />
      </div>

      {/* Review section */}
      <div className=" my-10 gap-4">
        {/* Average rating */}
        <div className="w-full bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
          <h2 className="text-2xl mb-2">Average Rating</h2>

          <div className="flex items-center gap-2 mt-5">
            {product ? (
              <StarRatings
                rating={Number(product.avgRating) || 0} // default to 0 if undefined
                starRatedColor="#E8B006"
                name={`rating-${product._id}`} // unique name
                starSpacing="1px"
                starDimension="24px"
              />
            ) : (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div> // loading skeleton
            )}

            <p className="text-[#6B7280] text-base">
              ({product?.avgRating?.toFixed(1) || 0} /{' '}
              {product?.reviews?.length || 0} reviews)
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

      <ViewReviews productId={productId} />
    </div>
  );
};

export default ViewProduct;
