"use client";

import React from "react";
import { useFlight } from "@/context/FlightContext";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function FilterSidebar() {
  const { filters, setFilters, allAirlines, maxPriceResult, flights } = useFlight();

  const toggleStopFilter = (stop: string) => {
    setFilters((prev) => ({
      ...prev,
      stops: prev.stops.includes(stop)
        ? prev.stops.filter((s) => s !== stop)
        : [...prev.stops, stop],
    }));
  };

  const toggleAirlineFilter = (airline: string) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter((a) => a !== airline)
        : [...prev.airlines, airline],
    }));
  };

  if (flights.length === 0) return null;

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h3 className="font-semibold text-lg mb-4 text-slate-900">Filters</h3>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Max Price: <span className="text-blue-600">${filters.maxPrice}</span>
          </Label>
          <Slider
            value={[filters.maxPrice]}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, maxPrice: value[0] }))}
            max={maxPriceResult}
            min={0}
            step={10}
            className="mt-4"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-3 block">Stops</Label>
          <div className="space-y-3">
            {["0", "1", "2+"].map((stop) => (
              <div key={stop} className="flex items-center space-x-3">
                <Checkbox
                  id={`stop-${stop}`}
                  checked={filters.stops.includes(stop)}
                  onCheckedChange={() => toggleStopFilter(stop)}
                />
                <label
                  htmlFor={`stop-${stop}`}
                  className="text-sm text-slate-600 leading-none cursor-pointer"
                >
                  {stop === "0" ? "Direct" : stop === "1" ? "1 Stop" : "2+ Stops"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {allAirlines.length > 0 && (
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Airlines</Label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {allAirlines.map((airline) => (
                <div key={airline} className="flex items-center space-x-3">
                  <Checkbox
                    id={`airline-${airline}`}
                    checked={filters.airlines.includes(airline)}
                    onCheckedChange={() => toggleAirlineFilter(airline)}
                  />
                  <label
                    htmlFor={`airline-${airline}`}
                    className="text-sm text-slate-600 leading-none cursor-pointer"
                  >
                    {airline}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
