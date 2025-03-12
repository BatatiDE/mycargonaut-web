'use client';

import React, { useState } from 'react';
import { addVehicle } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicle';

const carBrands = [
    'Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Ford', 'Opel', 'Toyota', 'Honda', 'Renault', 'Peugeot', 'Andere'
];

interface VehicleFormProps {
    onVehicleAdded: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onVehicleAdded }) => {
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        type: '',
        brand: '',
        model: '',
        licensePlate: '',
    });
    const [customBrand, setCustomBrand] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const vehicleData = {
            ...formData,
            brand: formData.brand === 'Andere' ? customBrand : formData.brand,
        };
        try {
            await addVehicle(vehicleData as Vehicle);
            onVehicleAdded();
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Fahrzeugs:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md space-y-4">
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Marke auswählen</option>
                {carBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
            {formData.brand === 'Andere' && (
                <input
                    type="text"
                    name="customBrand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="Eigene Marke eingeben"
                    className="w-full p-2 border rounded"
                />
            )}
            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Modell" className="w-full p-2 border rounded" required />
            <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Fahrzeugtyp" className="w-full p-2 border rounded" required />
            <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="Kennzeichen" className="w-full p-2 border rounded" required />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Fahrzeug hinzufügen</button>
        </form>
    );
};

export default VehicleForm;
