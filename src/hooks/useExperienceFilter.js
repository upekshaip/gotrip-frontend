"use client";

import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook for filtering and sorting experience lists
 * @param {Array} items - All items to filter/sort
 * @returns {object} Filtered items and filter controls
 */
const useExperienceFilter = (items = []) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category && category !== "ALL") {
      result = result.filter((item) => item.category === category);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "price_low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "name_asc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "name_desc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        break;
    }

    return result;
  }, [items, search, category, sortBy]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("ALL");
    setSortBy("newest");
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    if (category && category !== "ALL") count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [search, category, sortBy]);

  return {
    filteredItems,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    clearFilters,
    activeFilterCount,
    totalCount: items.length,
    filteredCount: filteredItems.length,
  };
};

export default useExperienceFilter;
