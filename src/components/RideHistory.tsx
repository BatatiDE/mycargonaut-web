'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Star } from 'lucide-react'
import Rating from './Rating'
import UserProfileCompact from './UserProfileCompact'
import { User } from '@/types/user'

interface Participant {
    id: string
    name: string
    picture: string
    rating: number
    numRides: number
    hasRated: boolean
}

interface RideHistoryItem {
    id: string
    from: string
    to: string
    date: string
    driver: User
    passengers: Participant[]
    type: 'ride' | 'freight'
    isOffered: boolean
    isRated: boolean
    ratings: { [participantId: string]: number[] }
}

interface RideHistoryProps {
    rides: RideHistoryItem[]
    currentUserId: string
}

export default function RideHistory({ rides, currentUserId }: RideHistoryProps) {
    const [showRating, setShowRating] = useState<string | null>(null)

    const handleRatingSubmit = (rideId: string, participantId: string, ratings: number[]) => {
        console.log('Ratings submitted for ride', rideId, 'participant', participantId, ':', ratings);
        setShowRating(null);
    }

    const canSeeRatings = (ride: RideHistoryItem) => {
        return ride.passengers.every(p => p.hasRated) && ride.driver.hasRated
    }

    const getAverageRating = (ratings: number[]) => {
        if (!ratings || ratings.length === 0) return 0;
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }

    return (
        <div className="space-y-4">
            {rides.map((ride) => (
                <Card key={ride.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{ride.from} nach {ride.to}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center mt-2 text-muted-foreground">
                                        <CalendarDays className="w-4 h-4 mr-2" />
                                        <time dateTime={ride.date}>{ride.date}</time>
                                    </div>
                                </CardDescription>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <Badge variant={ride.isOffered ? 'default' : 'secondary'}>
                                    {ride.isOffered ? 'Angebotene Fahrt' : 'Gebuchte Fahrt'}
                                </Badge>
                                <Badge variant={ride.isRated ? 'secondary' : 'outline'}>
                                    {ride.isRated ? 'Bewertet' : 'Nicht bewertet'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            {ride.isOffered ? (
                                <>
                                    <h3 className="font-semibold mb-2">Ihre Mitfahrer:</h3>
                                    {ride.passengers.length > 0 ? (
                                        <ul className="space-y-2">
                                            {ride.passengers.map((passenger) => (
                                                <li key={passenger.id} className="flex items-center justify-between">
                                                    <div className="flex-grow">
                                                        <UserProfileCompact
                                                            user={{
                                                                firstName: passenger.name.split(' ')[0],
                                                                lastName: passenger.name.split(' ')[1] || '',
                                                                picture: passenger.picture,
                                                                rating: passenger.rating,
                                                                numRides: passenger.numRides
                                                            }}
                                                        />
                                                        {canSeeRatings(ride) && ride.ratings[passenger.id] && (
                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                Bewertung für diese Fahrt:
                                                                <span className="ml-1">
                                  <Star className="w-4 h-4 inline-block text-yellow-400" />
                                                                    {ride.ratings[passenger.id] ? getAverageRating(ride.ratings[passenger.id]).toFixed(1) : 'N/A'}
                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!ride.isRated && (
                                                        <Button
                                                            onClick={() => setShowRating(`${ride.id}-${passenger.id}`)}
                                                            size="sm"
                                                            className="ml-4"
                                                        >
                                                            <Star className="w-4 h-4 mr-2" />
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
                                    <h3 className="font-semibold mb-2">Fahrer:</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-grow">
                                            <UserProfileCompact
                                                user={{
                                                    firstName: ride.driver.firstName,
                                                    lastName: ride.driver.lastName,
                                                    picture: ride.driver.picture,
                                                    rating: ride.driver.rating,
                                                    numRides: ride.driver.numRides
                                                }}
                                            />
                                            {canSeeRatings(ride) && ride.ratings[ride.driver.id] && (
                                                <div className="mt-1 text-sm text-muted-foreground">
                                                    Bewertung für diese Fahrt:
                                                    <span className="ml-1">
                            <Star className="w-4 h-4 inline-block text-yellow-400" />
                                                        {ride.ratings[ride.driver.id] ? getAverageRating(ride.ratings[ride.driver.id]).toFixed(1) : 'N/A'}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                        {!ride.isRated && (
                                            <Button
                                                onClick={() => setShowRating(ride.id)}
                                                size="sm"
                                                className="ml-4"
                                            >
                                                <Star className="w-4 h-4 mr-2" />
                                                Bewerten
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {showRating && (
                            ride.isOffered ? (
                                ride.passengers.map(passenger => (
                                    showRating === `${ride.id}-${passenger.id}` && (
                                        <div key={passenger.id} className="mt-4">
                                            <Rating
                                                isDriver={true}
                                                isFreightRide={ride.type === 'freight'}
                                                onSubmit={(ratings) => handleRatingSubmit(ride.id.toString(), passenger.id, ratings)}
                                                participantName={passenger.name}
                                            />
                                        </div>
                                    )
                                ))
                            ) : (
                                showRating === ride.id && (
                                    <div className="mt-4">
                                        <Rating
                                            isDriver={false}
                                            isFreightRide={ride.type === 'freight'}
                                            onSubmit={(ratings) => handleRatingSubmit(ride.id.toString(), ride.driver.id.toString(), ratings)}
                                            participantName={`${ride.driver.firstName} ${ride.driver.lastName}`}
                                        />
                                    </div>
                                )
                            )
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

