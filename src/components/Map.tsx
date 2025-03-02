"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet Icon Fix für Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
    fromLocation: { lat: number; lng: number };
    toLocation: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ fromLocation, toLocation }) => {
    return (
        <MapContainer center={fromLocation} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={fromLocation}>
                <Popup>Startpunkt</Popup>
            </Marker>
            <Marker position={toLocation}>
                <Popup>Zielort</Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
