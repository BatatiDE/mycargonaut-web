export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  picture: string | null;
  birthdate: string | null;
  additionalNote: string | null;
  rating: number | null;
  numRides: number | null;
  numPassengers: number | null;
  weightCarried: number | null;
  distanceTraveled: number | null;
  languages: string[] | null;
  isSmoker: boolean | null;
  hasRated?: boolean;
}

export interface Ride {
  id: number;
  from: string;
  to: string;
  date: string;
  status: "Upcoming" | "In Progress" | "Completed";
  type: "ride" | "freight";
  isOffered: boolean;
  driver: User;
  passengers: User[];
  isRated: boolean;
  ratings: { [userId: number]: number[] };
}
