'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPinIcon } from 'lucide-react';

import ServiceCard from '@/components/modules/cards/service-card';
import FilterSidebar from './filter-sidebar';
import Spinner from '@/components/shared/Spinner';
import MSWPagination from '@/components/ui/core/MSWPagination';
import { useGetAllServicesQuery } from '@/redux/features/service/serviceApi';
import { TService } from '@/types/service.type';
import Image from 'next/image';

const AllServices = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('searchTerm') || '');

  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '9';

  // ✅ lat/lng
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // ✅ check nearby active
  const isNearbyActive = useMemo(() => Boolean(lat && lng), [lat, lng]);

  // ✅ query params
  const queryParams = {
    searchTerm: searchParams.get('searchTerm') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minDiscount: searchParams.get('minDiscount') || '',
    maxDiscount: searchParams.get('maxDiscount') || '',
    recommended: searchParams.get('recommended') || '',
    isOnSale: searchParams.get('isOnSale') || '',
    sortBy: searchParams.get('sortBy') || '',

    // ✅ nearby
    ...(lat && lng ? { lat: String(lat), lng: String(lng) } : {}),
  };

  const { data, isLoading, isFetching } = useGetAllServicesQuery({
    page,
    limit,
    query: queryParams,
  });

  const services = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  // ✅ SEARCH
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set('searchTerm', search);
    else params.delete('searchTerm');

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  }, [router, search, searchParams]);

  // ✅ GET LOCATION
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('lat', String(position.coords.latitude));
        params.set('lng', String(position.coords.longitude));

        if (search) params.set('searchTerm', search);
        else params.delete('searchTerm');

        params.set('page', '1');

        router.push(`?${params.toString()}`);
      },
      (error) => {
        alert(error.message);
      },
    );
  };

  // ✅ CLEAR NEARBY
  const clearNearby = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('lat');
    params.delete('lng');
    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  if (isLoading) return <Spinner />;

  return (
    <div className="mb-10">
      <div className="block lg:flex gap-10 mt-5">
        {/* FILTER */}
        <div className="w-80">
          <FilterSidebar />
        </div>

        {/* MAIN */}
        <div className="w-full lg:mb-0">
          {/* SEARCH + NEARBY */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="flex items-center w-3/4">
              <div className="relative w-full">
                <div className="flex items-center bg-white border rounded-full shadow-md overflow-hidden">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search service here..."
                    className="w-full px-6 py-4 outline-none text-sm"
                  />

                  <button
                    onClick={handleSearch}
                    className="bg-sky-950 hover:bg-sky-900 text-white p-4 rounded-full m-1 transition cursor-pointer"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* NEARBY BUTTON */}
            <div className="flex items-center gap-4 w-1/4">
              <button
                onClick={!isNearbyActive ? getLocation : clearNearby}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-full transition text-sm cursor-pointer
                  ${
                    !isNearbyActive
                      ? 'text-sky-700 border-sky-700 hover:bg-sky-50'
                      : 'text-red-600 border-red-400 hover:bg-red-50'
                  }
                `}
              >
                <MapPinIcon size={18} />

                <span className="font-medium">
                  {!isNearbyActive
                    ? 'Find Services Near My Location'
                    : 'Clear Nearby'}
                </span>
              </button>

              {isNearbyActive && (
                <span className="text-xs text-green-600">● ON</span>
              )}
            </div>
          </div>

          {/* Product List */}
          <div className="relative">
            {/* Loading overlay */}
            {isFetching && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 z-0 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <Spinner />
              </div>
            )}

            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 transition-opacity duration-300 ${
                isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'
              }`}
            >
              {services.length > 0
                ? services.map((service: TService) => (
                    <ServiceCard key={service._id} service={service} />
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
                        No services found
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

      {/* PAGINATION */}
      <MSWPagination totalPage={meta.totalPage} />
    </div>
  );
};

export default AllServices;
