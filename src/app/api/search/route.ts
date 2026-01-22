import { NextRequest, NextResponse } from "next/server";
import { FlightOffer } from "@/types";

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

const MOCK_FLIGHTS: FlightOffer[] = [
  {
    type: "flight-offer",
    id: "1",
    source: "MOCK",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2024-12-30",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H30M",
        segments: [
          {
            departure: { iataCode: "LHR", at: "2024-12-25T10:00:00", terminal: "5" },
            arrival: { iataCode: "CDG", at: "2024-12-25T13:30:00", terminal: "2E" },
            carrierCode: "BA",
            number: "306",
            aircraft: { code: "320" },
            operating: { carrierCode: "BA" },
            duration: "PT1H30M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: { currency: "USD", total: "250.00", base: "200.00", fees: [], grandTotal: "250.00" },
    pricingOptions: { fareType: ["PUBLISHED"], includedCheckedBagsOnly: true },
    validatingAirlineCodes: ["BA"],
    travelerPricings: [],
  },
  {
    type: "flight-offer",
    id: "2",
    source: "MOCK",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2024-12-30",
    numberOfBookableSeats: 5,
    itineraries: [
      {
        duration: "PT4H15M",
        segments: [
          {
            departure: { iataCode: "LHR", at: "2024-12-25T08:00:00", terminal: "2" },
            arrival: { iataCode: "FRA", at: "2024-12-25T10:45:00", terminal: "1" },
            carrierCode: "LH",
            number: "901",
            aircraft: { code: "32N" },
            operating: { carrierCode: "LH" },
            duration: "PT1H45M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
          {
            departure: { iataCode: "FRA", at: "2024-12-25T12:00:00", terminal: "1" },
            arrival: { iataCode: "CDG", at: "2024-12-25T13:15:00", terminal: "1" },
            carrierCode: "LH",
            number: "1034",
            aircraft: { code: "320" },
            operating: { carrierCode: "LH" },
            duration: "PT1H15M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false,
          },
        ],
      },
    ],
    price: { currency: "USD", total: "180.00", base: "150.00", fees: [], grandTotal: "180.00" },
    pricingOptions: { fareType: ["PUBLISHED"], includedCheckedBagsOnly: true },
    validatingAirlineCodes: ["LH"],
    travelerPricings: [],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");
  const adults = searchParams.get("adults") || "1";

  if (!origin || !destination || !date) {
    console.warn("Missing required parameters. Returning Mock Data.");
    return NextResponse.json(MOCK_FLIGHTS);
  }

  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    console.warn("API keys missing. Returning MOCK data.");
    return NextResponse.json(MOCK_FLIGHTS);
  }

  try {
    const authRes = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });

    if (!authRes.ok) {
      console.error(`Auth Failed: ${authRes.status}`);
      return NextResponse.json(MOCK_FLIGHTS);
    }

    const { access_token } = await authRes.json();

    const generateMockFlights = (baseDate: string): FlightOffer[] => {
      const dateObj = new Date(baseDate);
      return Array.from({ length: 5 }).map((_, i) => {
        const depHour = 8 + (i * 3);
        const depTime = new Date(dateObj);
        depTime.setHours(depHour, 0, 0, 0);
        
        const arrTime = new Date(depTime);
        arrTime.setHours(depHour + 2 + (i % 2), 30, 0, 0);

        const price = (150 + (i * 40) + Math.random() * 50).toFixed(2);
        
        return {
          type: "flight-offer",
          id: `${i + 1}`,
          source: "MOCK",
          instantTicketingRequired: false,
          nonHomogeneous: false,
          oneWay: false,
          lastTicketingDate: "2024-12-30",
          numberOfBookableSeats: 9,
          itineraries: [
            {
              duration: `PT${2 + (i % 2)}H30M`,
              segments: [
                {
                  departure: { 
                    iataCode: origin || "SYD", 
                    at: depTime.toISOString().slice(0, 19), 
                    terminal: "1" 
                  },
                  arrival: { 
                    iataCode: destination || "BKK", 
                    at: arrTime.toISOString().slice(0, 19), 
                    terminal: "2" 
                  },
                  carrierCode: ["QF", "BA", "SQ", "EK", "JL"][i % 5],
                  number: `${100 + i}`,
                  aircraft: { code: "320" },
                  operating: { carrierCode: ["QF", "BA", "SQ", "EK", "JL"][i % 5] },
                  duration: `PT${2 + (i % 2)}H30M`,
                  id: "1",
                  numberOfStops: i % 3 === 2 ? 1 : 0,
                  blacklistedInEU: false,
                },
              ],
            },
          ],
          price: { currency: "USD", total: price, base: price, fees: [], grandTotal: price },
          pricingOptions: { fareType: ["PUBLISHED"], includedCheckedBagsOnly: true },
          validatingAirlineCodes: [["QF", "BA", "SQ", "EK", "JL"][i % 5]],
          travelerPricings: [],
        };
      });
    };

    const flightParams = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: adults,
      max: "10",
      currencyCode: "USD" 
    });

    if (returnDate) {
      flightParams.append("returnDate", returnDate);
    }

    const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?${flightParams.toString()}`;
    
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!searchRes.ok) {
      console.error(`Amadeus API Error (${searchRes.status})`);
      return NextResponse.json(generateMockFlights(date)); 
    }

    const searchData = await searchRes.json();
    
    if (!searchData.data || searchData.data.length === 0) {
        console.warn("Amadeus returned no flights. Switching to MOCK data.");
        return NextResponse.json({
          meta: { count: 5 },
          data: generateMockFlights(date) 
        });
    }

    return NextResponse.json(searchData);

  } catch (error) {
    console.error("Server Error. Returning MOCK data.", error);
    return NextResponse.json(MOCK_FLIGHTS);
  }
}
