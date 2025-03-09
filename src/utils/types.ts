export interface Booking {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
}

/*export interface Trip {
    id: string;
    driverId: string;
    startPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    availableSeats: number;
    total_capacity: number;
    status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED";
    progress?: number;
    bookedUsers: Booking[];
    rating?: number;
}*/

export interface Destination {
  id: string;
  location: string;
  status: "SCHEDULED" | "Booked" | "Confirmed";
}
