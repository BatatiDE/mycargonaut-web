import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Trip } from "@/types/trip"

interface BookingConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    trip: Trip
}

export default function BookingConfirmationModal({ isOpen, onClose, onConfirm, trip }: BookingConfirmationModalProps) {
    const [isBooking, setIsBooking] = useState(false)

    const handleConfirm = async () => {
        setIsBooking(true)
        try {
            await onConfirm()
        } finally {
            setIsBooking(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buchung bestätigen</DialogTitle>
                    <DialogDescription>Möchten Sie diese Fahrt wirklich buchen?</DialogDescription>
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
                        <strong>Preis:</strong> {trip.price != null ? `€${trip.price.toFixed(2)}` : "Nicht angegeben"}
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
    )
}

