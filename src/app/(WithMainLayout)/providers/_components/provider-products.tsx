'use client';

import ProductCard from '@/components/modules/cards/product-card';
import FilterSidebar from '@/components/modules/products/filter-sidebar';
import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetAllProductsByUserQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  vendorId: string;
};

const ProviderProducts = ({ vendorId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 9;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading, isFetching } = useGetAllProductsByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
    },
  });

  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const updateSearchParams = useCallback(
    (newParams: Record<string, string | null | undefined>) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!value) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = () => {
    updateSearchParams({ searchTerm: search, page: '1' });
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mb-10 container px-3 lg:mx-auto">
      <div className="block lg:flex gap-10 mt-5">
        <div className="w-full lg:mb-0">
          <div className="lg:w-1/2 mx-auto relative">
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product here..."
                className="w-full px-6 py-3 outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-sky-950 text-white p-4 rounded-full absolute right-0"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Product list */}
          <div className="relative">
            {/* Loading overlay - filter change */}
            {isFetching && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 z-0 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <Spinner />
              </div>
            )}

            {/* Product grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 transition-opacity duration-300 ${
                isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}
            >
              {products.length > 0
                ? products.map((product: TProduct) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                : !isFetching && (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
                      <Image
                        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        alt="No results"
                        width={160}
                        height={160}
                        className="mb-6 opacity-80"
                      />
                      <p className="text-base font-medium text-gray-500">
                        No product found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search keywords or filter options.
                      </p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ProviderProducts;
