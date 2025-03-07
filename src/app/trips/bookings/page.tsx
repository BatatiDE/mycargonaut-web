/*
"use client";

import { useEffect, useState } from "react";
import { tripApi } from "@/utils/tripApi";  // Diese importierte API wird benutzt
import { Trip } from "@/types/trip"; // Hier Trip importieren


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
*/
"use client";

import { useEffect, useState } from "react";
import { tripApi } from "@/services/tripApi";  // Diese importierte API wird benutzt
import { Trip } from "@/types/trip"; // Hier Trip importieren

export default function ViewTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripApi.getTrips();
        setTrips(response); // Die getTrips-Funktion gibt direkt ein Trip-Array zurück
      } catch (error) {
        console.error("Failed to fetch trips", error);
      }
    };

    fetchTrips(); // Aufruf der async Funktion im useEffect
  }, []); // Leeres Array sorgt dafür, dass der Effekt nur einmal ausgeführt wird

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Available Trips</h1>
        <ul>
          {trips.map((trip) => (
              <li key={trip.id} className="border p-4 mb-4 rounded shadow">
                <h2 className="font-bold">{trip.startingPoint} → {trip.destinationPoint}</h2>
                <p>Date: {trip.date}</p>
                <p>Time: {trip.time}</p>
                <p>Available Seats: {trip.availableSeats}</p>
              </li>
          ))}
        </ul>
      </div>
  );
}