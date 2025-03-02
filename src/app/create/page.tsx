'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import OfferRequestForm from '@/components/OfferRequestForm'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

// Definition der Props für OfferRequestForm
interface OfferRequestFormProps {
    onLocationSelect: (lat: number, lng: number, type: 'from' | 'to') => void;
}

// Definition der Props für Map
interface MapProps {
    fromLocation?: { lat: number; lng: number } | undefined;
    toLocation?: { lat: number; lng: number } | undefined;
}

export default function Create() {
    const [fromLocation, setFromLocation] = useState<{ lat: number; lng: number } | undefined>(undefined)
    const [toLocation, setToLocation] = useState<{ lat: number; lng: number } | undefined>(undefined)

    const handleLocationSelect = (lat: number, lng: number, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromLocation({ lat, lng })
        } else {
            setToLocation({ lat, lng })
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Angebot/Anfrage erstellen</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hier wird sichergestellt, dass OfferRequestForm die richtige Prop erhält */}
                <OfferRequestForm onLocationSelectAction={handleLocationSelect as OfferRequestFormProps['onLocationSelect']} />
                <div className="lg:block">
                    <h2 className="text-xl font-semibold mb-4">Kartenübersicht</h2>
                    <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                        {/* Hier werden die benötigten Props an Map übergeben */}
                        <Map fromLocation={fromLocation ?? { lat: 0, lng: 0 }} toLocation={toLocation ?? { lat: 0, lng: 0 }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
