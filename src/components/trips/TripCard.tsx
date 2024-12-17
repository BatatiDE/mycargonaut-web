"use client";

import React from "react";

interface Trip {
    startPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    availableSpace: number;
    booked?: number;
    confirmed?: number;
    progress?: number; // Progress percentage
}

const TripCard = ({ trip }: { trip: Trip }) => {
    return (
        <div className="border p-4 shadow rounded relative bg-white">
            <h2 className="font-bold text-lg mb-2">
                {trip.startPoint} → {trip.destinationPoint}
            </h2>
            <p>Date: {trip.date} | Time: {trip.time}</p>

            {/* Status Icons */}
            <div className="flex gap-4 mt-2">
                <div className="text-green-500" title="Available Spaces">
                    🟢 {trip.availableSpace}
                </div>
                <div className="text-blue-500" title="Booked">
                    🔵 {trip.booked || 0}
                </div>
                <div className="text-orange-500" title="Confirmed">
                    🟠 {trip.confirmed || 0}
                </div>
            </div>

            {/* Progress Bar */}
            {trip.progress !== undefined && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Trip Progress</p>
                    <div className="w-full bg-gray-200 rounded h-2">
                        <div
                            className="bg-blue-500 h-2 rounded"
                            style={{ width: `${trip.progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripCard;
