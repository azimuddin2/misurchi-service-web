'use client';

import ProductCard from '@/components/modules/cards/product-card';
import Spinner from '@/components/shared/Spinner';
import { useGetAllProductsQuery } from '@/redux/features/product/productApi';
import FilterSidebar from './filter-sidebar';
import { TProduct } from '@/types/product.type';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useSearchParams } from 'next/navigation';

const AllProducts = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 3;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading, refetch } = useGetAllProductsQuery({
    page,
    limit,
    query: {
      searchTerm,
    },
  });

  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mb-10">
      <div className="block lg:flex gap-10 mt-10">
        <div className="w-80">
          <FilterSidebar />
        </div>
        <div className="w-full lg:mb-0">
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <input
                // value={searchInputValue}
                // onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // handleSearch();
                  }
                }}
                type="text"
                placeholder="Search Service or Products"
                className="w-full px-6 py-3 outline-none"
              />
              <button className="bg-sky-950 text-white p-4 rounded-full absolute right-0">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {products.length > 0 ? (
              products.map((product: TProduct) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full h-screen text-center text-gray-500">
                No listings found matching your search.
              </p>
            )}
          </div>
        </div>
      </div>

      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default AllProducts;
