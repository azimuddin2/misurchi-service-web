'use client';

import ServiceCard from '@/components/modules/cards/service-card';
import Spinner from '@/components/shared/Spinner';
import { useGetAllServicesQuery } from '@/redux/features/service/serviceApi';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from './filter-sidebar';
import { Search } from 'lucide-react';
import { TService } from '@/types/service.type';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useCallback, useEffect, useState } from 'react';

const AllServices = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 6;
  const searchTerm = searchParams.get('searchTerm') || '';

  const { data, isLoading } = useGetAllServicesQuery({
    page,
    limit,
    query: {
      searchTerm,
    },
  });

  const services = data?.data || [];
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
    <div className="mb-10">
      <div className="block lg:flex gap-10 mt-5">
        <div className="w-80">
          <FilterSidebar />
        </div>
        <div className="w-full lg:mb-0">
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Service or Products"
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
            {services?.length > 0 ? (
              services?.map((service: TService) => (
                <ServiceCard key={service._id} service={service} />
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

export default AllServices;
