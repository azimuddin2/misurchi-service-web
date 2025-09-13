import React, { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function CountryStateCitySelector({
  control,
  userAddress,
  setValue,
}: any) {
  const [allData, setAllData] = useState<any[]>([]);
  const [statesOfCountry, setStatesOfCountry] = useState<any[]>([]);
  const [citiesOfState, setCitiesOfState] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>(
    userAddress?.country || '',
  );
  const [selectedState, setSelectedState] = useState<string>(
    userAddress?.state || '',
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    userAddress?.city || '',
  );

  // Fetch countries data
  useEffect(() => {
    fetch('/data/countries-states-cities.json')
      .then((res) => res.json())
      .then((data) => setAllData(data))
      .catch((err) => console.error('Failed to load countries data', err));
  }, []);

  const memoizedAllCountries = useMemo(() => allData, [allData]);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryData = memoizedAllCountries.find(
        (c: any) =>
          c.name.trim().toLowerCase() === selectedCountry.trim().toLowerCase(),
      );
      setStatesOfCountry(countryData?.states || []);
    } else {
      setStatesOfCountry([]);
    }

    // Reset state and city when country changes
    setSelectedState('');
    setSelectedCity('');
    setCitiesOfState([]);
    setValue('state', '');
    setValue('city', '');
  }, [selectedCountry, memoizedAllCountries, setValue]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState && statesOfCountry.length > 0) {
      const stateData = statesOfCountry.find(
        (s: any) =>
          s.name.trim().toLowerCase() === selectedState.trim().toLowerCase(),
      );

      // Normalize cities: string or object
      const cities =
        stateData?.cities?.map((c: any) =>
          typeof c === 'string' ? c : c.name,
        ) || [];

      setCitiesOfState(cities);
    } else {
      setCitiesOfState([]);
    }

    setSelectedCity('');
    setValue('city', '');
  }, [selectedState, statesOfCountry, setValue]);

  // Initialize form values from userAddress
  useEffect(() => {
    if (userAddress) {
      setSelectedCountry(userAddress.country || '');
      setSelectedState(userAddress.state || '');
      setSelectedCity(userAddress.city || '');
      setValue('country', userAddress.country || '');
      setValue('state', userAddress.state || '');
      setValue('city', userAddress.city || '');
    }
  }, [userAddress, setValue]);

  return (
    <div className="">
      {/* Country */}
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Select
                value={selectedCountry}
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedCountry(val);
                }}
              >
                <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {memoizedAllCountries.map((country: any) => (
                    <SelectItem key={country.name} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        {/* State */}
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Select
                  value={selectedState}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedState(val);
                  }}
                  disabled={!selectedCountry || statesOfCountry.length === 0}
                >
                  <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesOfCountry.length > 0 ? (
                      statesOfCountry.map((state: any) => (
                        <SelectItem key={state.name} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-states-found" disabled>
                        No states found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Select
                  value={selectedCity}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedCity(val);
                  }}
                  disabled={!selectedState || citiesOfState.length === 0}
                >
                  <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesOfState.length > 0 ? (
                      citiesOfState.map((city: any) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-cities-found" disabled>
                        No cities found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
