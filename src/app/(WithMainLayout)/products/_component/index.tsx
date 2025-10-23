'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import { MapPin, Minus, Plus, Send, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import AddReview from './add-review';
import ViewReviews from './view-reviews';
import Spinner from '@/components/shared/Spinner';
import { Progress } from '@/components/ui/progress';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { toast } from 'sonner';
import { TReview } from '@/types/review.type';
import FollowButton from '@/components/modules/follow-button';

type Props = {
  productId: string;
};

const ProductDetails = ({ productId }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { data, isLoading, refetch } = useGetProductByIdQuery(productId);
  const product: TProduct | undefined = data?.data;
  const vendorId = product?.vendor._id as string;

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

  const dispatch = useAppDispatch();

  const handleAddToCart = (product?: TProduct) => {
    if (!product) return; // guard clause
    dispatch(addToCart(product));
    toast.success('Product successfully added to cart.', { duration: 3000 });
  };

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
                <AvatarImage src={product?.vendor?.image} />
                <AvatarFallback>
                  {product?.vendor?.businessName?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">{product?.vendor?.businessName}</p>
                <p className="flex items-center gap-1">
                  {' '}
                  <MapPin />{' '}
                  <span>
                    {product?.vendor?.country} {product?.vendor.street}
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
                  className={`text-xl font-medium ${
                    discountPercent > 0
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
          </div>

          {/* Product second part  */}
          <div>
            <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
              <span>Product Code</span>
              <span className="font-medium">{product?.productCode}</span>
            </div>

            <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
              <span>Product Type</span>
              <span className="font-medium">{product?.productType}</span>
            </div>

            <div className="my-2 font-medium flex justify-between items-center p-5">
              <span>Size</span>
              <span className="font-medium">{product?.size}</span>
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
              <div className="flex items-center gap-1">
                <p className="text-gray-600 text-base mr-2">Quantity </p>
                <Button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  variant="outline"
                  className="size-8 rounded-sm bg-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <p className="font-medium text-lg p-2">{quantity}</p>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                  className="size-8 rounded-sm bg-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
                Status: {product?.status}
              </p>
            </div>
          </div>

          <div>
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="uppercase text-sm font-semibold">
                Add to cart
              </span>
            </Button>

            <Button className="w-full text-black border-gray-800 bg-gradient-to-t to-[#fff] from-[#fff] p-6 cursor-pointer text-sm mt-4 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500">
              <Send className="w-5 h-5" />
              <span className="uppercase text-sm font-semibold">Message</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h5 className="text-lg font-medium uppercase border-b py-1">
          Description
        </h5>
        <p className="mt-2 text-base text-gray-500">{product?.description}</p>
      </div>

      {/* Review section */}
      <div className="lg:flex my-10 gap-4">
        {/* Average rating */}
        <div className="lg:w-4/12 bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
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

        {/* Add Review */}
        <div className="lg:w-3/4">
          <AddReview
            vendorId={vendorId}
            productId={productId}
            refetch={refetch}
          />
        </div>
      </div>

      <ViewReviews productId={productId} />
    </div>
  );
};

export default ProductDetails;
