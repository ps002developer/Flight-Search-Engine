import React from "react";
import { FlightOffer } from "@/types";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { Plane, ChevronDown, Clock, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlightCardProps {
  flight: FlightOffer;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const itinerary = flight.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];

  const departureTime = parseISO(firstSegment.departure.at);
  const arrivalTime = parseISO(lastSegment.arrival.at);

  const formatDuration = (pt: string) => {
    const hours = pt.match(/(\d+)H/)?.[1];
    const minutes = pt.match(/(\d+)M/)?.[1];
    if (!hours && !minutes) return "0m";
    return `${hours ? hours + "h " : ""}${minutes ? minutes + "m" : ""}`.trim();
  };

  const durationStr = formatDuration(itinerary.duration);
  const stops = itinerary.segments.length - 1;

  const carrierCode = firstSegment.carrierCode;
  const flightNumber = `${carrierCode} ${firstSegment.number}`;

  return (
    <div className="group mb-4 w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      
      {/* --- Main Card Header (Clickable) --- */}
      <div
        className="cursor-pointer transition-colors hover:bg-slate-50/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-center">
          
          <div className="md:col-span-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">
              {carrierCode}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{flightNumber}</p>
              <p className="text-xs text-slate-500 font-medium">Economy • Boeing 737</p>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-row items-center justify-between gap-2 md:gap-6">
            <div className="text-left min-w-[60px]">
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {format(departureTime, "HH:mm")}
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {firstSegment.departure.iataCode}
              </p>
            </div>

            <div className="flex flex-col items-center flex-1 px-2">
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {durationStr}
              </p>
              <div className="w-full h-px bg-slate-300 relative flex items-center justify-center">
                <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
                <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
              <p className={cn(
                "text-xs font-medium mt-3 px-2 py-0.5 rounded-full",
                stops === 0 
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-amber-600 bg-amber-50"
              )}>
                {stops === 0 ? "Direct" : `${stops} Stop${stops > 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="text-right min-w-[60px]">
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {format(arrivalTime, "HH:mm")}
              </p>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {lastSegment.arrival.iataCode}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 flex md:flex-col flex-row items-center md:items-end justify-between md:justify-center gap-1 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500 font-medium">Total Price</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {flight.price.currency === "EUR" ? "€" : "$"}{flight.price.grandTotal}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-0 md:mt-2">
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors shadow-sm hover:shadow active:scale-95"
              >
                Select
              </button>
              <div className="md:hidden text-slate-400">
                <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
              </div>
            </div>
          </div>

        </div>

        <div className="hidden md:flex justify-center pb-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                 {isOpen ? "Hide Details" : "Flight Details"}
                 <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
            </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-5 md:p-8 animate-in slide-in-from-top-1 fade-in duration-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Itinerary Breakdown</h4>

          <div className="relative">
             {itinerary.segments.map((segment, idx) => {
                const dep = parseISO(segment.departure.at);
                const arr = parseISO(segment.arrival.at);
                const isLast = idx === itinerary.segments.length - 1;
                
                // Calculate next flight wait time (layover) if not last
                let layoverTime = "";
                if (!isLast) {
                    const nextDep = parseISO(itinerary.segments[idx + 1].departure.at);
                    const diffMins = differenceInMinutes(nextDep, arr);
                    const hrs = Math.floor(diffMins / 60);
                    const mins = diffMins % 60;
                    layoverTime = `${hrs}h ${mins}m`;
                }

                return (
                  <div key={segment.id} className="relative flex gap-4 md:gap-8 pb-8 last:pb-0">
                    
                    {/* Time Column */}
                    <div className="flex flex-col text-right w-16 md:w-20 pt-1">
                       <span className="font-bold text-slate-900 text-sm md:text-base">{format(dep, "HH:mm")}</span>
                       <span className="text-xs text-slate-400 font-medium tabular-nums mt-auto pb-1">{formatDuration(segment.duration)}</span>
                       <span className="font-bold text-slate-400 text-sm md:text-base">{format(arr, "HH:mm")}</span>
                    </div>

                    {/* Timeline Line Column */}
                    <div className="flex flex-col items-center relative">
                        <div className="w-3.5 h-3.5 rounded-full border-[3px] border-white bg-slate-900 shadow-sm z-10 mt-1.5"></div>
                        
                        <div className="w-0.5 flex-grow bg-slate-300 my-1 relative"></div>

                        <div className={cn(
                            "w-3.5 h-3.5 rounded-full border-[3px] border-white z-10 mb-1.5",
                            !isLast ? "bg-white border-slate-400 border-[2px]" : "bg-slate-900"
                        )}></div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 pt-1 pb-4">
                        {/* Departure Info */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="font-semibold text-slate-900">{segment.departure.iataCode}</span>
                            <span className="text-sm text-slate-500">{segment.departure.terminal ? `Terminal ${segment.departure.terminal}` : ""}</span>
                        </div>

                        {/* Flight Card */}
                        <div className="bg-white p-3 md:p-4 rounded-lg border border-slate-200 shadow-sm mb-6 max-w-lg">
                           <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                    <span className="text-xs font-bold text-slate-600">{segment.carrierCode}</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-slate-900">{segment.carrierCode} {segment.number}</p>
                                    <p className="text-xs text-slate-500">Boeing {segment.aircraft.code} • Economy</p>
                                </div>
                           </div>
                        </div>

                        {/* Arrival Info */}
                        <div className="flex items-baseline gap-2">
                             <span className="font-semibold text-slate-900">{segment.arrival.iataCode}</span>
                             <span className="text-sm text-slate-500">{segment.arrival.terminal ? `Terminal ${segment.arrival.terminal}` : ""}</span>
                        </div>

                        {/* Layover Alert */}
                        {!isLast && (
                           <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-100 text-amber-800 text-xs font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Layover in {segment.arrival.iataCode}: <span className="font-bold">{layoverTime}</span>
                           </div>
                        )}
                    </div>

                  </div>
                )
             })}
          </div>
        </div>
      )}
    </div>
  );
}