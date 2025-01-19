/*
'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

const fromIcon = new L.Icon({
    iconUrl: '/leaflet/marker-icon-green.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x-green.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const toIcon = new L.Icon({
    iconUrl: '/leaflet/marker-icon-red.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x-red.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface MapProps {
    onLocationSelect: (lat: number, lng: number, type: 'from' | 'to') => void
    fromLocation?: { lat: number; lng: number } | null
    toLocation?: { lat: number; lng: number } | null
}

function MapEvents({ onLocationSelect, fromLocation, toLocation }: {
    onLocationSelect: (lat: number, lng: number, type: 'from' | 'to') => void
    fromLocation: { lat: number; lng: number } | null
    toLocation: { lat: number; lng: number } | null
}) {
    const map = useMapEvents({
        click(e) {
            if (!fromLocation) {
                onLocationSelect(e.latlng.lat, e.latlng.lng, 'from')
            } else if (!toLocation) {
                onLocationSelect(e.latlng.lat, e.latlng.lng, 'to')
            }
        },
    })

    return null
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap()
    map.setView(center, map.getZoom())
    return null
}

export default function Map({ onLocationSelect, fromLocation, toLocation }: MapProps) {
    const [center, setCenter] = useState<[number, number]>([51.1657, 10.4515]) // Germany center

    const handleLocationSelect = useCallback((lat: number, lng: number, type: 'from' | 'to') => {
        onLocationSelect(lat, lng, type)
        setCenter([lat, lng])
    }, [onLocationSelect])

    useEffect(() => {
        if (fromLocation) {
            setCenter([fromLocation.lat, fromLocation.lng])
        } else if (toLocation) {
            setCenter([toLocation.lat, toLocation.lng])
        }
    }, [fromLocation, toLocation])

    return (
        <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fromLocation && (
                <Marker position={[fromLocation.lat, fromLocation.lng]} icon={fromIcon}>
                </Marker>
            )}
            {toLocation && (
                <Marker position={[toLocation.lat, toLocation.lng]} icon={toIcon}>
                </Marker>
            )}
            <MapEvents onLocationSelect={handleLocationSelect} fromLocation={fromLocation} toLocation={toLocation} />
            <ChangeView center={center} />
        </MapContainer>
    )
}

*/x

export default function Map(){
    return (
        <div>
            <h1>Map</h1>
        </div>
    )
}
