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
}