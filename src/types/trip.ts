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
    status: 'SCHEDULED' | 'APPROACHING' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'DELAYED';
    type: string;
    vehicle?: string;
    total_capacity: number;  // Diese Eigenschaft hinzufügen, wenn sie im Code verwendet wird
    bookedUsers?: { userId: string }[];  // Diese Eigenschaft hinzufügen, wenn du 'bookedUsers' verwendest
}
