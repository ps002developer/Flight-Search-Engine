import React from "react";
import { FlightOffer } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ArrowRight, Clock } from "lucide-react";

interface FlightCardProps {
  flight: FlightOffer;
}

export default function FlightCard({ flight }: FlightCardProps) {

  const itinerary = flight.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];

  const departureTime = parseISO(firstSegment.departure.at);
  const arrivalTime = parseISO(lastSegment.arrival.at);


  const formatDuration = (pt: string) => {
    const hours = pt.match(/(\d+)H/)?.[1];
    const minutes = pt.match(/(\d+)M/)?.[1];
    let result = "";
    if (hours) result += `${hours}h `;
    if (minutes) result += `${minutes}m`;
    return result.trim() || pt.replace("PT", "").toLowerCase();
  };

  const durationStr = formatDuration(itinerary.duration);
  const stops = itinerary.segments.length - 1;

  return (
    <Card className="mb-4 hover:shadow-lg transition-all cursor-pointer border-slate-200 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-700">
                        {flight.validatingAirlineCodes[0]}
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-slate-900 block leading-tight">{flight.validatingAirlineCodes[0]} Airlines</span>
                        <span className="text-xs text-slate-500">Flight {firstSegment.number}</span>
                    </div>
                 </div>
                 {stops === 0 && <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Direct</span>}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="text-center sm:text-left min-w-[60px]">
                   <div className="text-2xl font-bold text-slate-900">{format(departureTime, "HH:mm")}</div>
                   <div className="text-sm text-slate-500 font-medium">{firstSegment.departure.iataCode}</div>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                   <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {durationStr}
                   </div>
                   <div className="w-full h-px bg-slate-200 relative flex items-center justify-center">
                       <div className="absolute right-0 -mt-[3px]">
                          <ArrowRight className="h-3 w-3 text-slate-300" />
                       </div>
                   </div>
                   <div className="text-xs text-slate-400 mt-1">
                     {stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`}
                   </div>
                </div>

                <div className="text-center sm:text-right min-w-[60px]">
                   <div className="text-2xl font-bold text-slate-900">{format(arrivalTime, "HH:mm")}</div>
                   <div className="text-sm text-slate-500 font-medium">{lastSegment.arrival.iataCode}</div>
                </div>
            </div>
          </div>


          <div className="border-t sm:border-t-0 sm:border-l border-slate-100 bg-slate-50/50 p-5 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 min-w-[150px]">
             <div className="text-left sm:text-right">
                <div className="text-xs text-slate-500 mb-0.5">Price per adult</div>
                <div className="text-2xl font-bold text-blue-700">
                  {flight.price.currency === "EUR" ? "€" : "$"}
                  {flight.price.grandTotal}
                </div>
             </div>
             
             <button className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm w-auto sm:w-full">
               Select
             </button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
