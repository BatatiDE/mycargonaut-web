'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { de } from "date-fns/locale"
import dynamic from 'next/dynamic'
import { tripApi } from '@/utils/tripApi';
import {useAuth} from "@/utils/AuthContext";

const Map = dynamic(() => import('./Map'), { ssr: false })

interface OfferRequestFormProps {
    onLocationSelectAction: (lat: number, lng: number, location: 'from' | 'to') => void;
}

export default function OfferRequestForm({ onLocationSelectAction }: OfferRequestFormProps) {
    const router = useRouter()
    const {user} = useAuth();
    const [error, setError] = useState("");
    const [isOffer, setIsOffer] = useState(true)
    const [form, setForm] = useState(() => ({
        driverId: user?.id ? Number(user.id) : null,
        startingPoint: "",
        destinationPoint: "",
        date: "",
        time: "",
        price: 0,
        availableSeats: 0,
        freightSpace: 0,
        isFreightRide: false,
        vehicle: "",
        notes: "",
        type: "OFFER" as "OFFER" | "REQUEST",
    }));

    const [date, setDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.id) {
            setForm(prev => ({ ...prev, driverId: Number(user.id) }));
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.id) {
            setError("Sie müssen eingeloggt sein, um eine Fahrt anzubieten oder anzufragen.");
            toast({
                title: "Fehler",
                description: "Bitte loggen Sie sich ein, um fortzufahren.",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }

        // Validate required fields
        const requiredFields = ['startingPoint', 'destinationPoint', 'date', 'time', 'price', 'availableSeats', 'freightSpace'];
        for (const field of requiredFields) {
            if (!form[field as keyof typeof form]) {
                setError(`Bitte füllen Sie das Feld ${field} aus.`);
                return;
            }
        }

        try {
            const payload = {
                driverId: Number(user.id),
                startingPoint: form.startingPoint,
                destinationPoint: form.destinationPoint,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: form.time,
                price: Number(form.price),
                availableSeats: Number(form.availableSeats),
                freightSpace: Number(form.freightSpace),
                isFreightRide: form.isFreightRide,
                type: form.type,
                vehicle: form.vehicle || undefined,
                notes: form.notes || undefined
            };

            console.log('Submitting payload:', payload);

            const response = await tripApi.addTrip(payload);

            console.log('Server response:', response);

            toast({
                title: "Erfolg",
                description: `Ihr ${isOffer ? 'Angebot' : 'Gesuch'} wurde veröffentlicht.`,
            });
            router.push('/search');
        } catch (error) {
            console.error('Failed to create ride:', error);
            let errorMessage = "Es gab ein Problem beim Veröffentlichen. Bitte versuchen Sie es erneut.";
            if (error instanceof Error) {
                errorMessage += ` Fehlerdetails: ${error.message}`;
            }
            toast({
                title: "Fehler",
                description: errorMessage,
                variant: "destructive",
            });
            setError(errorMessage);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
                <Switch
                    id="offer-request"
                    checked={isOffer}
                    onCheckedChange={(checked) => {
                        setIsOffer(checked);
                        setForm(prev => ({ ...prev, type: checked ? "OFFER" : "REQUEST" }));
                    }}
                />
                <Label htmlFor="offer-request">{isOffer ? 'Fahrt anbieten' : 'Fahrt suchen'}</Label>
            </div>
            <div className="space-y-2">
                <Label htmlFor="startingPoint">Von</Label>
                <Input
                    id="startingPoint"
                    name="startingPoint"
                    value={form.startingPoint}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="destinationPoint">Nach</Label>
                <Input
                    id="destinationPoint"
                    name="destinationPoint"
                    value={form.destinationPoint}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Datum</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: de }) : <span>Datum auswählen</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                                setDate(newDate);
                                setForm(prev => ({ ...prev, date: newDate ? format(newDate, "yyyy-MM-dd") : "" }));
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="time">Zeit</Label>
                <Input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">{isOffer ? 'Preis (€)' : 'Maximaler Preis (€)'}</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="availableSeats">{isOffer ? 'Verfügbare Passagierplätze' : 'Benötigte Passagierplätze'}</Label>
                <Input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    min="0"
                    value={form.availableSeats}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="freightSpace">{isOffer ? 'Verfügbarer Frachtplatz (m³)' : 'Benötigter Frachtplatz (m³)'}</Label>
                <Input
                    id="freightSpace"
                    name="freightSpace"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.freightSpace}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="isFreightRide"
                    checked={form.isFreightRide}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, isFreightRide: checked }))}
                />
                <Label htmlFor="isFreightRide">Nur Frachttransport</Label>
            </div>
            {isOffer && (
                <div className="space-y-2">
                    <Label htmlFor="vehicle">Fahrzeug/Anhänger</Label>
                    <Select
                        value={form.vehicle}
                        onValueChange={(value) => setForm(prev => ({ ...prev, vehicle: value }))}
                    >
                        <SelectTrigger id="vehicle">
                            <SelectValue placeholder="Fahrzeug/Anhänger auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="car">Auto</SelectItem>
                            <SelectItem value="van">Transporter</SelectItem>
                            <SelectItem value="truck">LKW</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="notes">Zusätzliche Informationen</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Weitere Präferenzen oder Informationen"
                    value={form.notes}
                    onChange={handleInputChange}
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">{isOffer ? 'Angebot veröffentlichen' : 'Gesuch veröffentlichen'}</Button>
        </form>
    )
}

