"use client";

import React from "react";

interface Trip {
    start: string;
    destination: string;
    date: string;
    capacity: number;
    booked: number; // Number of seats booked
    confirmed: number; // Number of seats confirmed
    progress: number; // Progress percentage
}

const TripCard = ({ trip }: { trip: Trip }) => {
    return (
        <div className="border p-4 shadow rounded relative">
            <h2 className="font-bold text-lg mb-2">
                {trip.start} → {trip.destination}
            </h2>
            <p>Date: {trip.date}</p>
            <p>Capacity: {trip.capacity}</p>

            {/* Available Spaces */}
            {trip.capacity > 0 && (
                <div className="text-green-500 mt-2">
                    🟢 <span className="ml-1">Available: {trip.capacity} spaces</span>
                </div>
            )}

            {/* Booked and Confirmed Status */}
            <div className="flex space-x-4 mt-2">
                {/* Booked */}
                {trip.booked > 0 && (
                    <div
                        className="flex items-center text-blue-500"
                        title={`${trip.booked} seats booked`}
                    >
                        🔵 <span className="ml-1">{trip.booked} Booked</span>
                    </div>
                )}
                {/* Confirmed */}
                {trip.confirmed > 0 && (
                    <div
                        className="flex items-center text-orange-500"
                        title={`${trip.confirmed} seats confirmed`}
                    >
                        🟠 <span className="ml-1">{trip.confirmed} Confirmed</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <p className="text-sm text-gray-600">Trip Progress</p>
                <div className="w-full bg-gray-200 rounded h-2">
                    <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${trip.progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default TripCard;
