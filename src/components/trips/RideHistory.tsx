"use client";

import { useState } from "react";
import { CalendarDays, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/types/user";

import Rating from "../shared/Rating";
import UserProfileCompact from "../user/UserProfileCompact";

// Erweitere den User-Typ lokal, falls zusätzliche Felder benötigt werden
interface ExtendedUser extends User {
  firstName: string;
  lastName: string;
  picture: string;
  rating: number;
  numRides: number;
  hasRated: boolean;
  isRated: boolean;
  numPassengers: number;
  weightCarried: number;
  distanceTraveled: number;
  languages: string[];
  isSmoker: boolean;
}

interface RideHistoryItem {
  id: number;
  from: string;
  to: string;
  date: string;
  driverId: string; // Vom Backend geliefert
  driver?: ExtendedUser; // Optional
  passengers?: User[]; // Optional
  type: "ride" | "freight";
  isOffered: boolean;
  isRated: boolean;
  ratings: { [userId: number]: number[] };
}

interface RideHistoryProps {
  rides: RideHistoryItem[];
  currentUserId: number;
}

export default function RideHistory({ rides }: RideHistoryProps) {
  const [showRating, setShowRating] = useState<string | null>(null);

  const handleRatingSubmit = (
      rideId: string,
      participantId: string,
      ratings: number[]
  ) => {
    console.log(
        "Ratings submitted for ride",
        rideId,
        "participant",
        participantId,
        ":",
        ratings
    );
    setShowRating(null);
  };

  const canSeeRatings = (ride: RideHistoryItem) => {
    const driverHasRated = ride.driver ? ride.driver.hasRated : false;
    const passengers = ride.passengers ?? [];
    return passengers.every((p) => p.hasRated) && driverHasRated;
  };

  const getAverageRating = (ratings: number[]) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  };

  return (
      <div className="space-y-4">
        {rides.map((ride) => {
          // Erzeuge ein Fallback-Objekt für den Fahrer, falls ride.driver fehlt
          const fallbackDriver: ExtendedUser = {
            id: Number(ride.driverId) || 0,
            firstName: "Unbekannt",
            lastName: "",
            picture: "/placeholder.svg", // Stelle sicher, dass diese Datei im public-Ordner liegt
            rating: 0,
            numRides: 0,
            hasRated: false,
            isRated: false,
            numPassengers: 0,
            weightCarried: 0,
            distanceTraveled: 0,
            languages: [],
            isSmoker: false,
            email: "",
            phone: "",
            birthdate: "",
            additionalNote: "",
          };

          const driverInfo: ExtendedUser = ride.driver ?? fallbackDriver;
          const passengers: User[] = ride.passengers ?? [];

          return (
              <Card key={ride.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {ride.from} nach {ride.to}
                      </CardTitle>
                      <CardDescription>
                        <div className="mt-2 flex items-center text-muted-foreground">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <time dateTime={ride.date}>{ride.date}</time>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={ride.isOffered ? "default" : "secondary"}>
                        {ride.isOffered ? "Angebotene Fahrt" : "Gebuchte Fahrt"}
                      </Badge>
                      <Badge variant={ride.isRated ? "secondary" : "outline"}>
                        {ride.isRated ? "Bewertet" : "Nicht bewertet"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {ride.isOffered ? (
                        <>
                          <h3 className="mb-2 font-semibold">Ihre Mitfahrer:</h3>
                          {passengers.length > 0 ? (
                              <ul className="space-y-2">
                                {passengers.map((passenger) => (
                                    <li
                                        key={passenger.id}
                                        className="flex items-center justify-between"
                                    >
                                      <div className="flex-grow">
                                        <UserProfileCompact user={passenger} />
                                        {canSeeRatings(ride) &&
                                            ride.ratings[passenger.id] && (
                                                <div className="mt-1 text-sm text-muted-foreground">
                                                  Bewertung für diese Fahrt:
                                                  <span className="ml-1">
                                      <Star className="inline-block h-4 w-4 text-yellow-400" />
                                                    {ride.ratings[passenger.id]
                                                        ? getAverageRating(ride.ratings[passenger.id]).toFixed(1)
                                                        : "N/A"}
                                    </span>
                                                </div>
                                            )}
                                      </div>
                                      {!ride.isRated && (
                                          <Button
                                              onClick={() =>
                                                  setShowRating(`${ride.id}-${passenger.id}`)
                                              }
                                              size="sm"
                                              className="ml-4"
                                          >
                                            <Star className="mr-2 h-4 w-4" />
                                            Bewerten
                                          </Button>
                                      )}
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-muted-foreground">Keine Mitfahrer für diese Fahrt.</p>
                          )}
                        </>
                    ) : (
                        <>
                          <h3 className="mb-2 font-semibold">Fahrer:</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              {driverInfo && driverInfo.id ? (
                                  <>
                                    <UserProfileCompact user={driverInfo} />
                                    {canSeeRatings(ride) &&
                                        ride.ratings[Number(driverInfo.id)] && (
                                            <div className="mt-1 text-sm text-muted-foreground">
                                              Bewertung für diese Fahrt:
                                              <span className="ml-1">
                                    <Star className="inline-block h-4 w-4 text-yellow-400" />
                                                {ride.ratings[Number(driverInfo.id)]
                                                    ? getAverageRating(ride.ratings[Number(driverInfo.id)]).toFixed(1)
                                                    : "N/A"}
                                  </span>
                                            </div>
                                        )}
                                  </>
                              ) : (
                                  <p>Keine Fahrerinformationen verfügbar</p>
                              )}
                            </div>
                            {!ride.isRated && (
                                <Button
                                    onClick={() => setShowRating(ride.id.toString())}
                                    size="sm"
                                    className="ml-4"
                                >
                                  <Star className="mr-2 h-4 w-4" />
                                  Bewerten
                                </Button>
                            )}
                          </div>
                        </>
                    )}
                  </div>
                  {showRating &&
                      (ride.isOffered
                          ? passengers.map(
                              (passenger) =>
                                  showRating === `${ride.id}-${passenger.id}` && (
                                      <div key={passenger.id} className="mt-4">
                                        <Rating
                                            isDriver={true}
                                            isFreightRide={ride.type === "freight"}
                                            onSubmitAction={(ratings) =>
                                                handleRatingSubmit(
                                                    ride.id.toString(),
                                                    passenger.id.toString(),
                                                    ratings
                                                )
                                            }
                                            participantName={`${passenger.firstName || ""} ${passenger.lastName || ""}`}
                                        />
                                      </div>
                                  )
                          )
                          : showRating === ride.id.toString() && (
                          <div className="mt-4">
                            <Rating
                                isDriver={false}
                                isFreightRide={ride.type === "freight"}
                                onSubmitAction={(ratings) =>
                                    handleRatingSubmit(
                                        ride.id.toString(),
                                        driverInfo.id.toString(),
                                        ratings
                                    )
                                }
                                participantName={`${driverInfo.firstName} ${driverInfo.lastName}`}
                            />
                          </div>
                      ))}
                </CardContent>
              </Card>
          );
        })}
      </div>
  );
}
