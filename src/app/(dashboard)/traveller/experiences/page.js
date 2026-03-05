/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import UseFetch from "@/hooks/UseFetch";
import { MapPin, Star, ArrowUpRight, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import DiscoveryHeader from "@/components/reusable/DiscoveryHeader";

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-indexed pagination
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const sentinelRef = useRef(null);

  const fetchExperiences = useCallback(
    async (currPage, isFirstLoad = false) => {
      setLoading(true);
      try {
        // Adjust endpoint if needed to match your exact backend route
        const data = await UseFetch(
          "GET",
          `/experience/available?page=${currPage}&limit=12`,
        );

        if (data && data.content) {
          setExperiences((prev) => {
            if (isFirstLoad) return data.content;

            // Filter duplicates just in case
            const existingIds = new Set(prev.map((e) => e.experienceId));
            const newContent = data.content.filter(
              (e) => !existingIds.has(e.experienceId),
            );
            return [...prev, ...newContent];
          });

          // Use 'last' boolean from the paginated response to determine if more pages exist
          setHasMore(!data.last);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial Load
  useEffect(() => {
    fetchExperiences(0, true);
  }, [fetchExperiences]);

  // Observer Logic for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchExperiences(nextPage, false);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
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
  }, [hasMore, loading, page, fetchExperiences]);

  const formatUnit = (unit) => {
    const mapping = {
      PER_DAY: "/ day",
      PER_HOUR: "/ hr",
      PER_PERSON: "/ person",
      PER_ITEM: "/ item",
    };
    return mapping[unit] || "";
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      <DiscoveryHeader
        category="Adventures & Activities"
        title="Explore Experiences"
        subtitle="Discover tours and activities across Sri Lanka."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search experiences or locations..."
      />

      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {experiences
            .filter(
              (exp) =>
                exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exp.location
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                exp.type?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((exp) => (
              <div
                key={exp.experienceId}
                className="group flex flex-col cursor-pointer"
                onClick={() =>
                  router.push(`/traveller/experiences/${exp.experienceId}`)
                }
              >
                {/* Image Card */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-base-200">
                  {exp.imageUrl ? (
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Compass size={40} className="opacity-50" />
                    </div>
                  )}

                  {/* Info Overlay */}
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl flex justify-between items-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                          Start From
                        </p>
                        <div className="flex flex-wrap items-end gap-1">
                          <p className="text-sm font-black text-slate-900">
                            LKR {exp.pricePerUnit?.toLocaleString()}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {formatUnit(exp.priceUnit)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Top Left Tag (Using Type instead of FEATURED) */}
                  {exp.type && (
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-tight text-slate-900 border border-white uppercase">
                        {exp.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="px-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors truncate pr-2">
                      {exp.title}
                    </h3>
                    {/* Placeholder for rating, replace if backend provides it */}
                    <div className="flex items-center gap-1 mt-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-base-content/40 text-[13px] font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{exp.location}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Sentinel at the bottom */}
        <div
          ref={sentinelRef}
          className="py-12 flex flex-col items-center justify-center min-h-[100px]"
        >
          {loading ? (
            <span className="loading loading-infinity loading-lg text-primary/40"></span>
          ) : (
            !hasMore &&
            experiences.length > 0 && (
              <div className="flex flex-col items-center opacity-20">
                <div className="h-px w-20 bg-base-content mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                  Fin.
                </p>
              </div>
            )
          )}
          {!loading && experiences.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <Compass size={48} className="mb-4" />
              <p className="font-bold">No experiences found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperiencesPage;
