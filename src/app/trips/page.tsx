/*
"use client";

import { useEffect, useState } from "react";

import StarRating from "@/components/rating/StarRating";
import { useAuth } from "@/utils/AuthContext";
import { tripApi } from "@/utils/tripApi";
import { Trip } from "@/types/trip"

interface Trip {
  id: string;
  startPoint: string;
  destinationPoint: string;
  date: string;
  time: string;
  availableSpace: number;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED";
  progress?: number;
  driverId: string;
  driverRating?: number;
}

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [tripFilter, setTripFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const fetchedTrips = await tripApi.getTrips();
        const tripsWithProgress = fetchedTrips.map((trip) => ({
          ...trip,
          progress:
            trip.status === "ONGOING" ? Math.floor(Math.random() * 100) : 0,
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
    fetchDriverRatings();
  }, []);

  const fetchDriverRatings = async () => {
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        try {
          const response = await fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
              query GetAverageRating($userId: ID!) {
                getAverageRatingByUser(userId: $userId)
              }
            `,
              variables: { userId: trip.driverId },
            }),
          });
          const data = await response.json();
          return {
            ...trip,
            driverRating: data.data.getAverageRatingByUser || 0,
          };
        } catch (error) {
          console.error("Error fetching driver rating:", error);
          return { ...trip, driverRating: 0 };
        }
      })
    );
    setTrips(updatedTrips);
  };

  // Handle trip booking
  const handleBooking = async (tripId: string | null) => {
    if (!tripId) {
      alert("Invalid trip ID.");
      return;
    }

    try {
      console.log("Booking trip with ID:", tripId); // Debugging log
      const response = await tripApi.bookTrip(tripId);
      if (response.success) {
        alert("Trip booked successfully!");
        // Refresh trips after booking
        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  // availableSpace: trip.availableSpace - 1,
                  availableSpace: (trip.availableSpace as number) - 1,
                }
              : trip
          )
        );
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error booking trip:", error);
      alert("Failed to book the trip. Please try again later.");
    }
  };

  if (loading) return <div className="text-center">Loading trips...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      {}//Left Column: Destinations
      <div className="flex flex-col rounded bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-bold">Deliveries</h2>
        <input
          type="text"
          placeholder="Filter Deliveries"
          className="mb-4 w-full rounded border px-2 py-1"
          onChange={(e) => setDestinationFilter(e.target.value)}
        />
        <div
          className="flex-grow overflow-y-auto"
          style={{ maxHeight: "400px" }}
        >
          <ul>
            {destinations
              .filter((dest) =>
                dest.toLowerCase().includes(destinationFilter.toLowerCase())
              )
              .map((dest, index) => (
                <li key={index} className="mb-2 border-b pb-2">
                  {dest}
                </li>
              ))}
          </ul>
          {destinations.length === 0 && (
            <p className="text-gray-500">No destinations available.</p>
          )}
        </div>
      </div>

      {} //Right Column: Trips
      <div className="flex flex-col rounded bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-bold">Available Trips</h2>
        <input
          type="text"
          placeholder="Filter Trips"
          className="mb-4 w-full rounded border px-2 py-1"
          onChange={(e) => setTripFilter(e.target.value)}
        />
        <div
          className="flex-grow overflow-y-auto"
          style={{ maxHeight: "400px" }}
        >
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
                  <li key={trip.id} className="rounded border p-4 shadow">
                    <h2 className="text-lg font-semibold">
                      {trip.startPoint} → {trip.destinationPoint}
                    </h2>
                    <p>
                      <strong>Date:</strong> {trip.date} |{" "}
                      <strong>Time:</strong> {trip.time}
                    </p>

                    {} // Available Space
                    {trip.availableSpace > 0 ? (
                      <p className="text-green-500">
                        🟢 {trip.availableSpace} spaces left
                      </p>
                    ) : (
                      <p className="text-red-500">
                        🔴 No Space (Wait for Reopen)
                      </p>
                    )}

                    {} //Status
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
                    <StarRating rating={trip.driverRating || 0} />

                    {} //Progress Bar
                    {trip.status === "ONGOING" && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Progress</p>
                        <div className="h-2 w-full rounded bg-gray-200">
                          <div
                            className="h-2 rounded bg-blue-500"
                            style={{
                              width: `${trip.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {} // Book Trip Button
                    {trip.availableSpace > 0 &&
                      trip.status == "SCHEDULED" &&
                      String(user?.id) !== String(trip.driverId) && (
                        <button
                          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          onClick={() => handleBooking(trip.id)}
                        >
                          Book Trip
                        </button>
                      )}
                    {String(user?.id) === String(trip.driverId) && (
                      <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
                        You are the driver
                      </span>
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
*/
"use client";

import { useEffect, useState } from "react";
import { tripApi } from "@/utils/tripApi";

