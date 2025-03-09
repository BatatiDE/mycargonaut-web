"use client";

import { useEffect, useState } from "react";
import ProfileForm from "@/components/forms/ProfileForm";
import RideHistory from "@/components/trips/RideHistory";
import RideStatus from "@/components/trips/RideStatus";
import AuthGuard from "@/components/shared/AuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tripApi } from "@/services/tripApi";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
    const { user } = useAuth();
    const [activeRides, setActiveRides] = useState<any[]>([]);
    const [completedRides, setCompletedRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            tripApi
                .getTrips()
                .then((trips) => {
                    // Filtert nur die Fahrten, an denen der aktuelle User beteiligt ist:
                    // entweder als Fahrer oder als gebuchter Mitfahrer.
                    // Im Filter und in der Übergabe an RideStatus:
                    const userIdStr = String(user!.id);

                    const userRides = trips.filter((trip: any) =>
                        trip.driverId === userIdStr ||
                        (trip.bookedUsers &&
                            trip.bookedUsers.some(
                                (booking: any) => booking.userId === userIdStr
                            ))
                    );



                    // Aufteilen in aktive Fahrten (nicht abgeschlossen) und Fahrtenhistorie (abgeschlossen)
                    setActiveRides(userRides.filter((trip: any) => trip.status !== "COMPLETED"));
                    setCompletedRides(userRides.filter((trip: any) => trip.status === "COMPLETED"));
                })
                .catch((err) => {
                    console.error("Fehler beim Laden der Fahrten", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <div>Lädt...</div>;

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
                                                isOffered={ride.driverId === String(user!.id)}
                                                type={ride.type === "OFFER" ? "ride" : "ride"}
                                                from={ride.startingPoint}
                                                to={ride.destinationPoint}
                                                driver={ride.driver || {
                                                    id: ride.driverId,
                                                    firstName: "Unbekannt",
                                                    lastName: "",
                                                    picture: "/placeholder.svg",
                                                    rating: 0,
                                                    numRides: 0,
                                                }}
                                                passengers={ride.bookedUsers || []}
                                                onRideCompleteAction={(rideId) => console.log(`Fahrt ${rideId} beendet`)}
                                            />

                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="history">
                                    <RideHistory rides={completedRides} currentUserId={user!.id} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}
