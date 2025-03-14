'use client';

import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { deleteVehicle } from '@/services/vehicleService';
import { useRouter } from 'next/navigation';

interface VehicleListProps {
    vehicles: Vehicle[];
    onVehiclesUpdated: () => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onVehiclesUpdated }) => {
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (confirm('Möchtest du dieses Fahrzeug wirklich löschen?')) {
            try {
                await deleteVehicle(id);
                onVehiclesUpdated();
            } catch (error) {
                console.error('Fehler beim Löschen des Fahrzeugs:', error);
            }
        }
    };

    return (
        <div>
            {vehicles.length === 0 ? (
                <p>Keine Fahrzeuge vorhanden.</p>
            ) : (
                <ul className="space-y-4">
                    {vehicles.map((vehicle) => (
                        <li key={vehicle.id} className="p-4 border rounded shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-bold">{vehicle.brand} {vehicle.model}</p>
                                <p className="text-gray-600">Typ: {vehicle.type}</p>
                                <p className="text-gray-600">Kennzeichen: {vehicle.licensePlate}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => router.push(`/my-vehicles/edit/${vehicle.id}`)}
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(vehicle.id!)}
                                >
                                    Löschen
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VehicleList;
