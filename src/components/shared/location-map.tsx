import { useDebounce } from 'use-debounce';

const LocationMap = ({ location }: { location?: string }) => {
  const [debouncedLocation] = useDebounce(location, 500);

  const finalLocation =
    debouncedLocation && debouncedLocation.trim() !== ''
      ? debouncedLocation
      : '123A, Washington, UK (Soft Technology)'; // ✅ Default

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    finalLocation,
  )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="mt-8 h-full rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="400"
        frameBorder="0"
        scrolling="no"
        src={mapUrl}
      />
    </div>
  );
};

export default LocationMap;
