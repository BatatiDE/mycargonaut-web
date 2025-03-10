import apiFetch from "@/utils/api";
import { Vehicle } from "@/types/vehicle";

// Alle Fahrzeuge abrufen
export const getVehicles = async (): Promise<Vehicle[]> => {
    try {
        return await apiFetch("/vehicles", { method: "GET" });
    } catch (error) {
        console.error("Fehler beim Abrufen der Fahrzeuge:", error);
        throw error;
    }
};

// Einzelnes Fahrzeug abrufen
export const getVehicleById = async (id: number): Promise<Vehicle> => {
    try {
        return await apiFetch(`/vehicles/${id}`, { method: "GET" });
    } catch (error) {
        console.error(`Fehler beim Abrufen des Fahrzeugs mit ID ${id}:`, error);
        throw error;
    }
};

// Fahrzeug hinzufügen
export const addVehicle = async (vehicleData: Vehicle): Promise<Vehicle> => {
    try {
        return await apiFetch("/vehicles", {
            method: "POST",
            body: JSON.stringify(vehicleData),
        });
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Fahrzeugs:", error);
        throw error;
    }
};

// Fahrzeug aktualisieren
export const updateVehicle = async (
    id: number,
    data: Partial<Vehicle>
): Promise<Vehicle> => {
    try {
        return await apiFetch(`/vehicles/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error(`Fehler beim Aktualisieren des Fahrzeugs mit ID ${id}:`, error);
        throw error;
    }
};

// Fahrzeug löschen
export const deleteVehicle = async (id: number): Promise<void> => {
    try {
        await apiFetch(`/vehicles/${id}`, { method: "DELETE" });
    } catch (error) {
        console.error(`Fehler beim Löschen des Fahrzeugs mit ID ${id}:`, error);
        throw error;
    }
};
