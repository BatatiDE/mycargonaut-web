"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchCriteria, SearchProps } from "@/types/searchProps";
import { Trip } from "@/types/trip";
import { tripApi } from "@/services/tripApi";

export default function Search({ action }: SearchProps) {
  const [startingPoint, setStartingPoint] = useState("");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [date, setDate] = useState<Date>();
  const [passengerSeats, setPassengerSeats] = useState(0);
  const [freightSpace, setFreightSpace] = useState(0);
  const [isFreightOnly, setIsFreightOnly] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);

  const fetchAllTrips = async () => {
    try {
      const data = await tripApi.getTrips();
      setTrips(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredRides = trips.filter(
      (trip) =>
        (!startingPoint ||
          trip.startingPoint
            .toLowerCase()
            .includes(startingPoint.toLowerCase())) &&
        (!destinationPoint ||
          trip.destinationPoint
            .toLowerCase()
            .includes(destinationPoint.toLowerCase())) &&
        (!date || new Date(trip.date).toDateString() === date.toDateString()) &&
        trip.availableSeats >= passengerSeats &&
        trip.freightSpace >= freightSpace &&
        (!isFreightOnly || trip.isFreightRide)
    );
    const searchCriteria: SearchCriteria = {
      startingPoint,
      destinationPoint,
      date,
      passengerSeats,
      freightSpace,
      isFreightOnly,
      filteredRides,
    };
    action(searchCriteria);
  };

  const handleReset = async () => {
    setStartingPoint("");
    setDestinationPoint("");
    setDate(undefined);
    setPassengerSeats(0);
    setFreightSpace(0);
    setIsFreightOnly(false);

    const allTrips = await fetchAllTrips();
    const resetCriteria: SearchCriteria = {
      startingPoint: "",
      destinationPoint: "",
      date: undefined,
      passengerSeats: 0,
      freightSpace: 0,
      isFreightOnly: false,
      filteredRides: allTrips,
    };
    action(resetCriteria);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="from">Von</Label>
        <Input
          id="from"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="to">Nach</Label>
        <Input
          id="to"
          value={destinationPoint}
          onChange={(e) => setDestinationPoint(e.target.value)}
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
              {date ? (
                format(date, "PPP", { locale: de })
              ) : (
                <span>Datum auswählen</span>
              )}
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
      <div className="space-y-2">
        <Label htmlFor="passengerSeats">Passagierplätze</Label>
        <Input
          id="passengerSeats"
          type="number"
          min="0"
          value={passengerSeats}
          onChange={(e) => setPassengerSeats(Number(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="freightSpace">Frachtplatz (in m³)</Label>
        <Input
          id="freightSpace"
          type="number"
          min="0"
          step="0.1"
          value={freightSpace}
          onChange={(e) => setFreightSpace(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFreightOnly"
          checked={isFreightOnly}
          onCheckedChange={(checked) => setIsFreightOnly(checked as boolean)}
        />
        <Label htmlFor="isFreightOnly">Nur Frachttransport</Label>
      </div>
      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          Suchen
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          Zurücksetzen
        </Button>
      </div>
    </form>
  );
}
