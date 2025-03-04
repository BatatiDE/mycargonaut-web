"use client";

import { useEffect, useState } from "react";

import { tripApi } from "@/utils/tripApi";

interface Trip {
  id: string;
  startPoint: string;
  destinationPoint: string;
  date: string;
  time: string;
  availableSpace: number;
}

export default function ViewTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripApi.getTrips();
        setTrips(data.data.getTrips);
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
              {trip.startPoint} → {trip.destinationPoint}
            </h2>
            <p>Date: {trip.date}</p>
            <p>Time: {trip.time}</p>
            <p>Available Space: {trip.availableSpace}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
