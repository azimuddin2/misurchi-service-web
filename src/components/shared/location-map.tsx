'use client';

import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';

type LocationMapProps = {
  location?: string;
};

const LocationMap = ({ location }: LocationMapProps) => {
  const [debouncedLocation] = useDebounce(location, 500);
  const [mapUrl, setMapUrl] = useState('');

  // Default fallback location
  const defaultLocation = '123A, Washington, UK (Soft Technology)';

  useEffect(() => {
    const finalLocation =
      debouncedLocation && debouncedLocation.trim() !== ''
        ? debouncedLocation
        : defaultLocation;

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(
      finalLocation,
    )}&t=m&z=14&ie=UTF8&iwloc=A&output=embed`;

    setMapUrl(url);
  }, [debouncedLocation]);

  return (
    <div className="mt-8 h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {mapUrl ? (
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
          src={mapUrl}
          className="transition-all duration-300 ease-in-out"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default LocationMap;
