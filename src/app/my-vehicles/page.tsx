'use client';

import React, { useEffect, useState } from 'react';
import VehicleList from '@/components/vehicles/VehicleList';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { getVehicles } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicle';

const MyVehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // 🛠️ FIX: Funktion vor useEffect definieren
    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Fahrzeuge:', error);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchVehicles(); // Funktion wird jetzt richtig aufgerufen
    }, []);

    if (!isMounted) return null; // Verhindert SSR-Hydration-Fehler

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Meine Fahrzeuge</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => setIsAdding(!isAdding)}
            >
                {isAdding ? 'Abbrechen' : 'Fahrzeug hinzufügen'}
            </button>
            {isAdding && <VehicleForm onVehicleAdded={fetchVehicles} />}
            <VehicleList vehicles={vehicles} onVehiclesUpdated={fetchVehicles} />
        </div>
    );
};

export default MyVehiclesPage;
