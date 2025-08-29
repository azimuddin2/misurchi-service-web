'use client';

import ProductCard from '@/components/modules/cards/product-card';
import FilterSidebar from '@/components/modules/products/filter-sidebar';
import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetAllProductsByUserQuery } from '@/redux/features/product/productApi';
import { IUser } from '@/types';
import { TProduct } from '@/types/product.type';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  user: IUser | undefined;
};

const ProviderProducts = ({ user }: Props) => {
  const userId = user?._id as string;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 9;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading } = useGetAllProductsByUserQuery({
    userId,
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
    <div className="mb-10 container mx-auto">
      <div className="block lg:flex gap-10 mt-5">
        <div className="w-80">
          <FilterSidebar />
        </div>

        <div className="w-full lg:mb-0">
          <div className=" relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {products.length > 0 ? (
              products.map((product: TProduct) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full h-screen text-center text-gray-500">
                No product found matching your search.
              </p>
            )}
          </div>
        </div>
      </div>

      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default ProviderProducts;
