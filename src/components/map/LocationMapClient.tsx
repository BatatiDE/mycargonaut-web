"use client";

import React, {useState} from "react";
import {useGeoLocation} from "@/hooks/useGeoLocation";
import Map from "@/components/map/Map";

interface Location {
    lat: number;
    lng: number;
}

interface LocationMapClientProps {
    onLocationChange?: (lat: number, lng: number) => void;
}

const LocationMapClient: React.FC<LocationMapClientProps> = ({onLocationChange}) => {
    const {location, loading} = useGeoLocation();
    const [fromLocation, setFromLocation] = useState<Location | null>(null);
    const [toLocation, setToLocation] = useState<Location | null>(null);

    if (loading) return <div className="bg-blend-color">Loading your location...</div>;

    return (
        <div>
            <Map
                fromLocation={fromLocation || location}
                toLocation={toLocation}
                onLocationSelectAction={(lat: number, lng: number, type: string) => {
                    if (type === "from") {
                        setFromLocation({lat, lng});
                    } else {
                        setToLocation({lat, lng});
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
