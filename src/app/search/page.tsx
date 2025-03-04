"use client";

import { useState } from "react";

import OfferList from "@/components/OfferList";
import Search from "@/components/Search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
  const [searchCriteria, setSearchCriteria] = useState({
    startingPoint: "",
    destinationPoint: "",
    date: undefined as Date | undefined,
    passengerSeats: 0,
    freightSpace: 0,
    isFreightOnly: false,
    /*filteredRides: [] as Trip []*/
  });
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("offers");

  const handleSearch = (criteria: typeof searchCriteria) => {
    setSearchCriteria(criteria);
    // Here you would normally perform the search with the new criteria
    console.log("New search criteria:", criteria);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Fahrten finden</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Suchkriterien</h2>
          <Search action={handleSearch} />
        </div>
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            /*defaultValue="offers"*/
            onValueChange={(value) =>
              setActiveTab(value as "offers" | "requests")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="offers">Verfügbare Fahrten</TabsTrigger>
              <TabsTrigger value="requests">
                Fahrt- und Frachtgesuche
              </TabsTrigger>
            </TabsList>
            <TabsContent value="offers">
              <OfferList type="offers" searchCriteria={searchCriteria} />
            </TabsContent>
            <TabsContent value="requests">
              <OfferList type="requests" searchCriteria={searchCriteria} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
