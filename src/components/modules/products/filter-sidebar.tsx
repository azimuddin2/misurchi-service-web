'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Filter, CircleX } from 'lucide-react';
import { useGetAllProductTypeQuery } from '@/redux/features/productType/productTypeApi';

export default function FilterSidebar() {
  const [price, setPrice] = useState<[number, number]>([0, 5000]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecommended, setSelectedRecommended] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const recommendedOptions = [
    'All',
    'Special Offer',
    'New Arrivals',
    'Black Friday Deal',
    'Top Rated',
  ];

  const discounts = [
    '10% - 20% Off',
    '20% - 30% Off',
    '30% - 40% Off',
    '40% - 50% Off',
    '50% Above',
  ];

  const { data } = useGetAllProductTypeQuery({});
  const productTypes = data?.data || [];

  // ----------------------
  // Update URL Query Params
  // ----------------------
  const updateQueryParam = (key: string, values: string[] | string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!values || (Array.isArray(values) && values.length === 0)) {
      params.delete(key);
    } else {
      if (Array.isArray(values)) {
        params.set(key, values.join(',')); // multi-select stored as comma-separated
      } else {
        params.set(key, values);
      }
    }

    params.set('page', '1'); // reset page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ----------------------
  // Toggle multi-select
  // ----------------------
  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (vals: string[]) => void,
    queryKey: string,
  ) => {
    let newSelected: string[];

    if (value === 'All') {
      newSelected = [];
    } else {
      if (selected.includes(value)) {
        newSelected = selected.filter((v) => v !== value);
      } else {
        newSelected = [...selected.filter((v) => v !== 'All'), value];
      }
    }

    setSelected(newSelected);
    updateQueryParam(queryKey, newSelected.length > 0 ? newSelected : null);
  };

  // ----------------------
  // Apply Price Filter
  // ----------------------
  const handleApplyPrice = () => {
    if (minPrice && maxPrice && Number(minPrice) <= Number(maxPrice)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', minPrice);
      params.set('maxPrice', maxPrice);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // ----------------------
  // Initialize from URL
  // ----------------------
  useEffect(() => {
    const sp = Object.fromEntries(Array.from(searchParams.entries()));

    // Price
    if (sp.minPrice && sp.maxPrice) {
      setMinPrice(sp.minPrice);
      setMaxPrice(sp.maxPrice);
      setPrice([Number(sp.minPrice), Number(sp.maxPrice)]);
    }

    // Multi-select fields
    setSelectedProducts(sp.productType?.split(',') || []);
    setSelectedRecommended(sp.recommended?.split(',') || []);
    setSelectedDiscounts(sp.discount?.split(',') || []);
  }, [searchParams]);

  // ----------------------
  // Render
  // ----------------------
  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full p-5 rounded-full"
        >
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none md:w-64 md:block`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2 p-4 border-b">
          <h2 className="text-xl font-semibold">Filter</h2>
          <div className="flex items-center gap-2">
            {searchParams.toString().length > 0 && (
              <Button
                onClick={() => router.push(pathname, { scroll: false })}
                size="sm"
                className="bg-red-400 hover:bg-red-500 text-white rounded flex items-center gap-1"
              >
                Clear <CircleX size={20} />
              </Button>
            )}
            <button className="md:hidden p-2" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] md:h-auto md:overflow-visible">
          {/* Recommended */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Recommended</h2>
            {recommendedOptions.map((item) => (
              <div key={item} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedRecommended.includes(item)}
                  onCheckedChange={() =>
                    toggleSelection(
                      item,
                      selectedRecommended,
                      setSelectedRecommended,
                      'recommended',
                    )
                  }
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

          {/* Product Types */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Product Category</h2>
            {productTypes.map((type: any) => (
              <div key={type._id} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedProducts.includes(type.name)}
                  onCheckedChange={() =>
                    toggleSelection(
                      type.name,
                      selectedProducts,
                      setSelectedProducts,
                      'productType',
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
                className="border rounded px-2 py-1 w-1/2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-900"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded px-2 py-1 w-1/2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-900"
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
            {discounts.map((discount) => (
              <div key={discount} className="flex items-center gap-2 mb-1">
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedDiscounts.includes(discount)}
                  onCheckedChange={() =>
                    toggleSelection(
                      discount,
                      selectedDiscounts,
                      setSelectedDiscounts,
                      'discount',
                    )
                  }
                  id={`disc-${discount}`}
                />
                <label
                  htmlFor={`disc-${discount}`}
                  className="text-sm text-gray-700"
                >
                  {discount}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
