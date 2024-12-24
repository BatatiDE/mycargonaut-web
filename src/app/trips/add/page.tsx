"use client";

import { useState } from "react";
import { tripApi } from "@/utils/tripApi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import LocationAutocomplete from "@/components/LocationAutocomplete";




export default function AddTripPage() {
    const router = useRouter();

    const { user } = useAuth(); // Get the logged-in user from context
    const [form, setForm] = useState({
        driverId: user?.id ? Number(user.id) : null, // Convert driverId to number
        startPoint: "",
        destinationPoint: "",
        date: "",
        time: "",
        availableSpace: 0,
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleAutocompleteChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.driverId) {
            setError("Driver ID not available. Please log in.");
            return;
        }
        try {
            // Convert driverId to ensure type consistency
            const payload = {
                ...form,
                driverId: Number(form.driverId),
            };

            await tripApi.addTrip(payload);
            router.push("/dashboard"); // Redirect to View Trips page
        } catch {
            setError("Failed to add trip. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add a New Trip</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <LocationAutocomplete
                    value={form.startPoint}
                    onChange={(value) => handleAutocompleteChange("startPoint", value)}
                    placeholder="Start Point"
                />
                <LocationAutocomplete
                    value={form.destinationPoint}
                    onChange={(value) => handleAutocompleteChange("destinationPoint", value)}
                    placeholder="Destination"
                />

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
                    placeholder="Available Space"
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
