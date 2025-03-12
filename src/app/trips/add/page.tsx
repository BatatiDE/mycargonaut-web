"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import LocationAutocomplete from "@/components/map/LocationAutocomplete";
import LocationMapClient from "@/components/map/LocationMapClient";
import { useAuth } from "@/context/AuthContext";
import { tripApi } from "@/services/tripApi";

export default function AddTripPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    driverId: user?.id ? Number(user.id) : null,
    startingPoint: "",
    destinationPoint: "",
    date: "",
    time: "",
    availableSeats: 0,
    latitude: 50.586, // Default latitude (Gießen)
    longitude: 8.678, // Default longitude (Gießen)
  });
  const [showMap, setShowMap] = useState(false);
  const [mapField, setMapField] = useState<
    "startPoint" | "destinationPoint" | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAutocompleteChange = (
    field: "startPoint" | "destinationPoint",
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: String(value),
    }));
  };

  const handleLocationChange = (
    lat: number,
    lng: number,
    field: "startPoint" | "destinationPoint"
  ) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: lat,
      longitude: lng,
      [field]: `${lat}, ${lng}`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.driverId) {
      alert("Driver ID not available. Please log in.");
      return;
    }
    try {
      const tripType: "OFFER" | "REQUEST" = "OFFER";
      const payload = {
        ...form,
        driverId: Number(form.driverId),
        availableSeats: form.availableSeats || 0,
        price: 0,
        freightSpace: 0,
        isFreightRide: false,
        type: tripType,
      };
      await tripApi.addTrip(payload);
      router.push("/dashboard");
    } catch {
      alert("Failed to add trip. Please try again.");
    }
  };

  const handleLocationSelect = (
    field: "startPoint" | "destinationPoint",
    selectedLocation: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: selectedLocation,
    }));
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-bold">Add a New Trip</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <LocationAutocomplete
            value={form.startingPoint}
            onChange={(value) => handleAutocompleteChange("startPoint", value)}
            onSelect={(selectedLocation) =>
              handleLocationSelect("startPoint", String(selectedLocation))
            }
            placeholder="Start Point"
          />
          <button
            type="button"
            onClick={() => {
              setShowMap(!showMap);
              setMapField("startPoint");
            }}
            className="mt-2 rounded bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300"
          >
            {showMap && mapField === "startPoint" ? "Hide Map" : "Show Map"}
          </button>
        </div>

        <div>
          <LocationAutocomplete
            value={form.destinationPoint}
            onChange={(value) =>
              handleAutocompleteChange("destinationPoint", value)
            }
            onSelect={(selectedLocation) =>
              handleLocationSelect("startPoint", String(selectedLocation))
            }
            placeholder="Destination"
          />
          <button
            type="button"
            onClick={() => {
              setShowMap(!showMap);
              setMapField("destinationPoint");
            }}
            className="mt-2 rounded bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300"
          >
            {showMap && mapField === "destinationPoint"
              ? "Hide Map"
              : "Show Map"}
          </button>
        </div>

        {showMap && mapField && (
          <LocationMapClient
            onLocationChange={(lat: number, lng: number) => {
              if (mapField) {
                handleLocationChange(lat, lng, mapField);
              }
            }}
          />
        )}

        <input
          name="date"
          type="date"
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
        <input
          name="time"
          type="time"
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
        <input
          name="availableSpace"
          type="number"
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
}
