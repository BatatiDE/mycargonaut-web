"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BookingConfirmationModal from "@/components/modals/BookingConfirmModal";
import OwnTripWarningModal from "@/components/modals/OwnTripWarningModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { tripApi } from "@/services/tripApi";
import type { Trip } from "@/types/trip";

import UserProfileCompact from "../user/UserProfileCompact";

interface OfferListProps {
  type: "offers" | "requests";
  searchCriteria: {
    startingPoint: string;
    destinationPoint: string;
    date: Date | undefined;
    passengerSeats: number;
    freightSpace: number;
    isFreightOnly: boolean;
  };
}

export default function OfferList({ type, searchCriteria }: OfferListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOwnTripModalOpen, setIsOwnTripModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError(null);
      try {
        const allTrips = await tripApi.getTrips();
        const filteredTrips = allTrips.filter((trip) => {
          const tripDate = new Date(trip.date);
          const matchesType =
            type === "offers" ? trip.type === "OFFER" : trip.type === "REQUEST";
          return (
            matchesType &&
            (!searchCriteria.startingPoint ||
              trip.startingPoint
                .toLowerCase()
                .includes(searchCriteria.startingPoint.toLowerCase())) &&
            (!searchCriteria.destinationPoint ||
              trip.destinationPoint
                .toLowerCase()
                .includes(searchCriteria.destinationPoint.toLowerCase())) &&
            (!searchCriteria.date ||
              tripDate.toDateString() === searchCriteria.date.toDateString()) &&
            trip.availableSeats >= searchCriteria.passengerSeats &&
            trip.freightSpace >= searchCriteria.freightSpace &&
            (!searchCriteria.isFreightOnly || trip.isFreightRide)
          );
        });
        setTrips(filteredTrips);
      } catch (err) {
        setError("Failed to fetch trips");
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [searchCriteria, type]);

  // Hier wird geprüft, ob die Fahrt vom aktuellen Benutzer erstellt wurde.
  const handleAction = (trip: Trip) => {
    const userIdStr = String(user?.id);
    const tripDriverId =
      trip.driverId !== undefined && trip.driverId !== null
        ? String(trip.driverId)
        : trip.driver
          ? String(trip.driver.id)
          : null;

    console.log("User ID:", userIdStr);
    console.log("Trip Driver ID:", tripDriverId);

    if (tripDriverId === userIdStr) {
      // Eigene Fahrt: Öffne das eigene Warnmodal.
      setSelectedTrip(trip);
      setIsOwnTripModalOpen(true);
      return;
    }

    // Normale Buchung: Öffne das Buchungsbestätigungsmodal.
    setSelectedTrip(trip);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrip) {
      console.error("No trip selected for booking");
      return;
    }

    try {
      console.log("Sending booking request for trip:", selectedTrip.id);
      const result = await tripApi.bookTrip(selectedTrip.id.toString());
      console.log("Received booking response:", result);
      if (result.success) {
        toast({
          title: "Erfolg",
          description:
            result.message || "Ihre Fahrt wurde erfolgreich gebucht.",
        });
        setIsBookingModalOpen(false);
        router.push("/profile");
      } else {
        throw new Error(result.message || "Buchung fehlgeschlagen");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Fehler",
        description:
          error instanceof Error
            ? error.message
            : "Es gab ein Problem bei der Buchung. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div className="space-y-4">
      {trips.length === 0 ? (
        <p>Keine {type === "offers" ? "Angebote" : "Anfragen"} gefunden.</p>
      ) : (
        trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>
                {trip.startingPoint} nach {trip.destinationPoint}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p>
                    <strong>Datum:</strong>{" "}
                    {new Date(trip.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Zeit:</strong> {trip.time}
                  </p>
                  <p>
                    <strong>
                      {type === "offers"
                        ? "Verfügbare Plätze"
                        : "Benötigte Plätze"}
                      :
                    </strong>{" "}
                    {trip.availableSeats}
                  </p>
                  <p>
                    <strong>Frachtplatz:</strong> {trip.freightSpace} m³
                  </p>
                  <p>
                    <strong>
                      {type === "offers" ? "Preis" : "Maximaler Preis"}:
                    </strong>{" "}
                    €{trip.price}
                  </p>
                  {trip.isFreightRide && (
                    <p>
                      <strong>Nur Fracht</strong>
                    </p>
                  )}
                </div>
                {trip.driver ? (
                  <UserProfileCompact user={trip.driver} />
                ) : (
                  <p>Keine Fahrerinformationen verfügbar</p>
                )}
              </div>
              <Button onClick={() => handleAction(trip)} className="w-full">
                {type === "offers" ? "Jetzt buchen" : "Anfrage annehmen"}
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {selectedTrip && isBookingModalOpen && (
        <BookingConfirmationModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
          trip={selectedTrip}
        />
      )}
      {selectedTrip && isOwnTripModalOpen && (
        <OwnTripWarningModal
          isOpen={isOwnTripModalOpen}
          onClose={() => setIsOwnTripModalOpen(false)}
        />
      )}
    </div>
  );
}
