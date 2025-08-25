'use client';

import ProductCard from '@/components/modules/cards/product-card';
import Spinner from '@/components/shared/Spinner';
import { useGetAllProductsQuery } from '@/redux/features/product/productApi';

const Products = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  const products = data?.data || [];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product}></ProductCard>
      ))}
    </div>
  );
};

export default Products;
