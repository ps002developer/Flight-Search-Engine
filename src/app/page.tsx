"use client";

import React from "react";
import { FlightProvider, useFlight } from "@/context/FlightContext";
import SearchForm from "@/components/SearchForm";
import FilterSidebar from "@/components/FilterSidebar";
import FlightCard from "@/components/FlightCard";
import PriceGraph from "@/components/PriceGraph";
import { MapPin, Filter, X } from "lucide-react";

const POPULAR_DESTINATIONS = [
  {
    city: "Tokyo",
    country: "Japan",
    price: "$850",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
    code: "TYO"
  },
  {
    city: "Paris",
    country: "France",
    price: "$620",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    code: "PAR"
  },
  {
    city: "New York",
    country: "USA",
    price: "$450",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop",
    code: "NYC"
  },
  {
    city: "Dubai",
    country: "UAE",
    price: "$900",
    image: "https://plus.unsplash.com/premium_photo-1697729914552-368899dc4757?q=80&w=1112&auto=format&fit=crop",
    code: "DXB"
  }
];

function FlightDashboard() {
  const { filteredFlights, isLoading, flights } = useFlight();
  const [visibleCount, setVisibleCount] = React.useState(5);
  const [showFilters, setShowFilters] = React.useState(true);

  const visibleFlights = React.useMemo(() => {
    return filteredFlights.slice(0, visibleCount);
  }, [filteredFlights, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  React.useEffect(() => {
    setVisibleCount(5);
  }, [flights]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Hero Section */}
      <div className="relative bg-slate-900 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50"></div>
        </div>

        <header className="relative border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                SkySearch
              </h1>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 text-center md:text-left">
           <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
             Discover your next adventure
           </h2>
           <p className="text-lg text-slate-200 max-w-2xl">
             Compare flight prices from hundreds of airlines and find the best deals for your journey.
           </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-20">
          
            <SearchForm />
            {(flights.length > 0 || isLoading) && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            )}

            <div className={`flex flex-col lg:grid lg:grid-cols-4 gap-8 transition-all`}>
              
              {/* Sidebar - Only show when we have results or loading */}
              {(flights.length > 0 || isLoading) && showFilters && (
                <aside className="w-full lg:w-auto lg:col-span-1">
                  <FilterSidebar />
                </aside>
              )}

              {/* Main Content Area */}
              <section className={`w-full ${(flights.length > 0 || isLoading) && showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
                
                {/* Results View */}
                {(flights.length > 0 || isLoading) ? (
                  <>
                    <PriceGraph />
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse" />
                        ))}
                      </div>
                    ) : filteredFlights.length > 0 ? (
                      <div className="space-y-4">
                        {visibleFlights.map((flight) => (
                          <FlightCard key={flight.id} flight={flight} />
                        ))}
                        
                        {visibleCount < filteredFlights.length && (
                          <div className="flex justify-center pt-6">
                            <button 
                              onClick={handleLoadMore}
                              className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-colors shadow-sm"
                            >
                              Load More Results
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 text-lg">No flights match your filters.</p>
                        <p className="text-sm text-slate-400 mt-2">Try adjusting your search criteria.</p>
                      </div>
                    )}
                  </>
                ) : null}
              </section>
            </div>

            {/* Always visible Footer-like Sections */}
             <div className="mt-16 border-t border-slate-200 pt-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Popular Destinations</h3>
                    <p className="text-slate-500 mt-1">Trending places travelers are booking right now</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {POPULAR_DESTINATIONS.map((dest) => (
                     <div key={dest.code} className="group cursor-pointer bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="h-48 overflow-hidden relative">
                          <img src={dest.image} alt={dest.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                          <div className="absolute bottom-3 left-3 text-white">
                             <span className="text-xs font-bold uppercase tracking-wider opacity-90">{dest.country}</span>
                             <h4 className="text-xl font-bold">{dest.city}</h4>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                           <div className="flex items-center text-slate-500 text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              {dest.code}
                           </div>
                           <div className="text-right">
                              <span className="text-xs text-slate-400 block">from</span>
                              <span className="font-bold text-slate-900 text-lg">{dest.price}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h3 className="text-3xl font-bold mb-4 relative z-10">Ready to explore the world?</h3>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">Join millions of travelers who use SkySearch to find the perfect flight for their next journey.</p>
                </div>
             </div>
          
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <FlightProvider>
        <FlightDashboard />
    </FlightProvider>
  );
}

