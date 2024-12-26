"use client";

import {useEffect, useState} from "react";
import {tripApi} from "@/utils/tripApi";
import {useAuth} from "@/utils/AuthContext";
import {useRouter} from "next/navigation";
import RatingModal from "@/components/rating/RatingModal";
import StarRating from "@/components/rating/StarRating";


interface Booking {
    id: string;
    userId: string;
    status: string;
    createdAt: string;
}

interface Trip {
    id: string;
    driverId: string; // Ensure driverId is included
    startPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    availableSpace: number;
    total_capacity: number;
    status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED";
    progress?: number;
    bookedUsers: Booking[]; // Include the list of bookings
    rating?: number;

}

interface Destination {
    id: string;
    location: string;
    status: "SCHEDULED" | "Booked" | "Confirmed";
}

const DashboardPage = () => {
    const {user} = useAuth();
    console.log(user);
    const router = useRouter();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [tripFilter, setTripFilter] = useState("");
    const [destinationFilter, setDestinationFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trips, setTrips] = useState<{ added: Trip[]; booked: Trip[] }>({added: [], booked: []});
    const [currentFilter, setCurrentFilter] = useState<"added" | "booked">("added");
    const [currentTripId, setCurrentTripId] = useState<string | null>(null);
    const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);
    const [currentTargetUserId, setCurrentTargetUserId] = useState<string | null>(null);

    const handleConfirmBooking = async (bookingId: string) => {
        try {
            const response = await tripApi.confirmBooking(bookingId);
            if (response.success) {
                alert("Booking confirmed successfully!");
                // Optionally, refetch trips to update the UI
                fetchData();
            } else {
                alert("Failed to confirm booking: " + response.message);
            }
        } catch (err) {
            console.error("Error confirming booking:", err);
            alert("An error occurred while confirming the booking.");
        }
    };
    const handleStartTrip = async (tripId: string) => {
        if (!tripId) {
            alert("Trip ID is required to start the trip.");
            return;
        }
        try {
            const updatedTrip = await tripApi.startOngoingTrip(tripId);
            alert(`Trip ${updatedTrip.id} status updated to ${updatedTrip.status}.`);

            // Simulate progress bar and status update
            let progress = 0;
            const progressInterval = setInterval(async () => {
                setTrips((prevTrips) => ({
                    ...prevTrips,
                    [currentFilter]: prevTrips[currentFilter].map((trip) =>
                        trip.id === tripId
                            ? {
                                ...trip,
                                progress: progress,
                            }
                            : trip
                    )
                }));

                if (progress >= 100) {
                    clearInterval(progressInterval);

                    const completedTrip = await tripApi.completeTrip(tripId);

                    // Update status to COMPLETED
                    setTrips((prevTrips) => ({
                        ...prevTrips,
                        [currentFilter]: prevTrips [currentFilter].map((trip) =>
                            trip.id === tripId
                                ? {
                                    ...trip,
                                    status: completedTrip.status,
                                    progress: undefined, // Hide progress bar
                                }
                                : trip
                        )
                    }));

                    alert(`Trip ${tripId} is completed. Please leave a review.`);
                    triggerReviewModal(tripId); // Custom function to open a review modal
                } else {
                    progress += 10; // Increase progress
                }
            }, 6000); // Progress increases every 6 seconds, completing in 1 minute

            fetchData(); // Refresh the dashboard
        } catch (error) {
            console.error("Error starting trip:", error);
            alert("Failed to start the trip. Please try again.");
        }
    };

    const triggerReviewModal = (tripId: string) => {
        setCurrentTripId(tripId);
        const targetUserId = getTargetUserIdForRating(tripId) ?? null; // Use null if undefined
        setCurrentTargetUserId(targetUserId);
        setRatingModalOpen(true);
    };

    const getTargetUserIdForRating = (tripId: string) => {
        const trip = trips.added.concat(trips.booked).find((t) => t.id === tripId);
        if (!trip) return null;

        if (user?.id === trip.driverId) {
            return trip.bookedUsers.find((booking) => booking.status === "Booked")
                ?.userId;
        } else if (user?.id) {
            return trip.driverId;
        }
        return null;
    };


    const handleReviewSubmit = async (rating: number) => {
        try {
            const response = await fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
          mutation AddRating($voterId: ID!, $userId: ID!, $tripId: ID!, $ratingValue: Float!) {
            addRating(voterId: $voterId, userId: $userId, tripId: $tripId, ratingValue: $ratingValue) {
              id
              user {
                id
              }
              voter {
                id
              }
              trip {
                id
              }
              ratingValue
            }
          }
        `,
                    variables: {
                        voterId: user?.id, // Logged-in user ID
                        userId: currentTargetUserId, // Driver or passenger being rated
                        tripId: currentTripId,
                        ratingValue: rating,
                    },
                }),
            });

            const result = await response.json();
            if (result.errors) {
                console.error("GraphQL Errors:", result.errors);
                alert("Failed to submit rating. Please try again.");
            } else {
                alert("Rating submitted successfully!");
                setRatingModalOpen(false);
                fetchData();
            }
        } catch (error) {
            console.error("Error during API call:", error);
            alert("An error occurred while submitting your rating.");
        }
    };


    const handleReview = (tripId: string, userId: string) => {
        setCurrentTripId(tripId);
        setCurrentTargetUserId(userId);
        setRatingModalOpen(true);
    };


    const fetchData = async () => {
        try {
            const fetchedTrips = await tripApi.getTrips();

            // Filter trips where driverId matches the logged-in user's ID
            const addedTrips = fetchedTrips.filter((trip) =>
                String(trip.driverId) === String(user?.id))
                .map((trip) => ({
                    ...trip,
                    bookedCount:
                    trip.total_capacity,

                    progress:
                        trip.status === "ONGOING"
                            ? Math.floor(Math.random() * 100)
                            : 0,
                }));
            // Filter trips booked by the logged-in user
            const bookedTrips = fetchedTrips.filter((trip) => trip.bookedUsers.some((booking) =>
                String(booking.userId) === String(user?.id))
            );
            setTrips({added: addedTrips, booked: bookedTrips});

            // Mock destination data
            setDestinations([
                {id: "1", location: "Hamburg", status: "SCHEDULED"},
                {id: "2", location: "Berlin", status: "Booked"},
                {id: "3", location: "Munich", status: "Confirmed"},
            ]);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            (async () => await fetchData())();        }
    }, [user?.id]);


    if (loading) return <div className="text-center">Loading dashboard...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column: Deliveries */}
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
                <div className="overflow-y-auto flex-grow" style={{maxHeight: "400px"}}>
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
                <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold mb-4">Manage Trips</h2>
                    <button
                        onClick={() => setCurrentFilter("added")}
                        className={`px-4 py-2 rounded ${
                            currentFilter === "added" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        My Added Trips
                    </button>
                    <button
                        onClick={() => setCurrentFilter("booked")}
                        className={`px-4 py-2 rounded ${
                            currentFilter === "booked" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        My Booked Trips
                    </button>
                </div>

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
                <div className="overflow-y-auto flex-grow" style={{maxHeight: "400px"}}>
                    {trips[currentFilter].length === 0 ? (
                        <p>No trips available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {trips[currentFilter]
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
                                                title="Booked Spaces"
                                            >
                                                🔵 {trip.bookedUsers.filter((booking) => booking.status === "Booked").length}                                            </div>
                                            <div
                                                className="relative cursor-pointer text-orange-500"
                                                title="Confirmed Bookings"
                                            >
                                                🟠 {trip.bookedUsers.filter((booking) => booking.status === "Confirmed").length}
                                            </div>
                                        </div>
                                        {/* List of Bookings */}
                                        {trip.status === "SCHEDULED" && String(user?.id) === String(trip.driverId) && (

                                            <div className="mt-4">
                                                <h4 className="font-bold">Bookings:</h4>
                                                <ul className="space-y-2">
                                                    {trip.bookedUsers?.map((booking) => (
                                                        <li key={booking.id}
                                                            className="flex justify-between items-center">
                                                            <p>User ID: {booking.userId}</p>
                                                            <StarRating rating={trip.rating || 0} />

                                                            <span>Bookings Status: {booking.status}</span>
                                                            {booking.status === "Booked" && (
                                                                <button
                                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                                    onClick={() => handleConfirmBooking(booking.id)}
                                                                >
                                                                    Confirm
                                                                </button>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* Passenger Booking Status */}
                                        {trip.bookedUsers.some((booking) => String(booking.userId) === String(user?.id)) && (
                                            <span
                                                className={`text-sm px-2 py-1 rounded ${
                                                    trip.bookedUsers.find((booking) => String(booking.userId) === String(user?.id))?.status === "Booked"
                                                        ? "bg-blue-200 text-blue-700"
                                                        : trip.bookedUsers.find((booking) => String(booking.userId) === String(user?.id))?.status === "Confirmed"
                                                            ? "bg-orange-200 text-orange-700"
                                                            : "bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                  Your booking status is:{" "}
                                                 {trip.bookedUsers.find((booking) => String(booking.userId) === String(user?.id))?.status}.
                                            </span>
                                        )}


                                        <p>
                                            <strong>Trips Status:</strong> {trip.status}
                                        </p>
                                        {trip.status === "SCHEDULED" && String(user?.id) === String(trip.driverId) && (
                                            <button
                                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                onClick={() => handleStartTrip(trip.id)}
                                            >
                                                Start the Trip
                                            </button>
                                        )}
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
                                        {trip.status === "COMPLETED" && (
                                            <div>
                                                {String(user?.id) === String(trip.driverId) ? (
                                                    // Driver's View
                                                    <div className="mt-4">
                                                        <h4 className="font-bold">Bookings:</h4>
                                                        <ul className="space-y-2">
                                                            {trip.bookedUsers.map((booking) => (
                                                                <li key={booking.id} className="flex justify-between items-center">
                                                                    <p>User ID: {booking.userId}</p>
                                                                    <button
                                                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                                                        onClick={() => handleReview(trip.id, booking.userId)}
                                                                    >
                                                                        Rate Now
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    // Passenger's View
                                                    <button
                                                        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                                                        onClick={() => handleReview(trip.id, trip.driverId)}
                                                    >
                                                        Rate Driver
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <RatingModal
                                            isOpen={ratingModalOpen}
                                            onClose={() => setRatingModalOpen(false)}
                                            onSubmit={handleReviewSubmit}
                                        />
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
