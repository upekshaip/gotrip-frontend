"use client";
import React, { useEffect, useState } from "react";
import { getAvailableExperiences } from "@/hooks/ExperienceApi";
import ExperienceCard from "@/components/experience/ExperienceCard";
import SearchBar from "@/components/experience/SearchBar";
import ExperienceFilters from "@/components/experience/ExperienceFilters";
import { Compass, Loader2 } from "lucide-react";

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [search, category, experiences]);

  const fetchExperiences = async () => {
    try {
      const data = await getAvailableExperiences();
      if (Array.isArray(data)) {
        setExperiences(data);
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    let result = [...experiences];

    if (category !== "ALL") {
      result = result.filter((exp) => exp.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title?.toLowerCase().includes(q) ||
          exp.location?.toLowerCase().includes(q) ||
          exp.type?.toLowerCase().includes(q) ||
          exp.description?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Compass size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Explore Experiences</h1>
          <p className="text-sm text-base-content/60">
            Discover tours, rentals, and activities across Sri Lanka
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <SearchBar value={search} onChange={setSearch} />
        <ExperienceFilters
          selectedCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-base-content/50">
        {filtered.length} experience{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.experienceId} experience={exp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Compass size={48} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium">No experiences found</h3>
          <p className="text-sm text-base-content/50 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperiencesPage;
