"use client";

import {useEffect, useState} from "react";
import {getVehicles, deleteVehicle, addVehicle} from "@/services/vehicleService";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {vehicleSchema} from "@/utils/vehicleValidation";

interface Vehicle {
    id: number;
    type: string;
    brand: string;
    model: string;
    licensePlate: string;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const router = useRouter();

    const {register, handleSubmit, formState: {errors}} = useForm<Vehicle>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            id: 0,
            type: "",
            brand: "",
            model: "",
            licensePlate: "",
        },
    });


    useEffect(() => {
        async function fetchVehicles() {
            try {
                const data = await getVehicles();
                setVehicles(data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        }

        void fetchVehicles();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Möchtest du dieses Fahrzeug wirklich löschen?")) {
            try {
                await deleteVehicle(id);
                setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            } catch (error) {
                console.error("Fehler beim Löschen:", error);
            }
        }
    };

    // 🚀 Fahrzeug hinzufügen
    const onSubmit = async (data: Vehicle) => {
        try {
            await addVehicle(data);
            router.push("/vehicles");
        } catch (error) {
            console.error("Fehler beim Hinzufügen:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fahrzeugverwaltung</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-2">
                <input {...register("type")} placeholder="Fahrzeugtyp" className="border p-2 w-full"/>
                {errors.type && <p className="text-red-500">{errors.type.message as string}</p>}

                <input {...register("brand")} placeholder="Marke" className="border p-2 w-full"/>
                {errors.brand && <p className="text-red-500">{errors.brand.message as string}</p>}

                <input {...register("model")} placeholder="Modell" className="border p-2 w-full"/>
                {errors.model && <p className="text-red-500">{errors.model.message as string}</p>}

                <input {...register("licensePlate")} placeholder="Kennzeichen" className="border p-2 w-full"/>
                {errors.licensePlate && <p className="text-red-500">{errors.licensePlate.message as string}</p>}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Fahrzeug hinzufügen
                </button>
            </form>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Typ</th>
                    <th className="border p-2">Marke</th>
                    <th className="border p-2">Modell</th>
                    <th className="border p-2">Kennzeichen</th>
                    <th className="border p-2">Aktionen</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.map(vehicle => (
                    <tr key={vehicle.id} className="border">
                        <td className="p-2">{vehicle.type}</td>
                        <td className="p-2">{vehicle.brand}</td>
                        <td className="p-2">{vehicle.model}</td>
                        <td className="p-2">{vehicle.licensePlate}</td>
                        <td className="p-2">
                            <button
                                className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                                onClick={() => router.push(`/vehicles/edit/${vehicle.id}`)}
                            >
                                Bearbeiten
                            </button>
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded"
                                onClick={() => handleDelete(vehicle.id)}
                            >
                                Löschen
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
