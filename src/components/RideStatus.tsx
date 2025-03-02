'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CheckCircle2, AlertCircle, MapIcon } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import UserProfileCompact from './UserProfileCompact'
import { User } from '@/types/user'

interface RideStatusProps {
    rideId: string
    isOffered: boolean
    type: 'ride' | 'freight'
    onRideCompleteAction: (rideId: string) => void
    from: string
    to: string
    driver: User
    passengers?: User[]
}

type StatusType = 'scheduled' | 'approaching' | 'arrived' | 'in_progress' | 'completed' | 'delayed'

interface StatusInfo {
    label: string
    description: string
    icon: React.ReactNode
    offeredActions: string[]
    bookedActions: string[]
    badge: 'default' | 'secondary' | 'destructive'
}

//TODO: Obtain Data from Backend
const statusInfo: Record<StatusType, StatusInfo> = {
    scheduled: {
        label: 'Geplant',
        description: 'Fahrt noch nicht begonnen',
        icon: <Clock className="h-4 w-4" />,
        offeredActions: ['Fahrt starten', 'Position teilen', 'Verspätung melden', 'Kontakt aufnehmen'],
        bookedActions: ['Position anzeigen', 'Verspätung melden', 'Kontakt aufnehmen'],
        badge: 'secondary'
    },
    approaching: {
        label: 'Annäherung',
        description: 'Auf dem Weg zum Treffpunkt',
        icon: <MapPin className="h-4 w-4" />,
        offeredActions: ['Am Treffpunkt angekommen', 'Position teilen', 'Verspätung melden', 'Kontakt aufnehmen'],
        bookedActions: ['Position anzeigen', 'Verspätung melden', 'Kontakt aufnehmen'],
        badge: 'default'
    },
    arrived: {
        label: 'Angekommen',
        description: 'Am Treffpunkt',
        icon: <MapPin className="h-4 w-4" />,
        offeredActions: ['Fahrt beginnen', 'Position teilen', 'Kontakt aufnehmen'],
        bookedActions: ['Ankunft bestätigen', 'Position anzeigen', 'Kontakt aufnehmen'],
        badge: 'default'
    },
    in_progress: {
        label: 'In Fahrt',
        description: 'Fahrt läuft gerade',
        icon: <MapIcon className="h-4 w-4" />,
        offeredActions: ['Position teilen', 'Fahrt beenden', 'Zwischenstopp', 'Notfall melden'],
        bookedActions: ['Position anzeigen', 'Zwischenstopp anfragen', 'Notfall melden'],
        badge: 'default'
    },
    completed: {
        label: 'Abgeschlossen',
        description: 'Fahrt erfolgreich beendet',
        icon: <CheckCircle2 className="h-4 w-4" />,
        offeredActions: [],
        bookedActions: [],
        badge: 'default'
    },
    delayed: {
        label: 'Verspätet',
        description: 'Es gibt eine Verzögerung',
        icon: <AlertCircle className="h-4 w-4" />,
        offeredActions: ['Neue Zeit mitteilen', 'Position teilen', 'Kontakt aufnehmen'],
        bookedActions: ['Neue Zeit bestätigen', 'Position anzeigen', 'Kontakt aufnehmen'],
        badge: 'destructive'
    }
}

