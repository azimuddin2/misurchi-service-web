'use client';

import { AppButton } from '@/components/shared/app-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TProduct } from '@/types/product.type';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ProductProps = {
  product: TProduct;
};

const ProductCard = ({ product }: ProductProps) => {
  return (
    <div className="shadow p-4 rounded-lg">
      <div className="relative w-full h-48">
        <Image
          src={product?.images[0]?.url}
          alt={product?.name || 'Product image'}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-0 bg-black/50 p-2 w-full text-gray-100 text-center text-lg rounded-b-lg">
          <h1>{product?.name}</h1>
        </div>
      </div>

      <div>
        <Avatar className="w-10 h-10 border-none">
          {/* <AvatarImage src={user?.image} /> */}
          <AvatarFallback className="bg-[#093954] text-white text-2xl">
            {'Azim'?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <span>{'Mr. Azim'}</span>
        <p className="text-lg font-semibold">${product?.price}</p>
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
