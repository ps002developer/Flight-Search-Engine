"use client";

import React, { useState } from "react";
import { useFlight } from "@/context/FlightContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, User, ArrowRightLeft, Minus, Plus, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CityPicker } from "@/components/CityPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchForm() {
  const { searchFlights, isLoading } = useFlight();
  
  const [origin, setOrigin] = useState("SYD");
  const [destination, setDestination] = useState("BKK");
  const [date, setDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [rotation, setRotation] = useState(0);

  React.useEffect(() => {
    setDate(new Date());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination && date) {
      searchFlights({
        origin,
        destination,
        date: format(date, "yyyy-MM-dd"),
        returnDate: returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
        adults: String(adults),
        children: children > 0 ? String(children) : undefined,
        infants: infants > 0 ? String(infants) : undefined,
        travelClass: travelClass !== "ECONOMY" ? travelClass : undefined,
      });
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setRotation(prev => prev + 180);
  };

  return (
    <Card className="mb-10 shadow-xl border-0 overflow-visible bg-white/50 backdrop-blur-sm w-full max-w-6xl mx-auto">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* 1. Trip Type Selector */}
            <div className="flex w-full lg:w-auto gap-1 p-1 bg-slate-100/80 rounded-lg">
               <button 
                 type="button" 
                 onClick={() => setTripType("oneway")} 
                 className={cn(
                   "flex-1 lg:flex-none flex items-center justify-center gap-2 text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-200", 
                   tripType === "oneway" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 {tripType === "oneway" && <Check className="w-3.5 h-3.5" />}
                 One way
               </button>
               <button 
                 type="button" 
                 onClick={() => setTripType("roundtrip")} 
                 className={cn(
                   "flex-1 lg:flex-none flex items-center justify-center gap-2 text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-200", 
                   tripType === "roundtrip" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 {tripType === "roundtrip" && <Check className="w-3.5 h-3.5" />}
                 Round trip
               </button>
            </div>

            {/* 2. Travelers & Class (Grid on Mobile for better layout) */}
            <div className="grid grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
               
               {/* Travelers Button */}
               <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full lg:w-auto justify-start lg:justify-center h-10 lg:h-9 px-3 text-sm font-medium text-slate-600 bg-white border-slate-200 lg:border-transparent lg:bg-transparent hover:bg-slate-50 lg:hover:bg-slate-100 hover:text-slate-900 shadow-sm lg:shadow-none">
                      <User className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {adults + children + infants}
                        <span className="ml-1 text-slate-400">Traveler{adults + children + infants !== 1 && 's'}</span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                      <div className="space-y-4">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="font-semibold text-sm">Adults</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={adults <= 1}>
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-4 text-center font-medium">{adults}</span>
                              <button type="button" onClick={() => setAdults(Math.min(9, adults + 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={adults >= 9}>
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                        {/* Children */}
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="font-semibold text-sm">Children</div>
                              <div className="text-xs text-slate-500">Age 2-11</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={children <= 0}>
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-4 text-center font-medium">{children}</span>
                              <button type="button" onClick={() => setChildren(Math.min(9, children + 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={children >= 9}>
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                        {/* Infants */}
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="font-semibold text-sm">Infants</div>
                              <div className="text-xs text-slate-500">Under 2</div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button type="button" onClick={() => setInfants(Math.max(0, infants - 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={infants <= 0}>
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-4 text-center font-medium">{infants}</span>
                              <button type="button" onClick={() => setInfants(Math.min(adults, infants + 1))} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-50" disabled={infants >= adults}>
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                        </div>
                      </div>
                  </PopoverContent>
               </Popover>

               {/* Class Selector */}
               <Select value={travelClass} onValueChange={setTravelClass}>
                 <SelectTrigger className="w-full lg:w-auto min-w-[100px] h-10 lg:h-9 px-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm lg:shadow-none lg:border-none lg:bg-transparent lg:hover:bg-slate-100 focus:ring-0">
                   <SelectValue placeholder="Class" />
                 </SelectTrigger>
                 <SelectContent align="end" position="popper" sideOffset={0}>
                   <SelectItem value="ECONOMY">Economy</SelectItem>
                   <SelectItem value="PREMIUM_ECONOMY">Prem. Eco</SelectItem>
                   <SelectItem value="BUSINESS">Business</SelectItem>
                   <SelectItem value="FIRST">First Class</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>
          
          {/* --- MAIN SEARCH BAR --- */}
          <div className="relative flex flex-col lg:flex-row bg-white rounded-2xl lg:rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            
            <div className="flex-1 relative group z-20 border-b lg:border-b-0 lg:border-r border-slate-100">
               <CityPicker 
                 label="From" 
                 value={origin} 
                 onChange={setOrigin} 
                 className="border-none shadow-none hover:bg-slate-50/80 rounded-t-2xl lg:rounded-l-[2rem] lg:rounded-tr-none h-20 lg:h-full py-3 px-6"
                 showIcon={true}
               />
            </div>

            {/* Swap Button */}
            <div className="absolute lg:static left-1/2 top-[5rem] lg:top-auto -translate-x-1/2 -translate-y-1/2 lg:translate-x-0.5 lg:translate-y-0 z-30 lg:flex lg:items-center lg:px-0 lg:-ml-4 w-8 h-8 lg:w-auto lg:h-auto">
               <button 
                 type="button"
                 onClick={handleSwap}
                 className="p-1.5 bg-white rounded-full border border-slate-100 hover:bg-slate-50 transition-all duration-300 ease-out active:scale-95"
                 style={{ transform: `rotate(${rotation}deg)` }}
               >
                 <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors lg:rotate-0 rotate-90" />
               </button>
            </div>

            <div className="flex-1 relative group z-20 border-b lg:border-b-0 lg:border-r border-slate-100">
               <CityPicker 
                 label="To" 
                 value={destination} 
                 onChange={setDestination} 
                 className="border-none shadow-none hover:bg-slate-50/80 lg:rounded-none h-20 lg:h-full py-3 px-6 lg:pl-8"
                 showIcon={true}
               />
            </div>

            <div className="flex-[1.5] grid grid-cols-2 divide-x divide-slate-100 h-20 lg:h-auto w-full">
               
               <div className="relative group h-full min-w-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full h-full justify-start text-left font-normal px-4 sm:px-6 py-3 hover:bg-slate-50/80 rounded-none lg:rounded-none",
                          !date && "text-muted-foreground"
                        )}
                      >
                         <div className="flex items-center gap-3 w-full">
                            <div className="hidden sm:block p-2 bg-slate-100 text-slate-500 rounded-full shrink-0">
                               <CalendarIcon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col text-left min-w-0 flex-1">
                               <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Departure</span>
                               <span className={cn("text-sm sm:text-base font-semibold leading-tight truncate block w-full", date ? "text-slate-900" : "text-slate-500")}>
                                  {date ? format(date, "MMM d, yyyy") : "Add date"}
                               </span>
                            </div>
                         </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                 </Popover>
               </div>

               <div className="relative group h-full min-w-0">
                  {tripType === "oneway" ? (
                    <button 
                      type="button"
                      onClick={() => setTripType("roundtrip")}
                      className="w-full h-full flex items-center gap-3 px-4 sm:px-6 py-3 hover:bg-slate-50/80 transition-colors text-left"
                    >
                       <div className="hidden sm:block p-2 bg-slate-50 text-slate-300 rounded-full shrink-0">
                          <Plus className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Return</span>
                          <span className="text-sm sm:text-base font-medium text-slate-400 truncate block w-full">Add date</span>
                       </div>
                    </button>
                 ) : (
                   <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full h-full justify-start text-left font-normal px-4 sm:px-6 py-3 hover:bg-slate-50/80 rounded-none",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                           <div className="flex items-center gap-3 w-full">
                              <div className="hidden sm:block p-2 bg-slate-100 text-slate-500 rounded-full shrink-0">
                                 <CalendarIcon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col text-left min-w-0 flex-1">
                                 <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Return</span>
                                 <span className={cn("text-sm sm:text-base font-semibold leading-tight truncate block w-full", returnDate ? "text-slate-900" : "text-slate-500")}>
                                    {returnDate ? format(returnDate, "MMM d, yyyy") : "Add date"}
                                 </span>
                              </div>
                           </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={(d) => {
                             setReturnDate(d);
                             if(d) setTripType("roundtrip");
                          }}
                          initialFocus
                          disabled={(day) => day < (date || new Date())}
                        />
                      </PopoverContent>
                   </Popover>
                 )}
               </div>

            </div>

            {/* Search Button */}
            <div className="p-2 lg:pl-0 w-full lg:w-auto">
               <Button 
                type="submit" 
                disabled={isLoading} 
                className={cn(
                  "flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]",
                  "w-full h-12 rounded-xl text-base font-semibold text-white",
                  "lg:h-14 lg:w-14 lg:rounded-full lg:p-0 lg:hover:scale-105" 
                )}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="lg:hidden mr-2">Search Flights</span>
                    <Search className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}