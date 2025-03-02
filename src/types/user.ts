export interface User {
    id: string;
    email?: string;  // 🔥 Optional machen
    firstName?: string;
    lastName?: string;
    phone?: string;
    picture?: string;
    birthdate?: string;
    additionalNote?: string;
    rating?: number;
    numRides?: number;
    numPassengers?: number;
    weightCarried?: number;
    distanceTraveled?: number;
    languages?: string[];
    isSmoker?: boolean;
    isActive?: boolean;
    hasRated?: boolean;
    isRated?: boolean;
    ratings?: { [key: string]: number[] };
}
