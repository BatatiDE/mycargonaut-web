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
  iconUrl: markerIcon.src, // Falls du eine andere Farbe möchtest, passe hier die Datei an
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

export default function Map({
                              onLocationSelectAction,
                              fromLocation,
                              toLocation,
                            }: MapProps) {
  const [center, setCenter] = useState<[number, number]>([51.1657, 10.4515]); // Deutschland Zentrum

  useEffect(() => {
    if (fromLocation) {
      setCenter([fromLocation.lat, fromLocation.lng]);
    } else if (toLocation) {
      setCenter([toLocation.lat, toLocation.lng]);
    }
  }, [fromLocation, toLocation]);

  return (
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
        {fromLocation && <Marker position={[fromLocation.lat, fromLocation.lng]} icon={fromIcon} />}
        {toLocation && <Marker position={[toLocation.lat, toLocation.lng]} icon={toIcon} />}
        <MapEvents
            onLocationSelectAction={onLocationSelectAction}
            fromLocation={fromLocation}
            toLocation={toLocation}
        />
        <ChangeView center={center} />
      </MapContainer>
  );
}
