'use client';

import { Switch } from '@/components/ui/switch';
import { useGetAllVendorUserQuery } from '@/redux/features/user/userApi';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ProviderCard from './provider-card';
import { TVendorUser } from '@/types';
import MSWPagination from '@/components/ui/core/MSWPagination';

const Providers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 12;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading } = useGetAllVendorUserQuery({
    page,
    limit,
    query: {
      searchTerm,
    },
  });

  const vendors = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  // search & createdAt date filtering part
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

  return (
    <div className="container mx-2 lg:mx-auto">
      <div className="lg:flex items-center justify-between">
        {/* Search */}
        <div className="lg:w-2/3 mb-4 my-8">
          <div className="flex items-center rounded-full overflow-hidden shadow relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search here..."
              className="w-full px-6 py-3 outline-none text-lg text-gray-700"
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
        <div className="lg:w-1/4 rounded-full border border-gray-200 bg-gradient-to-t from-[#c0eae5] to-[#d6fbf7] px-6 py-4 shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-700">
              Top Rated Providers
            </p>
            <Switch className="data-[state=checked]:bg-[#3DB39E]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-8 mx-3">
        {vendors?.map((vendor: TVendorUser) => (
          <ProviderCard key={vendor._id} vendor={vendor} />
        ))}
      </div>

      <MSWPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default Providers;