export default function RideStatus({ rideId, isOffered, type, onRideCompleteAction, from, to, driver, passengers = [] }: RideStatusProps) {
    const [status, setStatus] = useState<StatusType>('scheduled')
    const [isSharing, setIsSharing] = useState(false)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null)
    const currentStatus = statusInfo[status]

    useEffect(() => {
        let watchId: number | null = null;

        if (isSharing) {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        setLocationError(null);
                        // Here you would typically send this location to your backend
                        console.log('New location:', position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        setLocationError(getLocationErrorMessage(error));
                        setIsSharing(false);
                    },
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                );
            } else {
                setLocationError("Geolocation is not supported by this browser.");
                setIsSharing(false);
            }
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isSharing]);

    const getLocationErrorMessage = (error: GeolocationPositionError) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                return "User denied the request for Geolocation.";
            case error.POSITION_UNAVAILABLE:
                return "Location information is unavailable.";
            case error.TIMEOUT:
                return "The request to get user location timed out.";
            default:
                return "An unknown error occurred.";
        }
    };

    const handleStatusAction = (action: string) => {
        switch (action) {
            case 'Fahrt starten':
                setStatus('approaching')
                setIsSharing(true)
                break
            case 'Position teilen':
                if ("geolocation" in navigator) {
                    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                        if (result.state === 'granted') {
                            setIsSharing(true);
                            toast({
                                title: "Tracking gestartet",
                                description: "Ihr Standort wird nun geteilt.",
                            });
                        } else if (result.state === 'prompt') {
                            // The browser will now prompt the user for permission
                            setIsSharing(true);
                        } else if (result.state === 'denied') {
                            setLocationError("Standortfreigabe wurde verweigert. Bitte aktivieren Sie die Standortfreigabe in Ihren Browsereinstellungen.");
                            toast({
                                title: "Standortfreigabe erforderlich",
                                description: "Bitte aktivieren Sie die Standortfreigabe in Ihren Browsereinstellungen.",
                                variant: "destructive",
                            });
                        }
                    });
                } else {
                    toast({
                        title: "Fehler",
                        description: "Geolocation wird von Ihrem Browser nicht unterstützt.",
                        variant: "destructive",
                    });
                }
                break
            case 'Position anzeigen':
                console.log('Position wird angezeigt')
                break
            case 'Verspätung melden':
                setStatus('delayed')
                setEstimatedArrival('15 Minuten später')
                break
            case 'Am Treffpunkt angekommen':
                setStatus('arrived')
                break
            case 'Ankunft bestätigen':
                setStatus('arrived')
                break
            case 'Fahrt beginnen':
                setStatus('in_progress')
                break
            case 'Fahrt beenden':
                setStatus('completed')
                setIsSharing(false)
                onRideCompleteAction(rideId)
                toast({
                    title: "Fahrt beendet",
                    description: "Die Fahrt wurde erfolgreich beendet.",
                });
                break
            case 'Zwischenstopp':
            case 'Zwischenstopp anfragen':
                console.log('Zwischenstopp wird gehandhabt')
                break
            case 'Notfall melden':
                console.log('Notfall wird gemeldet')
                break
            case 'Neue Zeit mitteilen':
            case 'Neue Zeit bestätigen':
                console.log('Neue Zeit wird mitgeteilt/bestätigt')
                setStatus('scheduled')
                setEstimatedArrival(null)
                break
            case 'Kontakt aufnehmen':
                console.log('Kontakt wird aufgenommen')
                break
            default:
                console.log('Aktion:', action)
        }
    }

    const getLocationInstructions = () => {
        const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
        const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

        if (isChrome) {
            return "Um die Standortfreigabe in Chrome zu aktivieren, klicken Sie auf das Schlosssymbol links neben der URL, wählen Sie 'Standort' und dann 'Zulassen'.";
        } else if (isFirefox) {
            return "Um die Standortfreigabe in Firefox zu aktivieren, klicken Sie auf das Info-Symbol links neben der URL, wählen Sie 'Mehr Informationen' und dann unter Berechtigungen 'Standort' auf 'Zulassen'.";
        } else {
            return "Bitte aktivieren Sie die Standortfreigabe in Ihren Browsereinstellungen.";
        }
    };

    const actions = isOffered ? currentStatus.offeredActions : currentStatus.bookedActions

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{from} nach {to}</CardTitle>
                        <div className="text-sm text-muted-foreground">{type === 'ride' ? 'Fahrt' : 'Fracht'} ID: {rideId}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <Badge variant={isOffered ? 'default' : 'secondary'}>
                            {isOffered ? 'Angebotene Fahrt' : 'Gebuchte Fahrt'}
                        </Badge>
                        <Badge variant={currentStatus.badge}>{currentStatus.label}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                    {currentStatus.icon}
                    <span>{currentStatus.description}</span>
                </div>

                {isOffered ? (
                    <>
                        <h3 className="font-semibold mb-2">Ihre Mitfahrer:</h3>
                        {passengers && passengers.length > 0 ? (
                            <ul className="space-y-2">
                                {passengers.map((passenger) => (
                                    <li key={passenger.id}>
                                        <UserProfileCompact user={passenger} />
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
                        <UserProfileCompact user={driver} />
                    </>
                )}

                {estimatedArrival && (
                    <div className="text-sm text-muted-foreground">
                        Neue geschätzte Ankunft: {estimatedArrival}
                    </div>
                )}

                {isSharing && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <MapIcon className="h-4 w-4" />
                        <span>Position wird geteilt</span>
                    </div>
                )}

                {location && (
                    <div className="text-sm text-muted-foreground">
                        Aktueller Standort: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                )}

                {locationError && (
                    <div className="text-sm text-red-600 space-y-2">
                        <p>Fehler beim Teilen des Standorts: {locationError}</p>
                        <p>{getLocationInstructions()}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setLocationError(null);
                                handleStatusAction('Position teilen');
                            }}
                        >
                            Standortfreigabe erneut versuchen
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {actions.map((action) => (
                        <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleStatusAction(action)}
                        >
                            {action}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

