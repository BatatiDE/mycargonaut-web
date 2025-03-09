"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/utils/vehicleValidation";
import { getVehicleById, updateVehicle } from "@/services/vehiclesApi";
import { z } from "zod";

export default function EditVehiclePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ vehicleId sicher konvertieren, aber erst später verwenden
    const vehicleIdParam = searchParams.get("id");
    const vehicleId = vehicleIdParam ? parseInt(vehicleIdParam, 10) : undefined;

    const [loading, setLoading] = useState(true);

    type VehicleFormData = z.infer<typeof vehicleSchema>;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
    });

    useEffect(() => {
        // ✅ API-Call nur ausführen, wenn vehicleId existiert
        if (typeof vehicleId !== "number" || isNaN(vehicleId)) return;

        async function fetchVehicle() {
            try {
                const vehicle = await getVehicleById(vehicleId as number);
                setValue("type", vehicle.type);
                setValue("brand", vehicle.brand);
                setValue("model", vehicle.model);
                setValue("licensePlate", vehicle.licensePlate);
            } catch (error) {
                console.error("Fehler beim Laden des Fahrzeugs:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVehicle();
    }, [vehicleId, setValue]);

    const onSubmit = async (data: VehicleFormData) => {
        // Sicherstellen, dass vehicleId existiert, bevor updateVehicle aufgerufen wird
        if (typeof vehicleId !== "number" || isNaN(vehicleId)) {
            console.error("Fehler: Ungültige Fahrzeug-ID.");
            return;
        }
        try {
            await updateVehicle(vehicleId as number, data);
            alert("Fahrzeug erfolgreich aktualisiert!");
            router.push("/vehicles");
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Fahrzeugs:", error);
        }
    };

    if (loading) return <p>Lade Fahrzeugdaten...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Fahrzeug bearbeiten</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block font-medium">Typ</label>
                    <input {...register("type")} className="w-full p-2 border rounded" />
                    {errors.type && <p className="text-red-500">{errors.type.message}</p>}
                </div>
                <div>
                    <label className="block font-medium">Marke</label>
                    <input {...register("brand")} className="w-full p-2 border rounded" />
                    {errors.brand && <p className="text-red-500">{errors.brand.message}</p>}
                </div>
                <div>
                    <label className="block font-medium">Modell</label>
                    <input {...register("model")} className="w-full p-2 border rounded" />
                    {errors.model && <p className="text-red-500">{errors.model.message}</p>}
                </div>
                <div>
                    <label className="block font-medium">Kennzeichen</label>
                    <input {...register("licensePlate")} className="w-full p-2 border rounded" />
                    {errors.licensePlate && <p className="text-red-500">{errors.licensePlate.message}</p>}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Speichern
                </button>
            </form>
        </div>
    );
}
