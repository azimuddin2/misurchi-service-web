'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import FilterSidebar from './filter-sidebar';
import ProductCard from '@/components/modules/cards/product-card';
import MSWPagination from '@/components/ui/core/MSWPagination';
import Spinner from '@/components/shared/Spinner';
import { useGetAllProductsQuery } from '@/redux/features/product/productApi';
import { TProduct } from '@/types/product.type';
import Image from 'next/image';

const AllProducts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('searchTerm') || '');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '9';

  // Safe decode function
  const safeDecode = (str: string) => {
    try {
      return decodeURIComponent(str);
    } catch {
      return str; // fallback if not properly encoded
    }
  };

  const queryObj = useMemo(() => {
    const q: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
      if (!value) return;

      if (key === 'productType' || key === 'recommended') {
        q[key] = value.split(',').map((v) => safeDecode(v));
      } else {
        q[key] = safeDecode(value);
      }
    });

    return q;
  }, [searchParams]);

  const { data, isLoading } = useGetAllProductsQuery({
    page,
    limit,
    query: queryObj,
  });
  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set('searchTerm', search);
    else params.delete('searchTerm');
    params.set('page', '1'); // reset page
    router.push(`?${params.toString()}`);
  }, [router, search, searchParams]);

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  if (isLoading) return <Spinner />;

  return (
    <div className="mb-10">
      <div className="block lg:flex gap-10 mt-5">
        {/* Filters */}
        <div className="w-80">
          <FilterSidebar />
        </div>

        {/* Product list */}
        <div className="w-full lg:mb-0">
          {/* Search bar */}
          <div className="flex items-center w-full lg:w-4/5 mx-auto">
            <div className="relative w-full">
              <div className="flex items-center bg-white border rounded-full shadow-md overflow-hidden">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search product here..."
                  className="w-full px-6 py-4 outline-none text-sm"
                />

                <button
                  onClick={handleSearch}
                  className="bg-sky-950 hover:bg-sky-900 text-white p-4 rounded-full m-1 transition"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {products.length > 0 ? (
              products.map((product: TProduct) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full h-screen text-center text-gray-500 my-20">
                <Image
                  src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  alt="No results"
                  width={100}
                  height={100}
                  className="mx-auto w-40"
                />
                <p className="capitalize">
                  No Porduct found. Try changing your search keywords or filter
                  options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <MSWPagination totalPage={meta.totalPage} />
    </div>
  );
};

export default AllProducts;
