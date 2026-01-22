import { NextRequest, NextResponse } from "next/server";
import { FlightOffer } from "@/types";
import { MOCK_FLIGHTS } from "@/lib/mockData";

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children");
  const infants = searchParams.get("infants");
  const travelClass = searchParams.get("travelClass");

  // 1. Validate Parameters
  if (!origin || !destination || !date) {
    console.warn("Missing required parameters. Returning Mock Data.");
    return NextResponse.json(MOCK_FLIGHTS); // Ensure MOCK_FLIGHTS structure matches API response
  }

  // 2. Validate Env Vars
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    console.warn("API keys missing. Returning MOCK data.");
    return NextResponse.json(MOCK_FLIGHTS);
  }

  try {
    // 3. Authenticate with Amadeus
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

    // 4. Build Flight Search Params
    const flightParams = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: adults,
      max: "10",
      currencyCode: "USD"
    });

    if (children) flightParams.append("children", children);
    if (infants) flightParams.append("infants", infants);
    if (travelClass) flightParams.append("travelClass", travelClass);
    if (returnDate) flightParams.append("returnDate", returnDate);

    // 5. Search for Flights
    const searchUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?${flightParams.toString()}`;
    
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // --- ERROR 1 FIXED: Handle API Search Failure ---
    if (!searchRes.ok) {
      console.error(`Amadeus API Error (${searchRes.status}). Switching to MOCK.`);
      // You must RETURN here, otherwise code continues to crash on `await searchRes.json()`
      return NextResponse.json(MOCK_FLIGHTS); 
    }

    const searchData = await searchRes.json();
    
    // --- ERROR 2 FIXED: Handle Empty Results ---
    if (!searchData.data || searchData.data.length === 0) {
        console.warn("Amadeus returned no flights. Switching to MOCK data.");
        // You were returning an object with 'meta' but commented out 'data'
        return NextResponse.json(MOCK_FLIGHTS);
    }

    return NextResponse.json(searchData);

  } catch (error) {
    console.error("Server Error. Returning MOCK data.", error);
    return NextResponse.json(MOCK_FLIGHTS);
  }
}