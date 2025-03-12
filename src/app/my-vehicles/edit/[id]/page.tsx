'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getVehicleById, updateVehicle } from '@/services/vehicleService';
import { Vehicle } from '@/types/vehicle';

const carBrands = [
    'Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Ford', 'Opel', 'Toyota', 'Honda', 'Renault', 'Peugeot', 'Andere'
];

const EditVehiclePage: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        type: '',
        brand: '',
        model: '',
        licensePlate: '',
    });
    const [customBrand, setCustomBrand] = useState('');

    useEffect(() => {
        if (id) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const vehicle = await getVehicleById(Number(id));
            setFormData(vehicle);
            if (!carBrands.includes(vehicle.brand)) {
                setCustomBrand(vehicle.brand);
                setFormData((prev) => ({ ...prev, brand: 'Andere' }));
            }
        } catch (error) {
            console.error('Fehler beim Laden des Fahrzeugs:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            brand: formData.brand === 'Andere' ? customBrand : formData.brand,
        };
        try {
            await updateVehicle(Number(id), updatedData as Vehicle);
            router.push('/my-vehicles');
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Fahrzeugs:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fahrzeug bearbeiten</h1>
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Speichern</button>
            </form>
        </div>
    );
};

export default EditVehiclePage;
