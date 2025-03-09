"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "@/hooks/use-toast";

interface Vehicle {
    id: number;
    type: string;
    brand: string;
    model: string;
    licensePlate: string;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});
    const router = useRouter();

    // Fahrzeuge abrufen
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) throw new Error("Kein Auth-Token vorhanden. Bitte einloggen.");

                const res = await fetch("http://localhost:8080/api/vehicles", {
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    },

                });

                if (!res.ok) throw new Error(`Fehler: ${res.status}`);
                const data = await res.json();
                setVehicles(data);
            } catch (error) {
                toast({
                    title: "Fehler",
                    description: "Fahrzeuge konnten nicht geladen werden",
                    variant: "destructive",
                });
                console.error("Fehler:", error);
            }
        };

        fetchVehicles();
    }, []);

    // Fahrzeug hinzufügen
    const handleAddVehicle = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast({title: "Fehler", description: "Bitte einloggen", variant: "destructive"});
                return;
            }

            const res = await fetch("http://localhost:8080/api/vehicles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newVehicle),
            });

            if (!res.ok) throw new Error(`Fehler: ${res.status}`);
            const createdVehicle = await res.json();

            setVehicles((prev) => [...prev, createdVehicle]); // Direkt in State setzen
            setNewVehicle({});
            toast({title: "Erfolg", description: "Fahrzeug hinzugefügt"});
        } catch (error) {
            toast({
                title: "Fehler",
                description: "Fahrzeug konnte nicht hinzugefügt werden",
                variant: "destructive",
            });
            console.error("Fehler:", error);
        }
    };

    // Fahrzeug löschen
    const handleDeleteVehicle = async (id: number) => {
        if (!confirm("Möchtest du dieses Fahrzeug wirklich löschen?")) return;

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
                method: "DELETE",
                headers: token ? {Authorization: `Bearer ${token}`} : {},
            });

            if (!res.ok) throw new Error(`Fehler: ${res.status}`);

            setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
            toast({title: "Erfolg", description: "Fahrzeug gelöscht"});
        } catch (error) {
            toast({
                title: "Fehler",
                description: "Fahrzeug konnte nicht gelöscht werden",
                variant: "destructive",
            });
            console.error("Fehler:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Meine Fahrzeuge</h1>
            <div className="mb-4 space-y-2">
                <Label>Typ</Label>
                <Input
                    value={newVehicle.type || ""}
                    onChange={(e) => setNewVehicle((prev) => ({...prev, type: e.target.value}))}
                />
                <Label>Marke</Label>
                <Input
                    value={newVehicle.brand || ""}
                    onChange={(e) => setNewVehicle((prev) => ({...prev, brand: e.target.value}))}
                />
                <Label>Modell</Label>
                <Input
                    value={newVehicle.model || ""}
                    onChange={(e) => setNewVehicle((prev) => ({...prev, model: e.target.value}))}
                />
                <Label>Kennzeichen</Label>
                <Input
                    value={newVehicle.licensePlate || ""}
                    onChange={(e) =>
                        setNewVehicle((prev) => ({...prev, licensePlate: e.target.value}))
                    }
                />
                <Button onClick={handleAddVehicle} className="mt-2">
                    Fahrzeug hinzufügen
                </Button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Meine Fahrzeuge:</h2>
            <ul className="space-y-2">
                {vehicles.map((v) => (
                    <li key={v.id} className="border p-2 rounded flex justify-between">
                        <span>
                            {v.brand} {v.model} ({v.licensePlate})
                        </span>
                        <div>
                            <Button
                                className="mr-2 bg-yellow-500"
                                onClick={() => router.push(`/vehicles/edit?id=${v.id}`)}
                            >
                                Bearbeiten
                            </Button>
                            <Button className="bg-red-500" onClick={() => handleDeleteVehicle(v.id)}>
                                Löschen
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
