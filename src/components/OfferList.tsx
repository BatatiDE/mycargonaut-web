'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import UserProfileCompact from './UserProfileCompact'
import { tripApi } from '@/utils/tripApi'
import { Trip } from '@/types/trip'

interface OfferListProps {
    type: 'offers' | 'requests'
    searchCriteria: {
        startingPoint: string
        destinationPoint: string
        date: Date | undefined
        passengerSeats: number
        freightSpace: number
        isFreightOnly: boolean
    }
}

export default function OfferList({ type, searchCriteria }: OfferListProps) {
    const router = useRouter()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTrips() {
            setLoading(true)
            setError(null)
            try {
                const allTrips = await tripApi.getTrips()
                const filteredTrips = allTrips.filter(trip => {
                    const tripDate = new Date(trip.date)
                    const matchesType = type === 'offers' ? trip.type === 'OFFER' : trip.type === 'REQUEST'
                    return (
                        matchesType &&
                        (!searchCriteria.startingPoint || trip.startingPoint.toLowerCase().includes(searchCriteria.startingPoint.toLowerCase())) &&
                        (!searchCriteria.destinationPoint || trip.destinationPoint.toLowerCase().includes(searchCriteria.destinationPoint.toLowerCase())) &&
                        (!searchCriteria.date || tripDate.toDateString() === searchCriteria.date.toDateString()) &&
                        (trip.availableSeats >= searchCriteria.passengerSeats) &&
                        (trip.freightSpace >= searchCriteria.freightSpace) &&
                        (!searchCriteria.isFreightOnly || trip.isFreightRide)
                    )
                })
                setTrips(filteredTrips)
            } catch (err) {
                setError('Failed to fetch trips')
                console.error('Error fetching trips:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
    }, [searchCriteria, type])

    const handleAction = async (tripId: string) => {
        try {
            if (type === 'offers') {
                await tripApi.bookTrip(tripId)
                toast({
                    title: "Erfolg",
                    description: "Ihre Fahrt wurde erfolgreich gebucht.",
                })
            } else {
                // For requests, we might need a different action
                toast({
                    title: "Anfrage angenommen",
                    description: "Sie haben die Anfrage erfolgreich angenommen.",
                })
            }
            router.push('/profile')
        } catch (error) {
            console.error('Action failed:', error)
            toast({
                title: "Fehler",
                description: "Es gab ein Problem bei der Aktion. Bitte versuchen Sie es erneut.",
                variant: "destructive",
            })
        }
    }

    if (loading) return <div>Lädt...</div>
    if (error) return <div>Fehler: {error}</div>

    return (
        <div className="space-y-4">
            {trips.length === 0 ? (
                <p>Keine {type === 'offers' ? 'Angebote' : 'Anfragen'} gefunden.</p>
            ) : (
                trips.map(trip => (
                    <Card key={trip.id}>
                        <CardHeader>
                            <CardTitle>{trip.startingPoint} nach {trip.destinationPoint}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p><strong>Datum:</strong> {new Date(trip.date).toLocaleDateString()}</p>
                                    <p><strong>Zeit:</strong> {trip.time}</p>
                                    <p><strong>{type === 'offers' ? 'Verfügbare Plätze' : 'Benötigte Plätze'}:</strong> {trip.availableSeats}</p>
                                    <p><strong>Frachtplatz:</strong> {trip.freightSpace} m³</p>
                                    <p><strong>{type === 'offers' ? 'Preis' : 'Maximaler Preis'}:</strong> €{trip.price}</p>
                                    {trip.isFreightRide && <p><strong>Nur Fracht</strong></p>}
                                </div>
                                {trip.driver ? (
                                    <UserProfileCompact user={trip.driver} />
                                ) : (
                                    <p>Keine Fahrerinformationen verfügbar</p>
                                )}
                            </div>
                            <Button onClick={() => handleAction(trip.id)} className="w-full">
                                {type === 'offers' ? 'Jetzt buchen' : 'Anfrage annehmen'}
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}

