export interface Booking {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  location: string;
  status: "SCHEDULED" | "Booked" | "Confirmed";
}
