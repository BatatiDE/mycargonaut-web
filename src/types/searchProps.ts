import { Trip } from "@/types/trip";

export interface SearchProps {
  action: (criteria: SearchCriteria) => void;
}

export interface SearchCriteria {
  startingPoint: string;
  destinationPoint: string;
  date: Date | undefined;
  passengerSeats: number;
  freightSpace: number;
  isFreightOnly: boolean;
  filteredRides: Trip[];
}
