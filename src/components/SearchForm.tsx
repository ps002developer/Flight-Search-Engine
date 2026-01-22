"use client";

import React, { useState } from "react";
import { useFlight } from "@/context/FlightContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, User } from "lucide-react";
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
  const [adults, setAdults] = useState("1");
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");

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
        adults: adults,
      });
    }
  };

  return (
    <Card className="mb-10 shadow-xl border-0 overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex justify-between items-center bg-slate-100/50 p-1 rounded-lg w-fit mb-2">
             <div className="flex gap-2">
                 <button type="button" onClick={() => setTripType("oneway")} className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", tripType === "oneway" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}>One way</button>
                 <button type="button" onClick={() => setTripType("roundtrip")} className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", tripType === "roundtrip" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}>Round trip</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-slate-200 rounded-xl border p-0.5 overflow-hidden">
               <div className="bg-white p-3 rounded-t-lg md:rounded-l-lg md:rounded-tr-none hover:bg-slate-50 transition-colors">
                  <CityPicker 
                    label="From" 
                    value={origin} 
                    onChange={setOrigin} 
                  />
               </div>
               <div className="bg-white p-3 rounded-b-lg md:rounded-r-lg md:rounded-bl-none hover:bg-slate-50 transition-colors">
                  <CityPicker 
                    label="To" 
                    value={destination} 
                    onChange={setDestination} 
                  />
               </div>
            </div>

            <div className={`md:col-span-5 grid grid-cols-1 ${tripType === "roundtrip" ? "md:grid-cols-2" : "md:grid-cols-1"} gap-0.5 bg-slate-200 rounded-xl border p-0.5 overflow-hidden`}>
               <div className={`bg-white p-3 rounded-t-lg md:rounded-l-lg ${tripType === "roundtrip" ? "md:rounded-tr-none" : "md:rounded-r-lg"} hover:bg-slate-50 transition-colors flex flex-col justify-center`}>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Departure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full justify-start text-left font-medium h-9 px-0 hover:bg-transparent text-base text-slate-900",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date ? format(date, "EEE, MMM d") : <span>Pick date</span>}
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
               

               
               {tripType === "roundtrip" && (
                 <div className="bg-white p-3 rounded-b-lg md:rounded-r-lg md:rounded-bl-none hover:bg-slate-50 transition-colors flex flex-col justify-center relative">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Return</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className={cn(
                            "w-full justify-start text-left font-medium h-9 px-0 hover:bg-transparent text-base text-slate-900",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {returnDate ? format(returnDate, "EEE, MMM d") : <span>Pick date</span>}
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
                 </div>
               )}
            </div>

            <div className="md:col-span-2 bg-white rounded-xl border p-3 hover:bg-slate-50 transition-colors flex flex-col justify-center">
                 <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Travelers</Label>
                 <Select 
                    value={String(adults)} 
                    onValueChange={(val) => setAdults(val)}
                  >
                    <SelectTrigger className="w-full border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 p-0 h-9 font-medium text-base text-slate-900">
                      <div className="flex items-center">
                         <User className="h-4 w-4 text-slate-400 mr-2" />
                         <SelectValue placeholder="Passengers" />
                      </div>
                    </SelectTrigger>
                    
                    <SelectContent position="popper">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? "Adult" : "Adults"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>

          </div>

          <div className="flex justify-center pt-2">
             <Button 
               type="submit" 
               disabled={isLoading} 
               className="w-full md:w-auto md:min-w-[200px] rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
             >
               {isLoading ? (
                 <div className="flex items-center gap-2">
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Searching...
                 </div>
               ) : (
                 <>
                   <Search className="h-5 w-5 mr-2" />
                   Search Flights
                 </>
               )}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
