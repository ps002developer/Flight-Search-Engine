"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useFlight } from "@/context/FlightContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PriceGraph() {
  const { filteredFlights } = useFlight();

  const data = useMemo(() => {
    if (!filteredFlights || filteredFlights.length === 0) return [];

    return filteredFlights
      .map((flight) => {

        if (!flight.itineraries?.[0]?.segments?.[0]) return null;
        
        const depTime = parseISO(flight.itineraries[0].segments[0].departure.at);
        return {
          id: flight.id,
          time: depTime.getTime(),
          timeLabel: format(depTime, "HH:mm"),
          price: parseFloat(flight.price.grandTotal || "0"),
          airline: flight.validatingAirlineCodes?.[0] || "UNK",
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => a.time - b.time);
  }, [filteredFlights]);

  if (data.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Price Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="timeLabel" 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                width={40} 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(value: any) => [`$${value}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0284c7", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}