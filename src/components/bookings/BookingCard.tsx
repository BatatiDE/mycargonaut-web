"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { offerApi } from "@/utils/api";

const AddTripPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        start: "",
        destination: "",
        date: "",
        capacity: 1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const offer = {
            start: form.start,
            destination: form.destination,
            date: form.date,
            payloadDetails: "Some details about the offer", // Hier ein passender Wert für payloadDetails
            price: 100, // Hier einen Preis setzen
        };

        try {
            await offerApi.createOffer(offer);
            router.push("/trips");
        } catch (error) {
            console.error("Failed to create trip:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4">Add New Trip</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="start"
                    placeholder="Start Location"
                    value={form.start}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                >
                    Add Trip
                </button>
            </form>
        </div>
    );
};

export default AddTripPage;
