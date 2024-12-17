"use client";

import { useEffect, useState } from "react";
import { tripApi } from "@/utils/tripApi";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";


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

interface Destination {
    id: string;
    location: string;
    status: "SCHEDULED" | "Booked" | "Confirmed";
}

const DashboardPage = () => {
    const { user } = useAuth();
    console.log(user);
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [tripFilter, setTripFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
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

                // Mock destination data
                setDestinations([
                    { id: "1", location: "Hamburg", status: "SCHEDULED" },
                    { id: "2", location: "Berlin", status: "Booked" },
                    { id: "3", location: "Munich", status: "Confirmed" },
                ]);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center">Loading dashboard...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column: Destinations */}
            <div className="bg-white p-4 rounded shadow flex flex-col">
                <h2 className="text-xl font-bold mb-4">Manage Deliveries</h2>
                <button
                    onClick={() => alert("Add Destination functionality not implemented yet.")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
                >
                    Add Destination
                </button>
                <input
                    type="text"
                    placeholder="Filter Destinations"
                    className="w-full px-2 py-1 mb-4 border rounded"
                    onChange={(e) => setDestinationFilter(e.target.value)}
                />
                <div className="overflow-y-auto flex-grow" style={{ maxHeight: "400px" }}>
                    {destinations.length === 0 ? (
                        <p>No destinations available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {destinations
                                .filter((dest) =>
                                    dest.location
                                        .toLowerCase()
                                        .includes(destinationFilter.toLowerCase())
                                )
                                .map((dest) => (
                                    <li
                                        key={dest.id}
                                        className="border p-4 rounded shadow flex justify-between items-center"
                                    >
                                        <span className="font-semibold">
                                            {dest.location}
                                        </span>
                                        <span
                                            className={`text-sm px-2 py-1 rounded ${
                                                dest.status === "Booked"
                                                    ? "bg-blue-200 text-blue-700"
                                                    : dest.status === "Confirmed"
                                                        ? "bg-orange-200 text-orange-700"
                                                        : "bg-gray-200 text-gray-700"
                                            }`}
                                        >
                                            {dest.status}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Right Column: Trips */}
            <div className="bg-white p-4 rounded shadow flex flex-col">
                <h2 className="text-xl font-bold mb-4">Manage Trips</h2>
                <button
                    onClick={() => router.push("/trips/add")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                >
                    Add Trip
                </button>

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
                                        className="border p-4 rounded shadow relative"
                                    >
                                        <h3 className="font-semibold">
                                            {trip.startPoint} →{" "}
                                            {trip.destinationPoint}
                                        </h3>
                                        <p>
                                            <strong>Date:</strong> {trip.date} |{" "}
                                            <strong>Time:</strong> {trip.time}
                                        </p>

                                        {/* Status Icons */}
                                        <div className="flex items-center gap-4 mt-2">
                                            <div
                                                className="relative cursor-pointer"
                                                title="Available Spaces"
                                            >
                                                🟢 {trip.availableSpace}
                                            </div>
                                            <div
                                                className="relative cursor-pointer text-blue-500"
                                                title="Booked Trips"
                                            >
                                                🔵 0
                                            </div>
                                            <div
                                                className="relative cursor-pointer text-orange-500"
                                                title="Confirmed Trips"
                                            >
                                                🟠 0
                                            </div>
                                        </div>

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

export default DashboardPage;
