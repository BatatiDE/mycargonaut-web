"use client";

import { useState } from "react";
import { tripApi } from "@/utils/tripApi";
import { useRouter } from "next/navigation";

export default function AddTripPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        driverId: 1, // Replace with the logged-in driver's ID
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tripApi.addTrip(form);
            router.push("/trips/bookings"); // Redirect to View Trips page
        } catch (err) {
            setError("Failed to add trip. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add a New Trip</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="startPoint"
                    placeholder="Start Point"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    name="destinationPoint"
                    placeholder="Destination"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
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
