import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Trip } from "@/types/trip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  trip: Trip;
}

export default function BookingConfirmationModal({
                                                   isOpen,
                                                   onClose,
                                                   onConfirm,
                                                   trip,
                                                 }: BookingConfirmationModalProps) {
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConfirm = async () => {
    // Hier wird noch einmal geprüft – redundant, aber zur doppelten Absicherung.
    const userIdStr = String(user?.id);
    const tripDriverId =
        trip.driverId !== undefined && trip.driverId !== null
            ? String(trip.driverId)
            : trip.driver
                ? String(trip.driver.id)
                : null;

    if (tripDriverId === userIdStr) {
      toast({
        title: "Eigene Fahrt",
        description:
            "Sie können Ihre eigene Fahrt nicht buchen. Bitte nutzen Sie die Verwaltungsoptionen in Ihrem Profil.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    setIsBooking(true);
    try {
      await onConfirm();
    } finally {
      setIsBooking(false);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buchung bestätigen</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Fahrt wirklich buchen?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>Von:</strong> {trip.startingPoint}
            </p>
            <p>
              <strong>Nach:</strong> {trip.destinationPoint}
            </p>
            <p>
              <strong>Datum:</strong> {new Date(trip.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Zeit:</strong> {trip.time}
            </p>
            <p>
              <strong>Preis:</strong>{" "}
              {trip.price != null ? `€${trip.price.toFixed(2)}` : "Nicht angegeben"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isBooking}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirm} disabled={isBooking}>
              {isBooking ? "Buchung läuft..." : "Bestätigen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
