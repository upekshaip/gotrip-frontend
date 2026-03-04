/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import UseFetch from "@/hooks/UseFetch";
import { MapPin, Star, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import DiscoveryHeader from "@/components/reusable/DiscoveryHeader";

const HotelDiscovery = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  // 1. Create a ref for the bottom "Sentinel" element
  const sentinelRef = useRef(null);

  const fetchHotels = useCallback(async (currPage, isFirstLoad = false) => {
    setLoading(true);
    try {
      const data = await UseFetch(
        "GET",
        `/hotel-service?page=${currPage}&limit=10`,
      );
      if (data && data.content) {
        setHotels((prev) =>
          isFirstLoad ? data.content : [...prev, ...data.content],
        );
        setHasMore(!data.last);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchHotels(1, true);
  }, [fetchHotels]);

  // 2. Observer Logic: Watch the Sentinel, not the last element
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only load if the sentinel is visible AND we aren't already loading
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchHotels(nextPage, false);
        }
      },
      {
        root: null, // viewport
        rootMargin: "100px", // Pre-load 100px before reaching the bottom
        threshold: 0.1, // Trigger when even a tiny bit is visible
      },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, loading, page, fetchHotels]);

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
        category="Premium Stays"
        title="Experience Sri Lanka"
        subtitle="Like never before."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search hotels or cities..."
      />

      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hotels
            .filter(
              (h) =>
                h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.city.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((hotel) => (
              <div
                key={hotel.hotelId}
                className="group flex flex-col cursor-pointer"
                onClick={() =>
                  router.push(`/traveller/hotels/${hotel.hotelId}`)
                }
              >
                {/* Image Card */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-base-200">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
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
                            LKR {hotel.price.toLocaleString()}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {formatUnit(hotel.priceUnit)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {hotel.featured && (
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-tight text-slate-900 border border-white">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="px-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors truncate">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-base-content/40 text-[13px] font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.city}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 3. Attach the Sentinel Ref here at the bottom */}
        <div
          ref={sentinelRef}
          className="py-12 flex flex-col items-center justify-center min-h-[100px]"
        >
          {loading ? (
            <span className="loading loading-infinity loading-lg text-primary/40"></span>
          ) : (
            !hasMore &&
            hotels.length > 0 && (
              <div className="flex flex-col items-center opacity-20">
                <div className="h-px w-20 bg-base-content mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Fin.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDiscovery;
