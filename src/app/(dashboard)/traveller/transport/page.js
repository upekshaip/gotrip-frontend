/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import UseFetch from "@/hooks/UseFetch";
import { MapPin, Star, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import DiscoveryHeader from "@/components/reusable/DiscoveryHeader";

const TransportDiscovery = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const sentinelRef = useRef(null);

  const fetchTransports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UseFetch("GET", "/transport-service");
      
      if (data) {
        // Handle flat array response from our backend
        const vehicleList = Array.isArray(data) ? data : (data.content || []);
        setTransports(vehicleList);
        setHasMore(false); // Set to false since we loaded all active vehicles
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransports();
  }, [fetchTransports]);

  const formatUnit = (unit) => {
    const mapping = {
      PER_DAY: "/ day",
      PER_HOUR: "/ hr",
      PER_PERSON: "/ person",
    };
    return mapping[unit] || "";
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      <DiscoveryHeader
        category="Premium Rides"
        title="Travel Worldwide"
        subtitle="In comfort and style."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search vehicles or cities..."
      />

      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {transports
            .filter(
              (t) =>
                t.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.city.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((transport) => (
              <div
                key={transport.transportId}
                className="group flex flex-col cursor-pointer"
                onClick={() =>
                  router.push(`/traveller/transport/${transport.transportId}`)
                }
              >
                {/* Image Card */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-base-200">
                  <img
                    src={transport.imageUrl || "https://placehold.co/600x800?text=Vehicle"}
                    alt={transport.vehicleModel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Info Overlay */}
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl flex justify-between items-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                          Start From
                        </p>
                        <div className="flex flex-wrap items-end gap-1">
                          <p className="text-sm font-black text-slate-900">
                            LKR {transport.price.toLocaleString()}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {formatUnit(transport.priceUnit)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {transport.isFeatured && (
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-tight text-slate-900 border border-white">
                        FEATURED
                      </span>
                    </div>
                  )}
                  
                  {/* Vehicle Type Badge */}
                  <div className="absolute top-5 right-5">
                      <span className="bg-primary/90 text-white backdrop-blur-sm text-[10px] font-black px-3 py-1 rounded-full shadow-sm tracking-tight">
                        {transport.vehicleType}
                      </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="px-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors truncate">
                      {transport.vehicleMake} {transport.vehicleModel}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black">New</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-base-content/40 text-[13px] font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{transport.city} • {transport.capacity} Seats</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Sentinel */}
        <div ref={sentinelRef} className="py-12 flex flex-col items-center justify-center min-h-[100px]">
          {loading ? (
            <span className="loading loading-infinity loading-lg text-primary/40"></span>
          ) : (
            !hasMore && transports.length > 0 && (
              <div className="flex flex-col items-center opacity-20">
                <div className="h-px w-20 bg-base-content mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Fin.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportDiscovery;