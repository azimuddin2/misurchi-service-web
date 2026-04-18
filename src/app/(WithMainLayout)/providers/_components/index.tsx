'use client';

import { Switch } from '@/components/ui/switch';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ProviderCard from './provider-card';
import { TVendorUser } from '@/types';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetAllVendorUserQuery } from '@/redux/features/vendor/vendorApi';
import Spinner from '@/components/shared/Spinner';
import Image from 'next/image';

const Providers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );
  const [topRated, setTopRated] = useState<boolean>(
    searchParams.get('topRated') === 'true',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 12;
  const searchTerm = searchParams.get('searchTerm') || '';
  const topRatedParam = searchParams.get('topRated') === 'true';

  const { data, isLoading, isFetching } = useGetAllVendorUserQuery({
    page,
    limit,
    query: {
      searchTerm,
      topRated: topRatedParam ? 'true' : undefined,
    },
  });

  const vendors = data?.data || [];
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

  const handleTopRatedToggle = (checked: boolean) => {
    setTopRated(checked);
    updateSearchParams({ topRated: checked ? 'true' : null, page: '1' });
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
    setTopRated(searchParams.get('topRated') === 'true');
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="w-full lg:w-2/3 mt-6 lg:my-6">
            <div className="flex items-center rounded-full overflow-hidden shadow relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search here..."
                className="w-full px-6 pr-16 py-3 outline-none text-base lg:text-lg text-gray-700"
              />
              <button
                onClick={handleSearch}
                className="bg-sky-950 text-white p-4 rounded-full absolute right-0"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Top Rated Providers */}
          <div className="w-full lg:w-auto lg:min-w-[300px] rounded-full border border-gray-200 bg-gradient-to-t from-[#c0eae5] to-[#d6fbf7] px-6 py-3 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm lg:text-base font-semibold text-gray-700">
                Top Rated Providers
              </p>
              <Switch
                checked={topRated}
                onCheckedChange={handleTopRatedToggle}
                className="data-[state=checked]:bg-green-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
              <Spinner />
            </div>
          )}

          {/* Empty State */}
          {!isFetching && vendors?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Image
                src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                alt="No results"
                width={100}
                height={100}
                className="mx-auto w-32 mt-10"
              />
              <p className="text-gray-500 text-lg font-medium">
                No vendors found
              </p>
              <p className="text-gray-400 text-sm">
                Try changing your search or filters
              </p>
            </div>
          )}

          {/* Vendor grid */}
          {vendors?.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5  mb-12 transition-opacity duration-300 ${
                isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}
            >
              {vendors.map((vendor: TVendorUser) => (
                <ProviderCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta?.totalPage > 1 && (
          <div className="flex justify-center pb-10">
            <MSWPagination totalPage={meta?.totalPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;
