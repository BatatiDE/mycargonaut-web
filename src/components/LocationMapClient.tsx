/*import React, { useEffect, useRef } from "react";


import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons by explicitly setting their paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationMapClient: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Function for reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) throw new Error("Failed to fetch address");
      const data = await response.json();
      const address = data.display_name || "Unknown location";
      return address;
    } catch (error) {
      console.error("Reverse geocoding error:", error.message);
      return "Unable to fetch address";
    }
  };

  // Function for geolocation
  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (mapRef.current instanceof L.Map) {
            // Center the map at the current location
            mapRef.current.setView([latitude, longitude], 13);

            // Add or move the marker to the new location
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], {
                draggable: true,
              }).addTo(mapRef.current);
            }

            // Fetch the reverse-geocoded address
            const address = await reverseGeocode(latitude, longitude);

            // Pass the address to the parent component
            console.log("Address from Geolocation:", address); // Debugging
            onLocationChange(address); // Call parent function with the address
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          alert("Unable to access your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side only

    if (!mapRef.current) {
      // Default to Gießen, Germany if latitude or longitude is undefined
      const defaultLat = latitude || 50.586;
      const defaultLng = longitude || 8.678;

      // Initialize the map
      const mapInstance = L.map("map").setView([defaultLat, defaultLng], 13);
      mapRef.current = mapInstance;

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Add a draggable marker
      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
      }).addTo(mapInstance);
      markerRef.current = marker;

      marker.on("dragend", async () => {
        if (markerRef.current) {
          const position = markerRef.current.getLatLng();
          const address = await reverseGeocode(position.lat, position.lng);
          onLocationChange(address); // Pass address to parent
        }
      });
    }
  }, [latitude, longitude, onLocationChange]);

  return (
    <>
      <div id="map" style={{ height: "400px", width: "100%" }} />
      <button onClick={handleGeolocation} style={{ marginTop: "10px" }}>
        Use Current Location
      </button>
    </>
  );
};

export default LocationMapClient;
*/

import React, { useState } from "react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import Map from "@/components/Map";

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapClientProps {
  onLocationChange?: (lat: number, lng: number) => void;
}

const LocationMapClient: React.FC<LocationMapClientProps> = ({ onLocationChange }) => {
  const { location, loading } = useGeoLocation();
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);

  if (loading) return <div>Loading your location...</div>;

  return (
      <div>
        <Map
            fromLocation={fromLocation || location}
            toLocation={toLocation}
            onLocationSelectAction={(lat: number, lng: number, type: string) => {
              if (type === "from") {
                setFromLocation({ lat, lng });
              } else {
                setToLocation({ lat, lng });
              }
              if (onLocationChange) {
                onLocationChange(lat, lng)
              }
            }}
        />
      </div>
  );
};

export default LocationMapClient;
