"use client";

import { useEffect, useState } from "react";

import { tripApi } from "@/services/tripApi";
import { Trip } from "@/types/trip";

// Hier Trip importieren

export default function ViewTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripApi.getTrips();
        setTrips(response);
      } catch (error) {
        console.error("Failed to fetch trips", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Available Trips</h1>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id} className="mb-4 rounded border p-4 shadow">
            <h2 className="font-bold">
              {trip.startingPoint} → {trip.destinationPoint}
            </h2>
            <p>Date: {trip.date}</p>
            <p>Time: {trip.time}</p>
            <p>Available Seats: {trip.availableSeats}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
