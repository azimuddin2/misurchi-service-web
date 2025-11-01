'use client';

import ProductCard from '@/components/modules/cards/product-card';
import { AppButton } from '@/components/shared/app-button';
import Spinner from '@/components/shared/Spinner';
import { useGetAllProductsQuery } from '@/redux/features/product/productApi';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Products = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const products = data?.data?.slice(0, 8) || [];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mb-10">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product}></ProductCard>
          ))}
        </div>
      ) : (
        <div className="my-20">
          <Image
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            alt="No results"
            width={100}
            height={100}
            className="mx-auto"
          />
          <p className="text-center font-semibold mt-1">No Found Products</p>
        </div>
      )}
      <div className="text-center">
        <AppButton
          className="lg:w-1/4 text-white border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
          content={
            <Link
              href={`/all-products-services?tab=products`}
              className="flex justify-center items-center space-x-1 font-semibold"
            >
              <span className="uppercase text-sm font-semibold mr-2">
                View All Products
              </span>
              <ArrowRight size={24} />
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default Products;
