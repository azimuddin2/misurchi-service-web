'use client';

import { useEffect, useState } from 'react';

type LocationMapProps = {
  streetAddress?: string;
  coordinates?: { lat: number; lng: number } | null;
  zoom?: number;
};

const LocationMap = ({
  streetAddress,
  coordinates,
  zoom = 14,
}: LocationMapProps) => {
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Your Google Maps Geocoding API key
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const generateMap = async () => {
      setLoading(true);

      let lat = 0;
      let lng = 0;

      if (coordinates?.lat && coordinates?.lng) {
        lat = coordinates.lat;
        lng = coordinates.lng;
      } else if (
        streetAddress &&
        streetAddress.trim() !== '' &&
        GOOGLE_MAPS_API_KEY
      ) {
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              streetAddress,
            )}&key=${GOOGLE_MAPS_API_KEY}`,
          );
          const data = await res.json();
          if (data.status === 'OK') {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
          }
        } catch (err) {
          console.error('Geocoding error:', err);
        }
      }

      // fallback
      if (lat === 0 && lng === 0) {
        lat = 51.5074; // London default
        lng = -0.1278;
      }

      setMapUrl(
        `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=${zoom}&ie=UTF8&iwloc=A&output=embed`,
      );
      setLoading(false);
    };

    generateMap();
  }, [streetAddress, coordinates, zoom]);

  return (
    <div className="mt-4 h-80 md:h-96 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading map...
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
          src={mapUrl}
          className="transition-all duration-300 ease-in-out"
        />
      )}
    </div>
  );
};

export default LocationMap;
