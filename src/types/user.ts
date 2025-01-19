export interface User{
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
}