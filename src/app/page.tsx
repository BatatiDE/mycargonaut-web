/*
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext"; // Import the AuthContext hook
import "leaflet/dist/leaflet.css";

export default function LandingPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const router = useRouter();
    const { user } = useAuth(); // Get the `user` from the AuthContext

    const handleSearch = () => {
        router.push(`/search?from=${from}&to=${to}&date=${date}`);
    };


    return (
        <div className="min-h-screen flex flex-col items-start justify-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to MyCargonaut
                </h1>
                <p className="text-gray-600">
                    Find or offer rides and freight-sharing solutions quickly and effortlessly.
                </p>
            </header>

            <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quick Search</h2>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From</label>
                        <input
                            type="text"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="Enter starting location"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">To</label>
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="Enter destination"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Search Now
                    </button>
                </form>
            </div>

            <footer className="mt-10 text-gray-500">
                <button
                    onClick={() => {
                        if (user) {
                            router.push("/profile");
                        } else {
                            router.push("/register");
                        }
                    }}
                    className="text-blue-500 hover:underline"
                >
                    {user ? "Go to Profile" : "Get Started"}
                </button>
            </footer>

        </div>
    );
}
*/

/*"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useAuth} from "@/utils/AuthContext";

export default function LandingPage() {
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState<Date>()
    const router = useRouter();
    const { user } = useAuth();


    const handleSearch = () => {
        router.push(`/search?from=${from}&to=${to}&date=${date ? format(date, 'yyyy-MM-dd') : ''}`)
    }

    return (
        <div className="min-h-screen flex flex-col items-end justify-center p-4">
            <header className="text-center mb-10">
                <p className="text-2xl font-bold text-gray-600">
                    Find or offer rides and freight-sharing solutions quickly and effortlessly.
                </p>
            </header>

            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Quick Search</CardTitle>
                    <CardDescription>Find your next ride or shipping opportunity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSearch()
                    }}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="from">From</Label>
                                <Input
                                    id="from"
                                    placeholder="Enter starting location"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="to">To</Label>
                                <Input
                                    id="to"
                                    placeholder="Enter destination"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSearch}>Search Now</Button>
                </CardFooter>
            </Card>

            <footer className="mt-10">
                <Button
                    variant="link"
                    onClick={() => {
                        if (user) {
                            router.push("/profile")
                        } else {
                            router.push("/register")
                        }
                    }}
                >
                    {user ? "Go to Profile" : "Get Started"}
                </Button>
            </footer>
        </div>
    )
}*/

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Globe, Truck, Shield } from 'lucide-react'

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-orange-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 mb-10 lg:mb-0">
                            <h1 className="text-3xl lg:text-5xl font-bold mb-6">Mitfahren und Versenden leicht gemacht</h1>
                            <p className="text-xl mb-8">MyCargonaut verbindet Sie für Mitfahrgelegenheiten und Frachttransporte. Sparen Sie Geld und schonen Sie die Umwelt.</p>
                            <Link href="/register">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                    Jetzt starten
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="lg:w-1/2">
                            <img src="/rideshare.jpg" alt="Rideshare Image" className="rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Vorteile */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Warum MyCargonaut wählen?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <VorteilKarte
                            icon={<Users className="h-12 w-12 text-orange-500" />}
                            titel="Gemeinschaftsorientiert"
                            beschreibung="Verbinden Sie sich mit freundlichen Fahrern, Mitfahrern und Frachtanbietern in Ihrer Umgebung."
                        />
                        <VorteilKarte
                            icon={<Globe className="h-12 w-12 text-orange-500" />}
                            titel="Umweltfreundlich"
                            beschreibung="Reduzieren Sie Ihren CO2-Fußabdruck durch optimierte Routen und geteilte Fahrten."
                        />
                        <VorteilKarte
                            icon={<Truck className="h-12 w-12 text-orange-500" />}
                            titel="Vielseitiger Transport"
                            beschreibung="Von Mitfahrgelegenheiten bis hin zu Frachttransporten - MyCargonaut hat für alles eine Lösung."
                        />
                        <VorteilKarte
                            icon={<Shield className="h-12 w-12 text-orange-500" />}
                            titel="Sicher & Zuverlässig"
                            beschreibung="Verifizierte Benutzer, sichere Zahlungen und 24/7 Support für Ihre Sicherheit."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-orange-100 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Bereit, Ihre Reise mit MyCargonaut zu beginnen?</h2>
                    <p className="text-xl mb-8">Schließen Sie sich Tausenden zufriedener Benutzer an, die bereits Zeit und Geld mit MyCargonaut sparen.</p>
                    <Link href="/register">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4">
                            Bei MyCargonaut registrieren
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

function VorteilKarte({ icon, titel, beschreibung }: { icon: React.ReactNode; titel: string; beschreibung: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{titel}</h3>
            <p className="text-gray-600">{beschreibung}</p>
        </div>
    )
}




