/*
import AuthGuard from "@/components/shared/AuthGuard"; // Protect the page
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <ProfileForm />
            </div>
        </AuthGuard>
    );
}
*/

'use client'

import {useState} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import RideStatus from '@/components/RideStatus'
import RideHistory from '@/components/RideHistory'
import {Switch} from "@/components/ui/switch"
import ProfileForm from "@/components/ProfileForm";
import AuthGuard from "@/components/shared/AuthGuard";

export default function Profile() {
    const [activeRides, setActiveRides] = useState([
        {
            id: '1',
            from: 'Berlin',
            to: 'München',
            date: '2023-06-15',
            status: 'Upcoming',
            type: 'ride' as const,
            isOffered: true,
            isRated: false,  // Hinzugefügt
            ratings: {},  // Hinzugefügt
            driver: {
                id: 'currentUserId',
                firstName: 'John',
                lastName: 'Doe',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,  // Hinzugefügt
                isRated: false,  // Hinzugefügt
                email: "",  // Falls Pflichtfeld
                phone: "",  // Falls Pflichtfeld
                birthdate: "",  // Falls Pflichtfeld
                additionalNote: "",  // Falls Pflichtfeld
                ratings: {},  // Falls nötig
            },
            passengers: [
                {
                    id: 'passenger1',
                    name: 'Anna Müller',
                    picture: '/placeholder.svg',
                    rating: 4.2,
                    numRides: 15,
                    hasRated: false,  // Hinzugefügt
                    isRated: false,  // Hinzugefügt
                },
                {
                    id: 'passenger2',
                    name: 'Max Schmidt',
                    picture: '/placeholder.svg',
                    rating: 4.7,
                    numRides: 30,
                    hasRated: false,  // Hinzugefügt
                    isRated: false,  // Hinzugefügt
                }
            ]
        },
        {
            id: '7',
            from: 'Stuttgart',
            to: 'Nürnberg',
            date: '2023-06-22',
            status: 'Upcoming',
            type: 'ride' as const,
            isOffered: true,
            driver: {
                id: 'currentUserId',
                firstName: 'John',
                lastName: 'Doe',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,  // Hinzugefügt
                isRated: false,  // Hinzugefügt
                email: "",  // Falls Pflichtfeld
                phone: "",  // Falls Pflichtfeld
                birthdate: "",  // Falls Pflichtfeld
                additionalNote: "",  // Falls Pflichtfeld
                ratings: {},  // Falls nötig
            },
            passengers: [
                {
                    id: 'passenger3',
                    name: 'Lisa Wagner',
                    picture: '/placeholder.svg',
                    rating: 4.8,
                    numRides: 25
                }
            ]
        },
        {
            id: '2',
            from: 'Hamburg',
            to: 'Frankfurt',
            date: '2023-06-20',
            status: 'In Progress',
            type: 'ride' as const,
            isOffered: true,
            driver: {
                id: 'currentUserId',
                firstName: 'John',
                lastName: 'Doe',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,  // Hinzugefügt
                isRated: false,  // Hinzugefügt
                email: "",  // Falls Pflichtfeld
                phone: "",  // Falls Pflichtfeld
                birthdate: "",  // Falls Pflichtfeld
                additionalNote: "",  // Falls Pflichtfeld
                ratings: {},  // Falls nötig
            },
            passengers: []
        },
        {
            id: '3',
            from: 'Köln',
            to: 'Dresden',
            date: '2023-06-25',
            status: 'Upcoming',
            type: 'ride' as const,
            isOffered: false,
            driver: {
                id: 'otherDriver1',
                firstName: 'Max',
                lastName: 'Musermann',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,
                isRated: false,
                email: "",
                phone: "",
                birthdate: "",
                additionalNote: "",
                ratings: {},
            },
            passengers: []
        },
    ])

    const [completedRides, setCompletedRides] = useState([
        {
            id: '4',
            from: 'Köln',
            to: 'Dresden',
            date: '2023-06-10',
            type: 'ride' as const,
            driver: {
                id: 'currentUserId',
                firstName: 'John',
                lastName: 'Doe',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,
                isRated: false,
                email: "",
                phone: "",
                birthdate: "",
                additionalNote: "",
                ratings: {},
            },
            passengers: [
                {
                    id: 'p1',
                    name: 'Anna Müller',
                    picture: '/placeholder.svg',
                    rating: 4.2,
                    numRides: 15,
                    hasRated: false
                },
                {
                    id: 'p2',
                    name: 'Max Schulz',
                    picture: '/placeholder.svg',
                    rating: 4.7,
                    numRides: 30,
                    hasRated: true
                }
            ],
            isOffered: true,
            isRated: false,
            ratings: {}
        },
        {
            id: '5',
            from: 'München',
            to: 'Berlin',
            date: '2023-06-05',
            type: 'ride' as const,
            driver: {
                id: 'otherDriver2',
                firstName: 'Lisa',
                lastName: 'Weber',
                picture: '/placeholder.svg',
                rating: 4.8,
                numRides: 75,
                hasRated: false,
                isRated: false,
                email: "",
                phone: "",
                birthdate: "",
                additionalNote: "",
                ratings: {},
            },
            passengers: [
                {
                    id: 'currentUserId',
                    name: 'John Doe',
                    picture: '/placeholder.svg',
                    rating: 4.5,
                    numRides: 50,
                    hasRated: true
                }
            ],
            isOffered: false,
            isRated: true,
            ratings: {
                'otherDriver2': [4, 5, 5],
                'currentUserId': [5, 4, 5]
            }
        },
    ])

    const [offeredFreight] = useState([
        {
            id: '6',
            from: 'Köln',
            to: 'Stuttgart',
            date: '2023-06-18',
            status: 'Upcoming',
            type: 'freight' as const,
            isOffered: true,
            driver: {
                id: 'currentUserId',
                firstName: 'John',
                lastName: 'Doe',
                picture: '/placeholder.svg',
                rating: 4.5,
                numRides: 50,
                hasRated: false,
                isRated: false,
                email: "",
                phone: "",
                birthdate: "",
                additionalNote: "",
                ratings: {},
            }
        },
    ])

    const [showOfferedRides, setShowOfferedRides] = useState(true)

    const handleRideComplete = (rideId: string) => {
        const completedRide = activeRides.find(ride => ride.id === rideId)
        if (completedRide) {
            setActiveRides(activeRides.filter(ride => ride.id !== rideId))
            setCompletedRides([...completedRides, {
                ...completedRide,
                passengers: [],
                isRated: false,
                ratings: {}
            }])
        }
    }


    return (
        <AuthGuard>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileForm/>
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
                                    <div className="flex items-center justify-between my-4">
                  <span className="text-small font-medium">
                      {showOfferedRides ? "Angebotene Fahrten" : "Gebuchte Fahrten"}
                  </span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">Gebucht</span>
                                            <Switch
                                                checked={showOfferedRides}
                                                onCheckedChange={setShowOfferedRides}
                                            />
                                            <span className="text-sm">Angeboten</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {showOfferedRides
                                            ? [...activeRides.filter(ride => ride.isOffered), ...offeredFreight]
                                                .filter(ride => ride.type === "ride") // 🔥 Filter direkt in map()
                                                .map(ride => (
                                                    <RideStatus
                                                        key={ride.id}
                                                        rideId={ride.id}
                                                        isOffered={true}
                                                        type={ride.type}
                                                        onRideComplete={handleRideComplete}
                                                        from={ride.from}
                                                        to={ride.to}
                                                        driver={ride.driver}
                                                        passengers={ride.passengers ?? []}
                                                    />
                                                ))
                                            : activeRides.filter(ride => !ride.isOffered).map(ride => (
                                                <RideStatus
                                                    key={ride.id}
                                                    rideId={ride.id}
                                                    isOffered={false}
                                                    type={ride.type}
                                                    onRideComplete={handleRideComplete}
                                                    from={ride.from}
                                                    to={ride.to}
                                                    driver={ride.driver}
                                                />
                                            ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="history">
                                    <div className="flex items-center justify-between my-4">
                                        <span className="text-small font-medium">Fahrtenhistorie</span>
                                    </div>
                                    <RideHistory
                                        rides={completedRides.map(ride => ({
                                            ...ride,
                                            passengers: ride.passengers ?? [],
                                            ratings: Object.fromEntries(
                                                Object.entries(ride.ratings ?? {}).map(([key, value]) => [
                                                    key,
                                                    Array.isArray(value) ? value : []
                                                ])
                                            )
                                        }))}
                                        isDriver={true}
                                        currentUserId="currentUserId"
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}


