"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ position }: { position: [number, number] }) => {
    return (
        <MapContainer center={position} zoom={13} className="h-96 w-full">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>Driver's Location</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;
