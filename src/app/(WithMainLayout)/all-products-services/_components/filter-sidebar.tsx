'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Filter } from 'lucide-react';

export default function FilterSidebar() {
  const [price, setPrice] = useState([0, 500]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearchQuery = (query: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(query, value.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filter options
  const recommended = [
    'All',
    'Special Offer',
    'New Arrivals',
    'Most Popular',
    'Black Friday Deal',
    'Top Rated',
  ];

  const serviceTypes = [
    'Beauty & Personal Care',
    'Health & Wellness',
    'Home Services',
    'Event Services',
    'Education & Tutoring',
    'Pet Services',
    'Photography & Videography',
    'Baking Services',
    'Catering & Food Services',
    'Cleaning',
  ];

  const productTypes = [
    'Fitness Equipment',
    'Electronics',
    'Fashion & Apparel',
    'Home Goods',
    'Beauty & Personal Care Products',
    'Sports & Outdoors',
    'Toys & Games',
    'Food & Beverage',
    'Arts & Crafts',
    'Health & Fitness Products',
    'Books & Media',
  ];

  const discounts = ['All', '10% - 20% Off', '20% - 30% Off', '30% Above'];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4 ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 w-full p-5 rounded-full"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Sidebar (desktop always visible) */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:shadow-none md:w-64 md:block
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-4 border-b">
          <h2 className="text-xl font-semibold">Filter</h2>
          <div className="flex items-center gap-2">
            {searchParams.toString().length > 0 && (
              <Button
                onClick={() => {
                  router.push(`${pathname}`, { scroll: false });
                }}
                size="sm"
                className="bg-black hover:bg-gray-700 text-white"
              >
                Clear
              </Button>
            )}
            {/* Close button (only mobile) */}
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
            <RadioGroup
              onValueChange={(val) => handleSearchQuery('recommended', val)}
            >
              {recommended.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <RadioGroupItem value={item} id={`rec-${item}`} />
                  <Label
                    htmlFor={`rec-${item}`}
                    className="text-sm text-gray-700"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Service Types */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Service Types</h2>
            <RadioGroup
              onValueChange={(val) => handleSearchQuery('service', val)}
            >
              {serviceTypes.map((service) => (
                <div key={service} className="flex items-center gap-2">
                  <RadioGroupItem value={service} id={`service-${service}`} />
                  <Label
                    htmlFor={`service-${service}`}
                    className="text-sm text-gray-700"
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Product Types */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Product Types</h2>
            <RadioGroup
              onValueChange={(val) => handleSearchQuery('product', val)}
            >
              {productTypes.map((product) => (
                <div key={product} className="flex items-center gap-2">
                  <RadioGroupItem value={product} id={`product-${product}`} />
                  <Label
                    htmlFor={`product-${product}`}
                    className="text-sm text-gray-700"
                  >
                    {product}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Price</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>${price[0]}</span>
              <span>${price[1]}</span>
            </div>
            <Slider
              max={500}
              step={5}
              value={price}
              onValueChange={(value) => {
                setPrice(value);
                handleSearchQuery('price', `${value[0]}-${value[1]}`);
              }}
              className="w-full"
            />
          </div>

          {/* Discount */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Discount</h2>
            <RadioGroup
              onValueChange={(val) => handleSearchQuery('discount', val)}
            >
              {discounts.map((discount) => (
                <div key={discount} className="flex items-center gap-2">
                  <RadioGroupItem value={discount} id={`disc-${discount}`} />
                  <Label
                    htmlFor={`disc-${discount}`}
                    className="text-sm text-gray-700"
                  >
                    {discount}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
