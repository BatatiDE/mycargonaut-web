import { User } from '@/types/user';

export interface Trip {
    id: string;
    startingPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    availableSeats: number;
    freightSpace: number;
    isFreightRide: boolean;
    price: number;
    driverId: string;
    driver?: User;
    status: 'SCHEDULED' | 'APPROACHING' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'DELAYED' | 'ONGOING';
    type: string;
    vehicle?: string;
    total_capacity: number;
    bookedUsers?: { userId: string; status: string, id: string  }[];
    startPoint?: string; // Falls du diesen alias brauchst
    availableSpace?: number; // Falls du diesen alias brauchst
    progress?: number;
    rating?: number;
}