'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const BusinessPreferences = () => {
  const [preference, setPreference] = useState<string>('both');

  const handleChange = (value: string) => {
    setPreference(value);
  };

  return (
    <div className="mt-5">
      <h2 className="text-base font-medium text-gray-800 mb-3">
        Business Preferences
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <div className="flex items-center gap-3">
          <Checkbox
            id="services-only"
            checked={preference === 'services'}
            onCheckedChange={() => handleChange('services')}
          />
          <Label htmlFor="services-only">Services Only</Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="both"
            checked={preference === 'both'} // ✅ default selected
            onCheckedChange={() => handleChange('both')}
          />
          <Label htmlFor="both">Both Services & Products</Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="products-only"
            checked={preference === 'products'}
            onCheckedChange={() => handleChange('products')}
          />
          <Label htmlFor="products-only">Products Only</Label>
        </div>
      </div>
    </div>
  );
};

export default BusinessPreferences;
