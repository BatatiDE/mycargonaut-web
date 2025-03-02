"use client";

import { useState } from "react";
import { tripApi } from "@/utils/tripApi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import LocationMapClient from "@/components/LocationMapClient";

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
    const [mapField, setMapField] = useState<"startPoint" | "destinationPoint" | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleAutocompleteChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleLocationChange = (lat: number, lng: number, field: "startPoint" | "destinationPoint") => {
        setForm((prevForm) => ({
            ...prevForm,
            latitude: lat,
            longitude: lng,
            [field]: `${lat}, ${lng}`, // Setze die Koordinaten als Adresse für das Display-Feld
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.driverId) {
            alert("Driver ID not available. Please log in.");
            return;
        }
        try {
            const payload = {
                ...form,
                driverId: Number(form.driverId),
                availableSeats: form.availableSeats || 0, // Mapping des Aliases
                price: 0, // Falls kein Preis benötigt wird, setze 0
                freightSpace: 0, // Standardwert, falls nicht genutzt
                isFreightRide: false, // Standardmäßig keine Frachtfahrt
                // type: form.type === "REQUEST" ? "REQUEST" : "OFFER",
                type: "OFFER" as "OFFER", // Oder "REQUEST", je nach Use-Case
            };
            await tripApi.addTrip(payload);
            router.push("/dashboard");
        } catch {
            alert("Failed to add trip. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add a New Trip</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <LocationAutocomplete
                        value={form.startingPoint}
                        onChange={(value) => handleAutocompleteChange("startPoint", value)}
                        placeholder="Start Point"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setShowMap(!showMap);
                            setMapField("startPoint");
                        }}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 mt-2"
                    >
                        {showMap && mapField === "startPoint" ? "Hide Map" : "Show Map"}
                    </button>
                </div>

                <div>
                    <LocationAutocomplete
                        value={form.destinationPoint}
                        onChange={(value) => handleAutocompleteChange("destinationPoint", value)}
                        placeholder="Destination"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setShowMap(!showMap);
                            setMapField("destinationPoint");
                        }}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 mt-2"
                    >
                        {showMap && mapField === "destinationPoint" ? "Hide Map" : "Show Map"}
                    </button>
                </div>

                {showMap && mapField && (
                    <LocationMapClient
                        onLocationChange={(lat, lng) => {
                            if (mapField) {
                                handleLocationChange(lat, lng, mapField); // Setze Koordinaten und Adresse
                            }
                        }}
                    />
                )}

                <input
                    name="date"
                    type="date"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="time"
                    type="time"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="availableSpace"
                    type="number"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Trip
                </button>
            </form>
        </div>
    );
}
