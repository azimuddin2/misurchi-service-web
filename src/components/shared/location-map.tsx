'use client';

import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

const LIBRARIES: 'places'[] = ['places'];

const MAP_CONTAINER_STYLE = {
  height: '400px',
  width: '100%',
  borderRadius: '5px',
};

interface LocationMapProps {
  coordinates?: number[];
  onLocationChange?: (data: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  readonly?: boolean;
}

const LocationMap = ({
  coordinates,
  onLocationChange,
  readonly = false,
}: LocationMapProps) => {
  const defaultCenter = {
    lat: coordinates?.[0] ? Number(coordinates[0]) : 51.5074,
    lng: coordinates?.[1] ? Number(coordinates[1]) : -0.1278,
  };

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedAddress, setSelectedAddress] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (readonly) return;
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat === undefined || lng === undefined) return;

      setMarkerPosition({ lat, lng });
      setMapCenter({ lat, lng });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            setSelectedAddress(address);
            if (inputRef.current) inputRef.current.value = address;
            onLocationChange?.({ lat, lng, address });
          }
        },
      );
    },
    [readonly, onLocationChange],
  );

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || '';

    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng });

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }

    setSelectedAddress(address);
    onLocationChange?.({ lat, lng, address });
  };

  const handleClear = () => {
    setSelectedAddress('');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (!isLoaded)
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <MapPin className="animate-bounce text-gray-400" size={20} />
        <span className="ml-2 text-gray-500">Loading map...</span>
      </div>
    );

  return (
    <div className="space-y-2">
      {!readonly && (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Autocomplete
            onLoad={(ac) => (autocompleteRef.current = ac)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search location or click on map..."
              className="w-full pl-9 pr-9 py-3 bg-[#f5f5f5] border-none rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Autocomplete>
          {selectedAddress && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {selectedAddress && (
        <div className="flex items-start gap-2 p-2 bg-green-50 rounded-sm border border-green-200">
          <MapPin size={16} className="text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-800">{selectedAddress}</p>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{
          ...MAP_CONTAINER_STYLE,
          cursor: readonly ? 'default' : 'crosshair',
        }}
        center={mapCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {typeof window !== 'undefined' && window.google && (
          <Marker
            position={markerPosition}
            animation={window.google.maps.Animation.DROP}
            clickable={false}
          />
        )}
      </GoogleMap>

      {!readonly && (
        <p className="text-xs text-gray-400 text-center">
          📍 Search above or click on the map to set location
        </p>
      )}
    </div>
  );
};

export default LocationMap;
