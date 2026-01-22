"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FlightOffer, FlightDestination } from "@/types";

interface Filters {
  maxPrice: number;
  stops: string[];
  airlines: string[];
}

interface FlightContextType {
  flights: FlightOffer[];

  filteredFlights: FlightOffer[];
  isLoading: boolean;
  searchFlights: (params: { 
    origin: string; 
    destination: string; 
    date: string; 
    returnDate?: string; 
    adults?: string;
    children?: string;
    infants?: string;
    travelClass?: string;
  }) => Promise<void>;

  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  allAirlines: string[];
  maxPriceResult: number;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export function FlightProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState<FlightOffer[]>([]);

  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    maxPrice: 10000,
    stops: [],
    airlines: [],
  });


  const [allAirlines, setAllAirlines] = useState<string[]>([]);
  const [maxPriceResult, setMaxPriceResult] = useState(10000);


  const searchFlights = async (params: { 
    origin: string; 
    destination: string; 
    date: string; 
    returnDate?: string; 
    adults?: string;
    children?: string;
    infants?: string;
    travelClass?: string;
  }) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("origin", params.origin);
      searchParams.set("destination", params.destination);
      searchParams.set("date", params.date);
      if (params.returnDate) searchParams.set("returnDate", params.returnDate);
      if (params.adults) searchParams.set("adults", params.adults);
      if (params.children) searchParams.set("children", params.children);
      if (params.infants) searchParams.set("infants", params.infants);
      if (params.travelClass) searchParams.set("travelClass", params.travelClass);
      
      const res = await fetch(`/api/search?${searchParams.toString()}`);
      const responseBody = await res.json();
      const flightsData = Array.isArray(responseBody) ? responseBody : (responseBody.data || []);
      setFlights(flightsData);
    } catch (error) {
      console.error("Failed to fetch flights", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (flights.length > 0) {
      const airlines = Array.from(new Set(flights.flatMap((f) => f.validatingAirlineCodes)));
      setAllAirlines(airlines);

      const maxP = Math.max(...flights.map((f) => parseFloat(f.price.grandTotal)));
      setMaxPriceResult(Math.ceil(maxP));
      setFilters(prev => ({ ...prev, maxPrice: Math.ceil(maxP) }));
    }
  }, [flights]);

  useEffect(() => {
    let result = flights;
    result = result.filter((f) => parseFloat(f.price.grandTotal) <= filters.maxPrice);
    if (filters.stops.length > 0) {
      result = result.filter((f) => {
        const segmentCount = f.itineraries[0].segments.length;
        const stops = segmentCount - 1;
        if (filters.stops.includes("0") && stops === 0) return true;
        if (filters.stops.includes("1") && stops === 1) return true;
        if (filters.stops.includes("2+") && stops >= 2) return true;
        return false;
      });
    }

    if (filters.airlines.length > 0) {
      result = result.filter((f) => 
        f.validatingAirlineCodes.some(code => filters.airlines.includes(code))
      );
    }

    setFilteredFlights(result);
  }, [flights, filters]);

  return (
    <FlightContext.Provider
      value={{
        flights,

        filteredFlights,
        isLoading,
        searchFlights,

        filters,
        setFilters,
        allAirlines,
        maxPriceResult
      }}
    >
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error("useFlight must be used within a FlightProvider");
  }
  return context;
}
