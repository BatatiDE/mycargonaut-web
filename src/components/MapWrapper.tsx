"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapWrapperProps {
    fromLocation: { lat: number; lng: number };
    toLocation: { lat: number; lng: number };
}

const MapWrapper: React.FC<MapWrapperProps> = ({ fromLocation, toLocation }) => {
    return <Map fromLocation={fromLocation} toLocation={toLocation} />;
};

export default MapWrapper;
