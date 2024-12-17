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
    status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED";
    progress?: number;
}

const TripsPage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [destinations, setDestinations] = useState<string[]>([]);
    const [tripFilter, setTripFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const fetchedTrips = await tripApi.getTrips();
                const tripsWithProgress = fetchedTrips.map((trip) => ({
                    ...trip,
                    progress:
                        trip.status === "ONGOING"
                            ? Math.floor(Math.random() * 100)
                            : 0,
                }));

                setTrips(tripsWithProgress);

                // Extract destinations
                const fetchedDestinations = [
                    ...new Set(fetchedTrips.map((trip) => trip.destinationPoint)),
                ];
                setDestinations(fetchedDestinations);
            } catch (err) {
                console.error("Error fetching trips:", err);
                setError("Could not load trips. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) return <div className="text-center">Loading trips...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column: Destinations */}
            <div className="bg-white p-4 rounded shadow flex flex-col">
                <h2 className="text-xl font-bold mb-4">Destinations</h2>
                {/* Filter Input */}
                <input
                    type="text"
                    placeholder="Filter Destinations"
                    className="w-full px-2 py-1 mb-4 border rounded"
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                />
                {/* Scrollable Destination List */}
                <div className="overflow-y-auto flex-grow" style={{ maxHeight: "400px" }}>
                    {destinations.length === 0 ? (
                        <p className="text-gray-500 text-center">No destinations available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {destinations
                                .filter((dest) =>
                                    dest
                                        .toLowerCase()
                                        .includes(destinationFilter.toLowerCase())
                                )
                                .map((dest, index) => (
                                    <li
                                        key={index}
                                        className="border p-2 rounded shadow flex items-center justify-between"
                                    >
                                        <span className="font-semibold">{dest}</span>
                                        <span
                                            className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                                            title="Destination"
                                        >
                                {index + 1}
                            </span>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>


            {/* Right Column: Trips */}
            <div className="bg-white p-4 rounded shadow flex flex-col">
                <h2 className="text-xl font-bold mb-4">Available Trips</h2>
                <input
                    type="text"
                    placeholder="Filter Trips"
                    className="w-full px-2 py-1 mb-4 border rounded"
                    onChange={(e) => setTripFilter(e.target.value)}
                />
                <div className="overflow-y-auto flex-grow" style={{ maxHeight: "400px" }}>
                    {trips.length === 0 ? (
                        <p>No trips available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {trips
                                .filter((trip) =>
                                    trip.startPoint
                                        .toLowerCase()
                                        .includes(tripFilter.toLowerCase())
                                )
                                .map((trip) => (
                                    <li
                                        key={trip.id}
                                        className="border p-4 rounded shadow"
                                    >
                                        <h2 className="text-lg font-semibold">
                                            {trip.startPoint} → {trip.destinationPoint}
                                        </h2>
                                        <p>
                                            <strong>Date:</strong> {trip.date} |{" "}
                                            <strong>Time:</strong> {trip.time}
                                        </p>
                                        {/* Available Space */}
                                        {trip.availableSpace > 0 ? (
                                            <p className="text-green-500">
                                                🟢 {trip.availableSpace} spaces left
                                            </p>
                                        ) : (
                                            <p className="text-red-500">
                                                🔴 No Space (Wait for Reopen)
                                            </p>
                                        )}

                                        {/* Status */}
                                        <p className="text-sm text-gray-600">
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={
                                                    trip.status === "ONGOING"
                                                        ? "text-blue-500"
                                                        : trip.status === "COMPLETED"
                                                            ? "text-green-500"
                                                            : trip.status === "CANCELED"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                }
                                            >
                                                {trip.status}
                                            </span>
                                        </p>

                                        {/* Progress Bar */}
                                        {trip.status === "ONGOING" && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">
                                                    Progress
                                                </p>
                                                <div className="w-full bg-gray-200 rounded h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded"
                                                        style={{
                                                            width: `${trip.progress || 0}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripsPage;
