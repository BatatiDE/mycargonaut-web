"use client"

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




