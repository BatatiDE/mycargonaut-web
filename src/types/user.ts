export interface User {
    firstName: string
    lastName: string
    email: string
    password: string
    birthdate: number
    isSmoker?: boolean
    picture?: string
    rating?: number
    numPassengers?: number
    numRides?: number
    weightCarried?: number
    distanceTraveled?: number
    languages?: string
    additionalNotes?: string
}