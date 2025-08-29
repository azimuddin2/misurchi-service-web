'use client';

import { AppButton } from '@/components/shared/app-button';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import { Link, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  productId: string;
};

const ProductDetails = ({ productId }: Props) => {
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const product: TProduct | undefined = data?.data;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
              className="rounded"
            />
          )}
        </div>
        <div className="gap-3 mt-12 flex justify-start">
          {product?.images?.map((image, index) => (
            <button
              key={index}
              className={`border-2 rounded-md p-1 ${
                selectedImage === image.url
                  ? 'border-[#093954]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedImage(image.url)}
            >
              <Image
                src={image.url}
                alt="Thumbnail"
                width={100}
                height={100}
                className="rounded-md cursor-pointer"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Listing Info */}
      <div className="mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-4">{product?.name}</h2>
        {/* <p className="text-justify text-gray-500 font-light text-sm">
                    {isReadMore
                        ? product?.description.slice(0, 200) + '...'
                        : product?.description}
                    <span onClick={toggleReadMore} className="inline">
                        {isReadMore ? (
                            <span className="link font-semibold text-primary cursor-pointer">
                                more?
                            </span>
                        ) : (
                            <span className="link font-semibold text-primary ms-1 cursor-pointer">
                                less
                            </span>
                        )}
                    </span>
                </p> */}
        <div className="flex items-center justify-between my-5 text-gray-500 text-xs">
          <p className="rounded-full px-4 py-1 bg-gray-100 flex items-center justify-center gap-1">
            <Star className="w-4 h-4" fill="orange" stroke="orange" />
            {5} Ratings
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
            Status: {product?.status}
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100 capitalize">
            Highlight Status: {product?.highlightStatus}
          </p>
        </div>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
          <span>Product Type</span>
          <span className="font-medium">{product?.productType}</span>
        </p>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
          <span>Product Name</span>
          <span className="font-medium">{product?.name}</span>
        </p>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
          <span>Price</span>
          <span className="font-medium">${product?.price}</span>
        </p>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
          <span>Discount</span>
          <span className="font-medium">{product?.discountPrice}</span>
        </p>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
          <span>Size</span>
          <span className="font-medium">{product?.size}</span>
        </p>
        <hr />
        <p className="my-2 font-medium flex justify-between items-center">
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
        </p>

        <div className="flex items-end justify-end">
          <AppButton
            className="w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white"
            content={
              <Link
                href={`/`}
                className="flex justify-center items-center space-x-1 font-semibold"
              >
                <span className="uppercase text-sm font-semibold">
                  Edit Product
                </span>
                {/* <ArrowRight /> */}
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
