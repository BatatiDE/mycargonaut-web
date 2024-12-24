import React, { useEffect, useRef } from "react";
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
                                                           latitude = 51.505,
                                                           longitude = -0.09,
                                                           onLocationChange,
                                                       }) => {
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure this runs only on the client side

        if (!mapRef.current) {
            // Initialize the map
            const mapInstance = L.map("map").setView([latitude, longitude], 13);
            mapRef.current = mapInstance;

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstance);

            // Add a draggable marker
            const marker = L.marker([latitude, longitude], { draggable: true }).addTo(
                mapInstance
            );

            marker.on("dragend", () => {
                const position = marker.getLatLng();
                onLocationChange(position.lat, position.lng);
            });
        } else {
            // Ensure mapRef.current is valid before using
            const mapInstance = mapRef.current;
            if (mapInstance instanceof L.Map) {
                mapInstance.setView([latitude, longitude], 13);
            }
        }
    }, [latitude, longitude, onLocationChange]);

    return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default LocationMapClient;
