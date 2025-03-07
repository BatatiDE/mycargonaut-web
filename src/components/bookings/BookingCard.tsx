"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="mx-auto max-w-md rounded bg-white p-8 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Add New Trip</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="start"
          placeholder="Start Location"
          value={form.start}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-2"
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-2"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-2"
        />
        <input
          type="number"
          name="capacity"
          min="1"
          value={form.capacity}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-2"
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default AddTripPage;