import { useAuth } from "@/utils/AuthContext";
import StarRating from "@/components/rating/StarRating";
import { Trip } from "@/types/trip"

/*
interface Trip {
    id: string;
    startPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    availableSpace: number;
    status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED";
    progress?: number;
    driverId: string;
    driverRating?: number;
}
*/

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [tripFilter, setTripFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const fetchedTrips = await tripApi.getTrips();

        const tripsWithProgress: Trip[] = fetchedTrips.map((trip) => ({
          ...trip, // Alle Originalwerte übernehmen
          startingPoint: trip.startingPoint ?? "", // Alias setzen, Fallback auf leeren String
          availableSpace: trip.availableSeats ?? 0, // Alias setzen, Fallback auf 0
          progress: trip.status === "ONGOING" ? Math.floor(Math.random() * 100) : 0,
        }));

        setTrips(tripsWithProgress);

        // Ziele extrahieren
        const fetchedDestinations = [...new Set(fetchedTrips.map((trip) => trip.destinationPoint))];
        setDestinations(fetchedDestinations);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Could not load trips. Please try again later.");
      } finally {
        setLoading(false);
      }
      await fetchTrips();
      await fetchDriverRatings();
    };
    // fetchTrips();
    // fetchDriverRatings();
  }, []);

  const fetchDriverRatings = async () => {
    const updatedTrips = await Promise.all(
        trips.map(async (trip) => {
          try {
            const response = await fetch("http://localhost:8080/graphql", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `
              query GetAverageRating($userId: ID!) {
                getAverageRatingByUser(userId: $userId)
              }
            `,
                variables: { userId: trip.driverId },
              }),
            });
            const data = await response.json();
            return { ...trip, driverRating: data.data.getAverageRatingByUser || 0 };
          } catch (error) {
            console.error("Error fetching driver rating:", error);
            return { ...trip, driverRating: 0 };
          }
        })
    );
    setTrips(updatedTrips);
  };

  // Handle trip booking
  const handleBooking = async (tripId: string | null) => {
    if (!tripId) {
      alert("Invalid trip ID.");
      return;
    }

    try {
      console.log("Booking trip with ID:", tripId); // Debugging log
      const response = await tripApi.bookTrip(tripId);
      if (response.success) {
        alert("Trip booked successfully!");
        // Refresh trips after booking
        setTrips((prevTrips) =>
            prevTrips.map((trip) =>
                trip.id === tripId
                    ? {
                      ...trip,
                      availableSpace: (trip.availableSpace as number) - 1,
                    }
                    : trip
            )
        );
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error booking trip:", error);
      alert("Failed to book the trip. Please try again later.");
    }
  };


  if (loading) return <div className="text-center">Loading trips...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left Column: Destinations */}
        <div className="bg-white p-4 rounded shadow flex flex-col">
          <h2 className="text-xl font-bold mb-4">Deliveries</h2>
          <input
              type="text"
              placeholder="Filter Deliveries"
              className="w-full px-2 py-1 mb-4 border rounded"
              onChange={(e) => setDestinationFilter(e.target.value)}
          />
          <div className="overflow-y-auto flex-grow" style={{ maxHeight: "400px" }}>
            <ul>
              {destinations
                  .filter((dest) =>
                      dest.toLowerCase().includes(destinationFilter.toLowerCase())
                  )
                  .map((dest, index) => (
                      <li key={index} className="mb-2 border-b pb-2">
                        {dest}
                      </li>
                  ))}
            </ul>
            {destinations.length === 0 && (
                <p className="text-gray-500">No destinations available.</p>
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
                          trip.startingPoint
                              .toLowerCase()
                              .includes(tripFilter.toLowerCase())
                      )
                      .map((trip) => (
                          <li
                              key={trip.id}
                              className="border p-4 rounded shadow"
                          >

                            <h2 className="text-lg font-semibold">
                              {trip.startingPoint} → {trip.destinationPoint}
                            </h2>
                            <p>
                              <strong>Date:</strong> {trip.date} |{" "}
                              <strong>Time:</strong> {trip.time}
                            </p>

                            {/* Available Space */}
                            {(trip.availableSpace ?? 0) > 0 ? (
                                <p className="text-green-500">
                                  🟢 {trip.availableSpace ?? 0} spaces left
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
                            <StarRating rating={trip.driverRating || 0} />

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
                            {/* Book Trip Button */}
                            {trip.availableSpace != null && trip.availableSpace > 0 && trip.status === "SCHEDULED" &&
                                String(user?.id) !== String(trip.driverId) && (
                                    <button
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        onClick={() => handleBooking(trip.id.toString())}
                                    >
                                      Book Trip
                                    </button>
                                )
                            }
                            {String(user?.id) === String(trip.driverId) && (
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                               You are the driver
                                            </span>
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