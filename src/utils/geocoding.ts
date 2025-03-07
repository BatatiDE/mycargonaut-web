/* export async function getCoordinatesFromAddress(address: string) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data.length === 0) return null;
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch (error) {
        console.error("Fehler beim Abrufen der Koordinaten:", error);
        return null;
    }
}
*/
export async function getCoordinatesFromAddress(address: string) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (!data || data.length === 0) {
            return [];
        }

        return data.map((item: any) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        }));
    } catch (error) {
        console.error("Fehler beim Abrufen der Koordinaten:", error);
        return [];
    }
}

export async function getAddressFromCoordinates(lat: number, lng: number) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        return data.display_name || null;
    } catch (error) {
        console.error("Fehler beim Abrufen der Adresse:", error);
        return null;
    }
}

export async function getAddressSuggestions(query: string) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        return data.map((item: any) => item.display_name);
    } catch (error) {
        console.error("Fehler beim Abrufen der Adressvorschläge:", error);
        return [];
    }
}
