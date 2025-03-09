"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// import LocationMapClient from "@/components/map/LocationMapClient";
import OfferRequestForm from "@/components/forms/OfferRequestForm";

// Dynamischer Import für Next.js
const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });

export default function Create() {
  const [fromLocation, setFromLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [toLocation, setToLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    type: "from" | "to"
  ) => {
    if (type === "from") {
      setFromLocation({ lat, lng });
    } else {
      setToLocation({ lat, lng });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Angebot/Anfrage erstellen</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Übergibt die Locations als Props an das Formular */}
        <OfferRequestForm
          fromLocation={fromLocation}
          toLocation={toLocation}
          setFromLocationAction={setFromLocation}
          setToLocationAction={setToLocation}
        />

        <div className="lg:block">
          <h2 className="mb-4 text-xl font-semibold">Kartenübersicht</h2>
          <div className="h-[600px] overflow-hidden rounded-lg bg-gray-100">
            <Map
                onLocationSelectAction={handleLocationSelect}
              fromLocation={fromLocation}
              toLocation={toLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
