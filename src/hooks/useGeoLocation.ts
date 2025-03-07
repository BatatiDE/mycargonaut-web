import { useState, useEffect } from "react";

interface Location {
    lat: number;
    lng: number;
    address?: string; // Adresse optional hinzufügen
}

export function useGeoLocation() {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation wird nicht unterstützt.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Adresse abrufen (Reverse Geocoding)
                const address = await fetchAddress(lat, lng);

                setLocation({ lat, lng, address });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
    }, []);

    return { location, loading, error };
}

// Funktion für Reverse Geocoding (Google Maps oder OpenStreetMap API nutzen)
async function fetchAddress(lat: number, lng: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        return data.display_name || "Adresse nicht gefunden";
    } catch {
        return "Adresse nicht abrufbar";
    }
}
