"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Globe, Shield, Truck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-orange-50">
        <div className="container mx-auto">
          <div className="flex flex-col items-center py-20 lg:flex-row">
            <div className="mb-10 lg:mb-0 lg:w-1/2">
              <h1 className="mb-6 text-3xl font-bold lg:text-5xl">
                Mitfahren und Versenden leicht gemacht
              </h1>
              <p className="mb-8 text-xl">
                MyCargonaut verbindet Sie für Mitfahrgelegenheiten und
                Frachttransporte. Sparen Sie Geld und schonen Sie die Umwelt.
              </p>
              <Link href="/register">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/rideshare.jpg"
                alt="Rideshare Image"
                width={700}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section>
        <div className="container mx-auto py-20">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Warum MyCargonaut wählen?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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
      <section className="bg-orange-100">
        <div className="container mx-auto py-20 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Bereit, Ihre Reise mit MyCargonaut zu beginnen?
          </h2>
          <p className="mb-8 text-xl">
            Schließen Sie sich Tausenden zufriedener Benutzer an, die bereits
            Zeit und Geld mit MyCargonaut sparen.
          </p>
          <Link href="/register">
            <Button className="bg-orange-500 px-8 py-4 text-lg text-white hover:bg-orange-600">
              Bei MyCargonaut registrieren
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function VorteilKarte({
  icon,
  titel,
  beschreibung,
}: {
  icon: React.ReactNode;
  titel: string;
  beschreibung: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{titel}</h3>
      <p className="text-gray-600">{beschreibung}</p>
    </div>
  );
}
