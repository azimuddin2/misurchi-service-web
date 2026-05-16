'use client';

import ProductCard from '@/components/modules/cards/product-card';
import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetAllProductsByUserQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import { Search, X } from 'lucide-react';
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
  const limit = searchParams.get('limit') || 8;
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
          <div className="flex items-center w-full lg:w-4/5 mx-auto">
            <div className="lg:w-3/5 w-full mx-auto relative">
              <div className="flex items-center bg-white border rounded-full shadow-md overflow-hidden">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by product name..."
                  className="w-full px-6 py-3 outline-none text-base"
                />

                {/* ✅ Clear button */}
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.delete('searchTerm');
                      params.set('page', '1');
                      router.push(`?${params.toString()}`);
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 p-1 rounded-full mr-2 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={handleSearch}
                  className="bg-sky-950 hover:bg-sky-900 text-white p-3 rounded-full m-1 transition"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
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
                      <p className="text-base font-medium text-gray-500 capitalize">
                        No product found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try changing your search keywords.
                      </p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 && <MSWPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default ProviderProducts;
