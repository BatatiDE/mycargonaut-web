const API_URL = "http://localhost:8080/api/vehicles"; // D

interface Vehicle {
    id?: number;
    type: string;
    brand: string;
    model: string;
    licensePlate: string;
}

export const getVehicles = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Fehler beim Abrufen der Fahrzeuge");
    return response.json();
};

export const deleteVehicle = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
    if (!response.ok) throw new Error("Fehler beim Löschen des Fahrzeugs");
};

export const addVehicle = async (vehicleData: Vehicle) => {
    const response = await fetch(`${API_URL}/vehicles`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
        throw new Error("Fehler beim Hinzufügen des Fahrzeugs");
    }

    return response.json();
};

export const getVehicleById = async (id: number) => {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Abrufen des Fahrzeugs: ${response.status}`);
    }

    return response.json();
};

export const updateVehicle = async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Fahrzeugs: ${response.status}`);
    }

    return response.json();
};
