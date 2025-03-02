export interface User {
    id: string;  // Ändere id auf string oder auf 'number' im Backend.
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
    isActive: boolean;
}
