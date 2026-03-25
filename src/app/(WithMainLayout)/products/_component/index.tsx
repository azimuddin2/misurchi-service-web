'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import {
  MapPin,
  Send,
  ShoppingCart,
  AlertTriangle,
  PackageX,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import AddReview from './add-review';
import ViewReviews from './view-reviews';
import Spinner from '@/components/shared/Spinner';
import { Progress } from '@/components/ui/progress';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { toast } from 'sonner';
import { TReview } from '@/types/review.type';
import FollowButton from '@/components/modules/follow-button';
import { useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

type Props = {
  productId: string;
};

// ── Status config ──────────────────────────────────────────────
type TStatus = TProduct['status'];

const statusConfig: Record<
  TStatus,
  {
    label: string;
    badge: string;
    dot: string;
    icon: React.ReactNode;
    blockCart: boolean;
    banner: string;
    bannerText: string;
  }
> = {
  Available: {
    label: 'In Stock',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
    icon: null,
    blockCart: false,
    banner: '',
    bannerText: '',
  },
  'Out of Stock': {
    label: 'Out of Stock',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: <PackageX className="w-3.5 h-3.5" />,
    blockCart: true,
    banner: 'bg-red-50 border-red-200 text-red-700',
    bannerText: 'This product is currently out of stock.',
  },
  TBC: {
    label: 'To Be Confirmed',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-400',
    icon: <Clock className="w-3.5 h-3.5" />,
    blockCart: true,
    banner: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    bannerText: 'Availability for this product is to be confirmed.',
  },
  Discontinued: {
    label: 'Discontinued',
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
    icon: <PackageX className="w-3.5 h-3.5" />,
    blockCart: true,
    banner: 'bg-gray-100 border-gray-200 text-gray-600',
    bannerText:
      'This product has been discontinued and is no longer available.',
  },
};

const LOW_STOCK_THRESHOLD = 5;

// ── Component ──────────────────────────────────────────────────
const ProductDetails = ({ productId }: Props) => {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetProductByIdQuery(productId);
  const product: TProduct | undefined = data?.data;
  const vendorId = product?.vendor._id as string;
  const userId = product?.user._id as string;
  const user = useAppSelector(selectCurrentUser);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | any>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const hasSizes = Array.isArray(product?.size)
    ? (product.size as unknown as string[]).length > 0
    : !!product?.size;
  const hasColors = Array.isArray(product?.colors) && product.colors.length > 0;

  const status = product?.status ?? 'Available';
  const cfg = statusConfig[status] ?? statusConfig['Available'];

  const isLowStock =
    status === 'Available' &&
    product?.quantity !== undefined &&
    product.quantity > 0 &&
    product.quantity <= LOW_STOCK_THRESHOLD;

  const canAddToCart =
    !cfg.blockCart &&
    (!hasSizes || selectedSize !== null) &&
    (!hasColors || selectedColor !== null);

  useEffect(() => {
    if (product?.images?.length) setSelectedImage(product.images[0].url);
  }, [product]);

  const price = Number(product?.price || 0);
  const discountStr = product?.discountPrice || '0%';
  const discountPercent = Number(discountStr.replace('%', ''));
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
    if (!product) return;

    if (cfg.blockCart) {
      toast.error(`This product is ${cfg.label}.`);
      return;
    }

    if (!canAddToCart) {
      if (hasSizes && !selectedSize) toast.error('Please select a size.');
      else if (hasColors && !selectedColor)
        toast.error('Please select a color.');
      return;
    }

    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor,
      }),
    );

    toast.success('Product added to cart!');
  };

  const handleMessageVendor = () => {
    router.push(`/user/message?userId=${userId}&productId=${productId}`);
  };

  if (isLoading) return <Spinner />;

  const addToCartLabel = cfg.blockCart
    ? cfg.label
    : !selectedSize && hasSizes
      ? 'Select a Size First'
      : !selectedColor && hasColors
        ? 'Select a Color First'
        : 'Add to Cart';

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* ── LEFT: Images + Vendor ── */}
        <div>
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
                    width={80}
                    height={80}
                    className="rounded-md cursor-pointer object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Vendor Profile */}
          <div className="mt-10">
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
                  <MapPin />
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

        {/* ── RIGHT: Product Info ── */}
        <div className="mt-5 lg:mt-0 flex flex-col gap-4">
          {/* Special offer + Rating + Name */}
          <div>
            {product?.discountPrice && (
              <span className="bg-[#FCE9EACC] text-[#5F1011] px-3 py-1.5 rounded font-semibold uppercase text-xs">
                Special Offer
              </span>
            )}
            <div className="flex items-center gap-2 mt-4">
              <StarRatings
                rating={product?.avgRating ?? 0}
                starRatedColor="#E8B006"
                name="rating"
                starSpacing="1px"
                starDimension="20px"
              />
              <p className="text-[#6B7280] text-sm">
                ({product?.avgRating?.toFixed(1)} / {product?.reviews?.length}{' '}
                reviews)
              </p>
            </div>
            <h1 className="text-2xl text-[#212529] font-bold mt-2">
              {product?.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            {discountPercent > 0 ? (
              <>
                <span className="text-3xl font-extrabold text-gray-900">
                  ${discountedPrice?.toFixed(2)}
                </span>
                <span className="text-lg text-gray-400 line-through mb-0.5">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-[#E12728] italic mb-0.5">
                  {product?.discountPrice} Off
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-gray-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* ── Status + Quantity pills ── */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status pill */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.badge}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              {cfg.icon}
              {cfg.label}
            </span>

            {/* Quantity pill — only show when available */}
            {status === 'Available' && product?.quantity !== undefined && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  isLowStock
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {isLowStock && (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                )}
                {isLowStock
                  ? `Only ${product.quantity} left!`
                  : `${product.quantity} in stock`}
              </span>
            )}
          </div>

          {/* Low stock warning banner */}
          {isLowStock && (
            <div className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-700 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Hurry! Only <strong className="mx-1">
                {product?.quantity}
              </strong>{' '}
              items left in stock.
            </div>
          )}

          {/* Unavailable banner (Out of Stock / TBC / Discontinued) */}
          {cfg.blockCart && cfg.bannerText && (
            <div
              className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium border ${cfg.banner}`}
            >
              <span className="shrink-0">{cfg.icon}</span>
              {cfg.bannerText}
            </div>
          )}

          {/* Meta info */}
          <div className="">
            <div className="my-2 font-medium flex justify-between items-center p-5 border-t">
              <span>Product Code</span>
              <span className="font-mono text-sm bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                {product?.productCode}
              </span>
            </div>
            <div className="my-2 font-medium flex justify-between items-center bg-gradient-to-t to-[#cadfe7] from-[#d9ebe8] border-t border-b border-[#00325099] p-5">
              <span>Product Category</span>
              <span className="font-medium">{product?.productType}</span>
            </div>
          </div>

          {/* Size selector */}
          {hasSizes && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Size
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product?.size) ? (
                  (product.size as unknown as string[]).map((s: string) => (
                    <button
                      key={s}
                      type="button"
                      disabled={cfg.blockCart}
                      onClick={() =>
                        setSelectedSize(s === selectedSize ? null : s)
                      }
                      className={`px-3 py-1 rounded-sm border-2 text-sm font-medium transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-green-800 text-white border-green-800'
                          : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-green-600'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {s}
                    </button>
                  ))
                ) : (
                  <span className="font-medium">{product?.size}</span>
                )}
              </div>
            </div>
          )}

          {/* Color selector */}
          {hasColors && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Product Colors
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product?.colors?.map((color: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    disabled={cfg.blockCart}
                    onClick={() =>
                      setSelectedColor(color === selectedColor ? null : color)
                    }
                    className={`flex cursor-pointer items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border-2 bg-white transition-all ${
                      selectedColor === color
                        ? 'border-green-700'
                        : 'border-gray-300 hover:border-green-600'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={{ color: '#000' }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected summary */}
          {(selectedSize || selectedColor) && (
            <div className="flex gap-2 flex-wrap">
              {selectedSize && (
                <span className="bg-green-50 border border-green-200 text-green-800 text-xs rounded px-2.5 py-1 font-medium">
                  Size: {selectedSize}
                </span>
              )}
              {selectedColor && (
                <span className="bg-green-50 border border-green-200 text-green-800 text-xs rounded px-2.5 py-1 font-medium flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-green-300"
                    style={{ backgroundColor: selectedColor }}
                  />
                  Color: {selectedColor}
                </span>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!canAddToCart}
              className={`w-full flex items-center justify-center gap-2 py-6 rounded-sm text-sm font-semibold uppercase tracking-wide border-b-4 border-r-4 shadow-sm transition-all ${
                canAddToCart
                  ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white border-green-900 hover:opacity-90 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {addToCartLabel}
            </Button>

            <Button
              disabled={!user?.userId}
              onClick={handleMessageVendor}
              className="w-full flex items-center justify-center gap-2 py-6 rounded-sm text-sm font-semibold uppercase tracking-wide bg-gradient-to-t to-white from-white text-black border border-gray-800 border-b-4 border-r-4 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
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

      {/* ── Reviews ── */}
      <div className="lg:flex my-10 gap-4">
        <div className="lg:w-4/12 bg-[#f2f9fb] p-6 rounded-lg mb-4 lg:mb-0">
          <h2 className="text-2xl mb-2">Average Rating</h2>
          <div className="flex items-center gap-2 mt-5">
            {product ? (
              <StarRatings
                rating={Number(product.avgRating) || 0}
                starRatedColor="#E8B006"
                name={`rating-${product._id}`}
                starSpacing="1px"
                starDimension="24px"
              />
            ) : (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
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
