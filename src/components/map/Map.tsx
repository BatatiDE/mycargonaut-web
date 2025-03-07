"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    Marker,
    TileLayer,
    Polyline,
    useMap,
    useMapEvents,
} from "react-leaflet";

const fromIcon = new L.Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const toIcon = new L.Icon({
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapProps {
    onLocationSelectAction: (lat: number, lng: number, type: "from" | "to") => void;
    fromLocation?: { lat: number; lng: number } | null;
    toLocation?: { lat: number; lng: number } | null;
}

function MapEvents({ onLocationSelectAction, fromLocation, toLocation }: MapProps) {
    useMapEvents({
        click(e) {
            if (!fromLocation) {
                onLocationSelectAction(e.latlng.lat, e.latlng.lng, "from");
            } else if (!toLocation) {
                onLocationSelectAction(e.latlng.lat, e.latlng.lng, "to");
            }
        },
    });

    return null;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

function calculateDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
    const R = 6371; // Radius der Erde in km
    const dLat = (to.lat - from.lat) * (Math.PI / 180);
    const dLng = (to.lng - from.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(from.lat * (Math.PI / 180)) *
        Math.cos(to.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function Map({
                                onLocationSelectAction,
                                fromLocation,
                                toLocation,
                            }: MapProps) {
    const [center, setCenter] = useState<[number, number]>([51.1657, 10.4515]); // Deutschland Zentrum
    const [distance, setDistance] = useState<number | null>(null);

    useEffect(() => {
        if (fromLocation && toLocation) {
            setDistance(calculateDistance(fromLocation, toLocation));
        } else {
            setDistance(null);
        }

        if (fromLocation) {
            setCenter([fromLocation.lat, fromLocation.lng]);
        } else if (toLocation) {
            setCenter([toLocation.lat, toLocation.lng]);
        }
    }, [fromLocation, toLocation]);

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* 🗺 Map Container */}
            <div className="h-[600px] w-full relative rounded-lg overflow-hidden bg-gray-100">
                <MapContainer
                    key={`${center[0]}-${center[1]}`}
                    center={center}
                    zoom={6}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {fromLocation && (
                        <Marker position={[fromLocation.lat, fromLocation.lng]} icon={fromIcon} />
                    )}
                    {toLocation && (
                        <Marker position={[toLocation.lat, toLocation.lng]} icon={toIcon} />
                    )}
                    {fromLocation && toLocation && (
                        <Polyline
                            positions={[
                                [fromLocation.lat, fromLocation.lng],
                                [toLocation.lat, toLocation.lng],
                            ]}
                            color="red"
                        />
                    )}
                    <MapEvents
                        onLocationSelectAction={onLocationSelectAction}
                        fromLocation={fromLocation}
                        toLocation={toLocation}
                    />
                    <ChangeView center={center} />
                </MapContainer>
            </div>

            {/* 🏁 Entfernung unter der Karte */}
            {distance !== null && (
                <div className="w-full text-center text-lg font-semibold text-gray-900 bg-white p-4 rounded shadow-md border border-gray-300">
                    Entfernung: {distance.toFixed(2)} km
                </div>
            )}
        </div>
    );
}
