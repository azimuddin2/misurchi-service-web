'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Filter, CircleX } from 'lucide-react';
import { useGetAllProductTypeQuery } from '@/redux/features/productType/productTypeApi';

export default function FilterSidebar() {
  const [price, setPrice] = useState<[number, number]>([0, 5000]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecommended, setSelectedRecommended] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Utility to update URL query params
  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // remove old values
    params.delete(key);

    // add new values
    values.forEach((v) => params.append(key, v));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (vals: string[]) => void,
    queryKey: string,
  ) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(newSelected);
    updateQueryParam(queryKey, newSelected);
  };

  const recommendedOptions = [
    'All',
    'Special Offer',
    'New Arrivals',
    'Most Popular',
    'Black Friday Deal',
    'Top Rated',
  ];

  const discounts = [
    'All',
    '10% - 20% Off',
    '20% - 30% Off',
    '30% - 40% Off',
    '40% - 50% Off',
    '50% Above',
  ];

  const { data } = useGetAllProductTypeQuery({});
  const productTypes = data?.data || [];

  return (
    <>
      {/* Mobile toggle */}
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
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:shadow-none md:w-64 md:block
        `}
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
            <h2 className="text-lg font-semibold mb-3">Product Types</h2>
            {productTypes.map((type: any) => (
              <div key={type._id} className="flex items-center gap-2 mb-1">
                <Checkbox
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

          {/* Price */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Price</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>${price[0]}</span>
              <span>${price[1]}</span>
            </div>
            <Slider
              max={5000}
              step={5}
              value={price}
              onValueChange={(value: any) => {
                const priceRange = `${value[0]}-${value[1]}`;
                setPrice(value);
                updateQueryParam('price', [priceRange]);
              }}
              className="w-full"
            />
          </div>

          {/* Discount */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Discount</h2>
            {discounts.map((discount) => (
              <div key={discount} className="flex items-center gap-2 mb-1">
                <Checkbox
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
