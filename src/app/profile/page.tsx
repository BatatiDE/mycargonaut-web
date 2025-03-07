"use client";

import { useState } from "react";
import ProfileForm from "@/components/forms/ProfileForm";
import RideHistory from "@/components/trips/RideHistory";
import RideStatus from "@/components/trips/RideStatus";
import AuthGuard from "@/components/shared/AuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
    const [activeRides, setActiveRides] = useState([
        {
            id: 1,
            from: "Berlin",
            to: "München",
            date: "2023-06-15",
            status: "Upcoming",
            type: "ride" as const,
            isOffered: true,
            driver: {
                id: 123,
                firstName: "John",
                lastName: "Doe",
                picture: "/placeholder.svg",
                rating: 4.5,
                numRides: 50,
                numPassengers: 120,
                weightCarried: 300,
                distanceTraveled: 5000,
                languages: ["Deutsch", "Englisch"],
                isSmoker: false,
                hasRated: false,
                isRated: false,
                email: "john.doe@example.com",
                phone: "123456789",
                birthdate: "1985-05-15",
                additionalNote: "Pünktlich und zuverlässig",
                ratings: {},
            },
            passengers: [
                {
                    id: 2,
                    name: "Anna Müller",
                    picture: "/placeholder.svg",
                    rating: 4.2,
                    numRides: 15,
                    hasRated: false,
                    isRated: false,
                },
                {
                    id: 3,
                    name: "Max Schmidt",
                    picture: "/placeholder.svg",
                    rating: 4.7,
                    numRides: 30,
                    hasRated: false,
                    isRated: false,
                },
            ],
        },
        {
            id: 3,
            from: "Stuttgart",
            to: "Nürnberg",
            date: "2023-06-22",
            status: "Upcoming",
            type: "ride" as const,
            isOffered: true,
            driver: {
                id: 124,
                firstName: "Lisa",
                lastName: "Weber",
                picture: "/placeholder.svg",
                rating: 4.8,
                numRides: 75,
                numPassengers: 200,
                weightCarried: 500,
                distanceTraveled: 8000,
                languages: ["Deutsch", "Französisch"],
                isSmoker: false,
                hasRated: false,
                isRated: false,
                email: "lisa.weber@example.com",
                phone: "987654321",
                birthdate: "1990-08-20",
                additionalNote: "Langjährige Erfahrung",
                ratings: {},
            },
            passengers: [],
        },
    ]);

    const [completedRides, setCompletedRides] = useState([
        {
            id: 8,
            from: "Köln",
            to: "Dresden",
            date: "2023-06-10",
            type: "ride" as const,
            driver: {
                id: 121,
                firstName: "Michael",
                lastName: "Fischer",
                picture: "/placeholder.svg",
                rating: 4.6,
                numRides: 90,
                numPassengers: 150,
                weightCarried: 400,
                distanceTraveled: 7000,
                languages: ["Deutsch", "Spanisch"],
                isSmoker: true,
                hasRated: false,
                isRated: false,
                email: "michael.fischer@example.com",
                phone: "1122334455",
                birthdate: "1980-12-12",
                additionalNote: "Sehr freundlich",
                ratings: {},
            },
            passengers: [],
            isOffered: true,
            isRated: false,
            ratings: {},
        },
    ]);

    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <ProfileForm />
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="active">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="active">Aktive Fahrten</TabsTrigger>
                                    <TabsTrigger value="history">Fahrtenhistorie</TabsTrigger>
                                </TabsList>
                                <TabsContent value="active">
                                    <div className="space-y-4">
                                        {activeRides.map((ride) => (
                                            <RideStatus
                                                key={ride.id}
                                                rideId={ride.id}
                                                isOffered={ride.isOffered}
                                                type={ride.type}
                                                from={ride.from}
                                                to={ride.to}
                                                driver={ride.driver}
                                                onRideCompleteAction={(rideId) => console.log(`Fahrt ${rideId} beendet`)} // ✅ Funktion hinzufügen
                                            />
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="history">
                                    <RideHistory rides={completedRides} currentUserId={123} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}