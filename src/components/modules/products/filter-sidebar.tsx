'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Filter, CircleX } from 'lucide-react';
import { useGetAllProductTypeQuery } from '@/redux/features/productType/productTypeApi';
import { useGetAllRecommendedTypeQuery } from '@/redux/features/recommendedType/recommendedTypeApi';

// Special keys that need custom backend handling (not passed as 'recommended' filter)
const SPECIAL_RECOMMENDED = ['All', 'Special Offer', 'Top Rated'];

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

  // Fetch dynamic recommended types from API (e.g. "New Arrivals", "Black Friday Deal" etc.)
  const { data: recommendedData } = useGetAllRecommendedTypeQuery({});
  const dynamicRecommended: { _id: string; name: string }[] =
    recommendedData?.data || [];

  // Final list: "All" first, then "Special Offer", then dynamic ones, then "Top Rated" last
  const recommendedOptions = [
    'All',
    'Special Offer',
    ...dynamicRecommended.map((r) => r.name),
    'Top Rated',
  ];

  const { data } = useGetAllProductTypeQuery({});
  const productTypes = data?.data || [];

  const discounts = [
    '10% - 20% Off',
    '20% - 30% Off',
    '30% - 40% Off',
    '40% - 50% Off',
    '50% Above',
  ];

  // ----------------------
  // Update URL Query Params
  // ----------------------
  const updateQueryParam = (
    updates: Record<string, string[] | string | null>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, values]) => {
      if (!values || (Array.isArray(values) && values.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(values)) {
        params.set(key, values.join(','));
      } else {
        params.set(key, values);
      }
    });

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ----------------------
  // Toggle Recommended (with special logic)
  // ----------------------
  const toggleRecommended = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'All') {
      // Clear all recommended-related filters
      params.delete('recommended');
      params.delete('isOnSale');
      params.delete('sortBy');
      params.set('page', '1');
      setSelectedRecommended([]);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    let newSelected: string[];

    if (selectedRecommended.includes(value)) {
      newSelected = selectedRecommended.filter((v) => v !== value);
    } else {
      newSelected = [...selectedRecommended.filter((v) => v !== 'All'), value];
    }

    setSelectedRecommended(newSelected);

    // Separate special vs dynamic recommended values
    const specialSelected = newSelected.filter((v) =>
      SPECIAL_RECOMMENDED.includes(v),
    );
    const dynamicSelected = newSelected.filter(
      (v) => !SPECIAL_RECOMMENDED.includes(v),
    );

    const updates: Record<string, string[] | string | null> = {};

    // "Special Offer" → send isOnSale=true to backend
    if (specialSelected.includes('Special Offer')) {
      updates['isOnSale'] = 'true';
    } else {
      updates['isOnSale'] = null;
    }

    // "Top Rated" → send sortBy=rating to backend
    if (specialSelected.includes('Top Rated')) {
      updates['sortBy'] = 'rating';
    } else {
      updates['sortBy'] = null;
    }

    // Dynamic recommended options go through normal 'recommended' param
    updates['recommended'] =
      dynamicSelected.length > 0 ? dynamicSelected : null;

    updateQueryParam(updates);
  };

  // ----------------------
  // Toggle multi-select (product types & discounts)
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
    updateQueryParam({
      [queryKey]: newSelected.length > 0 ? newSelected : null,
    });
  };

  // ----------------------
  // Apply Price Filter
  // ----------------------
  const handleApplyPrice = () => {
    if (minPrice && maxPrice && Number(minPrice) <= Number(maxPrice)) {
      updateQueryParam({ minPrice, maxPrice });
    }
  };

  // ----------------------
  // Initialize from URL
  // ----------------------
  useEffect(() => {
    const sp = Object.fromEntries(Array.from(searchParams.entries()));

    if (sp.minPrice && sp.maxPrice) {
      setMinPrice(sp.minPrice);
      setMaxPrice(sp.maxPrice);
      setPrice([Number(sp.minPrice), Number(sp.maxPrice)]);
    }

    // Rebuild selectedRecommended from URL
    const urlRecommended = sp.recommended?.split(',') || [];
    const specialFromUrl: string[] = [];
    if (sp.isOnSale === 'true') specialFromUrl.push('Special Offer');
    if (sp.sortBy === 'rating') specialFromUrl.push('Top Rated');

    setSelectedRecommended([...specialFromUrl, ...urlRecommended]);
    setSelectedProducts(sp.productType?.split(',') || []);
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
                className="bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 rounded-sm flex items-center gap-1 cursor-pointer"
              >
                <X size={20} />
                <span>Clear Filter</span>
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
                  checked={
                    item === 'All'
                      ? selectedRecommended.length === 0
                      : selectedRecommended.includes(item)
                  }
                  onCheckedChange={() => toggleRecommended(item)}
                  id={`rec-${item}`}
                />
                <label
                  htmlFor={`rec-${item}`}
                  className="text-sm text-gray-700 cursor-pointer"
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
                <label
                  htmlFor={type.name}
                  className="text-sm text-gray-700 cursor-pointer"
                >
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
                  className="text-sm text-gray-700 cursor-pointer"
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
