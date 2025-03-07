import LocationMapClient from "@/components/LocationMapClient";

interface LocationMapProps {
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationMap = (props: LocationMapProps) => {
  return <LocationMapClient {...props} />;
};

export default LocationMap;
