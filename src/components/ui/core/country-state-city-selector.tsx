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
// import { Input } from '@/components/ui/input';

export default function CountryStateCitySelector({
  control,
  userAddress,
  setValue,
}: any) {
  const [allData, setAllData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState<any>(
    userAddress?.country,
  );
  const [selectedState, setSelectedState] = useState<any>(userAddress?.state);
  const [selectedCity, setSelectedCity] = useState<any>(userAddress?.city);

  const [statesOfCountry, setStatesOfCountry] = useState<any>([]);
  const [citiesOfState, setCitiesOfState] = useState<any>([]);

  // -------- Get all data ------------- //
  useEffect(() => {
    fetch('/data/countries-states-cities.json')
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
      });
  }, []);

  // -------- Keep data memoized to load once ------------ //
  const memoizedAllCountries = useMemo<any>(() => allData, [allData]);

  // -------- Load states of selected country -------- //
  useEffect(() => {
    if (selectedCountry) {
      const countryData = memoizedAllCountries?.find((country: any) => {
        if (selectedCountry === country.name) {
          return country;
        }
      });

      setStatesOfCountry(countryData?.states);
    }
  }, [memoizedAllCountries, selectedCountry]);

  // ----------- Load cities of selected state ------- //
  useEffect(() => {
    if (selectedState) {
      const stateData = statesOfCountry?.find(
        (state: any) => state.name === selectedState,
      );
      setCitiesOfState(stateData?.cities);
    }
  }, [memoizedAllCountries, selectedState, statesOfCountry]);

  useEffect(() => {
    if (userAddress?.country) {
      setSelectedCountry(userAddress.country);
      setSelectedState(userAddress.state);
      setSelectedCity(userAddress.city);

      setValue('country', userAddress.country);
      setValue('state', userAddress.state);
      setValue('city', userAddress.city);
    }
  }, [userAddress?.country]);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2">
      {/* Country */}
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem className="lg:mb-0 mb-5">
            <FormLabel className="!text-gray-700 !text-base font-medium">
              Country
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedCountry(val);
                  setSelectedState('');
                  setSelectedCity('');
                  setValue('state', '');
                  setValue('city', '');
                }}
                value={selectedCountry}
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

      {/* State */}
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="!text-gray-700 !text-base font-medium">
              State
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedState(val);
                  setSelectedCity('');
                  setValue('city', '');
                }}
                value={selectedState}
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
      {/* <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  setSelectedCity(val);
                }}
                value={selectedCity}
                disabled={!selectedState || citiesOfState.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {citiesOfState.length > 0 ? (
                    citiesOfState.map((city: any) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
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
      /> */}
    </div>
  );
}
