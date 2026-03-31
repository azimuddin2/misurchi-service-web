'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Filter, X, CircleX } from 'lucide-react';
import { useGetAllServiceTypeQuery } from '@/redux/features/serviceType/serviceTypeApi';

export default function FilterSidebar() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [selectedRecommended, setSelectedRecommended] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data } = useGetAllServiceTypeQuery({});
  const serviceTypes = data?.data || [];

  const recommendedOptions = [
    'All',
    'Special Offer',
    'New Arrivals',
    'Most Popular',
    'Black Friday Deal',
    'Top Rated',
  ];

  // Discount options (values as min-max)
  const discountOptions = [
    { label: '10%-20% Off', value: '10-20' },
    { label: '20%-30% Off', value: '20-30' },
    { label: '30%-40% Off', value: '30-40' },
    { label: '40%-50% Off', value: '40-50' },
    { label: '50%+ Off', value: '50-100' },
  ];

  // Update query params
  const updateQuery = (key: string, values: string[] | string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!values || (Array.isArray(values) && values.length === 0)) {
      params.delete(key);
    } else {
      params.delete(key);
      if (Array.isArray(values)) {
        params.set(key, values.join(','));
      } else {
        params.set(key, values);
      }
    }

    params.set('page', '1'); // reset page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Toggle type selection
  const toggleSelect = (
    value: string,
    selected: string[],
    setSelected: (vals: string[]) => void,
    queryKey: string,
  ) => {
    let newSelected;
    if (selected.includes(value)) {
      newSelected = selected.filter((v) => v !== value);
    } else {
      newSelected = [...selected, value];
    }
    setSelected(newSelected);
    updateQuery(queryKey, newSelected.length ? newSelected : null);
  };

  // Toggle discount selection
  const toggleDiscount = (value: string) => {
    let newSelected;
    if (selectedDiscounts.includes(value)) {
      newSelected = selectedDiscounts.filter((v) => v !== value);
    } else {
      newSelected = [value]; // single selection
    }
    setSelectedDiscounts(newSelected);

    const params = new URLSearchParams(searchParams.toString());
    if (newSelected.length === 0) {
      params.delete('minDiscount');
      params.delete('maxDiscount');
    } else {
      const [min, max] = newSelected[0].split('-');
      params.set('minDiscount', min);
      params.set('maxDiscount', max);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Toggle recommended selection
  const toggleRecommended = (value: string) => {
    let newSelected;
    if (selectedRecommended.includes(value)) {
      newSelected = selectedRecommended.filter((v) => v !== value);
    } else {
      newSelected =
        value === 'All'
          ? []
          : [...selectedRecommended.filter((v) => v !== 'All'), value];
    }
    setSelectedRecommended(newSelected);
    updateQuery('recommended', newSelected.length ? newSelected : null);
  };

  // Apply price filter
  const handleApplyPrice = () => {
    if (minPrice && maxPrice && Number(minPrice) <= Number(maxPrice)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', minPrice);
      params.set('maxPrice', maxPrice);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // Initialize from URL
  useEffect(() => {
    const sp = Object.fromEntries(searchParams.entries());
    setMinPrice(sp.minPrice || '');
    setMaxPrice(sp.maxPrice || '');
    setSelectedType(sp.type ? sp.type.split(',') : []);
    setSelectedDiscounts(
      sp.minDiscount && sp.maxDiscount
        ? [`${sp.minDiscount}-${sp.maxDiscount}`]
        : [],
    );
    setSelectedRecommended(sp.recommended ? sp.recommended.split(',') : []);
  }, [searchParams]);

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full p-5 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none md:w-64 md:block`}
      >
        <div className="flex justify-between items-center mb-2 p-4 border-b">
          <h2 className="text-xl font-semibold">Filter</h2>
          <div className="flex items-center gap-2">
            {searchParams.toString().length > 0 && (
              <Button
                onClick={() => router.push(pathname, { scroll: false })}
                size="sm"
                className="bg-red-400 hover:bg-red-500 text-white rounded flex items-center gap-1 cursor-pointer"
              >
                Clear <CircleX size={20} />
              </Button>
            )}
            <button className="md:hidden p-2" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] md:h-auto md:overflow-visible">
          {/* Recommended */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Recommended</h2>
            {recommendedOptions.map((item) => (
              <div key={item} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedRecommended.includes(item)}
                  onCheckedChange={() => toggleRecommended(item)}
                  id={`rec-${item}`}
                />
                <label
                  htmlFor={`rec-${item}`}
                  className="text-sm text-gray-700"
                >
                  {item}
                </label>
              </div>
            ))}
          </div>

          {/* Service Type */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Service Category</h2>
            {serviceTypes.map((type: any) => (
              <div key={type._id} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedType.includes(type.name)}
                  onCheckedChange={() =>
                    toggleSelect(
                      type.name,
                      selectedType,
                      setSelectedType,
                      'type',
                    )
                  }
                  id={type.name}
                />
                <label htmlFor={type.name} className="text-sm text-gray-700">
                  {type.name}
                </label>
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Price Range</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded px-2 py-1 w-1/2 text-sm"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded px-2 py-1 w-1/2 text-sm"
              />
            </div>
            <Button
              onClick={handleApplyPrice}
              className="mt-3 w-full bg-sky-900 hover:bg-sky-950 text-white text-sm rounded-sm cursor-pointer"
              disabled={
                !minPrice || !maxPrice || Number(minPrice) > Number(maxPrice)
              }
            >
              Apply
            </Button>
          </div>

          {/* Discount */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Discount</h2>
            {discountOptions.map((item) => (
              <div key={item.value} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedDiscounts.includes(item.value)}
                  onCheckedChange={() => toggleDiscount(item.value)}
                  id={item.value}
                />
                <label htmlFor={item.value} className="text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
