'use client';

import { AppButton } from '@/components/shared/app-button';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { useAppSelector } from '@/redux/hooks';
import { TProduct } from '@/types/product.type';
import { ArrowRight, PlusCircle, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  productId: string;
};

const ViewProduct = ({ productId }: Props) => {
  const router = useRouter();
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

  const [isReadMore, setIsReadMore] = useState<boolean>(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 my-10">
      {/* Product Image Section */}
      <div>
        <div className="rounded-lg flex items-center justify-center h-[400px] relative">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Product Image"
              width={400}
              height={400}
              className="rounded object-contain"
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
                  ? 'border-green-700'
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
      </div>

      {/* Listing Info */}
      <div className="mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-4">{product?.name}</h2>

        <div className="flex items-center justify-between my-5 text-gray-500 text-xs">
          <div className="rounded-full px-4 py-1 bg-gray-100 flex items-center justify-center gap-1">
            <Star className="w-4 h-4" fill="orange" stroke="orange" />
            {5} Ratings
          </div>
          <div className="rounded-full px-4 py-1 bg-gray-100 capitalize">
            Status: {product?.status}
          </div>
          <div className="rounded-full px-4 py-1 bg-gray-100 capitalize">
            Highlight Status: {product?.highlightStatus}
          </div>
        </div>

        <hr />
        <div className="my-2 font-medium flex justify-between items-center">
          <span>Product Type</span>
          <span className="font-medium">{product?.productType}</span>
        </div>
        <hr />
        <div className="my-2 font-medium flex justify-between items-center">
          <span>Product Name</span>
          <span className="font-medium">{product?.name}</span>
        </div>
        <hr />
        <div className="my-2 font-medium flex justify-between items-center">
          <span>Price</span>
          <span className="font-medium">${product?.price}</span>
        </div>
        <hr />
        <div className="my-2 font-medium flex justify-between items-center">
          <span>Discount</span>
          <span className="font-medium">{product?.discountPrice}</span>
        </div>
        <hr />
        <div className="my-2 font-medium flex justify-between items-center">
          <span>Size</span>
          <span className="font-medium">{product?.size}</span>
        </div>
        <hr />
        <div className="my-2 font-medium flex justify-between items-start">
          <span>Product Colors</span>
          <div className="flex gap-2 mt-1 flex-wrap">
            {product?.colors?.map((color: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium border capitalize"
                style={{ backgroundColor: color, color: '#fff' }}
              >
                {color}
              </span>
            ))}
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
                <ArrowRight />
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
