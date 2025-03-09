import apiFetch from "@/utils/api";

// Fahrzeug-Typ
interface Vehicle {
    id?: number;
    type: string;
    brand: string;
    model: string;
    licensePlate: string;
}

// Fahrzeuge abrufen
export const getVehicles = async () => {
    console.log("Fetching vehicles...");
    return apiFetch("/vehicles", { method: "GET" });
};

// Einzelnes Fahrzeug abrufen
export const getVehicleById = async (id: number) => {
    console.log(`Fetching vehicle with ID ${id}...`);
    return apiFetch(`/vehicles/${id}`, { method: "GET" });
};

// Fahrzeug hinzufügen
export const addVehicle = async (vehicleData: Vehicle) => {
    console.log("Adding vehicle:", vehicleData);
    return apiFetch("/vehicles", {
        method: "POST",
        body: JSON.stringify(vehicleData),
    });
};

// Fahrzeug aktualisieren
export const updateVehicle = async (id: number, data: Partial<Vehicle>) => {
    console.log(`Updating vehicle ID ${id}:`, data);
    return apiFetch(`/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

// Fahrzeug löschen
export const deleteVehicle = async (id: number) => {
    console.log(`Deleting vehicle ID ${id}...`);
    return apiFetch(`/vehicles/${id}`, { method: "DELETE" });
};
