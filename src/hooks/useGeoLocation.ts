import { useState, useEffect } from "react";

export const useGeoLocation = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then((response) => response.json())
                        .then((data) => {
                            setAddress(data.display_name);
                            setLoading(false);
                        })
                        .catch(() => setLoading(false));
                },
                () => {
                    setLoading(false);
                    alert("Geolocation not supported or permission denied.");
                }
            );
        } else {
            setLoading(false);
            alert("Geolocation not available.");
        }
    }, []);

    return { location, address, loading };
};