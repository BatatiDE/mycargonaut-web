"use client";

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

const TripCard = ({ trip }: { trip: Trip }) => {
  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">
        {trip.startPoint} → {trip.destinationPoint}
      </h2>
      <p>
        <strong>Date:</strong> {trip.date} | <strong>Time:</strong> {trip.time}
      </p>
      <p className="text-sm">
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
      <p
        className={trip.availableSpace > 0 ? "text-green-500" : "text-red-500"}
      >
        🟢 {trip.availableSpace} spaces left
      </p>

      {trip.status === "ONGOING" && trip.progress !== undefined && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Progress</p>
          <div className="h-2 w-full rounded bg-gray-200">
            <div
              className="h-2 rounded bg-blue-500"
              style={{ width: `${trip.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
