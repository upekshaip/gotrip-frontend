"use client";

import React from "react";
import { Sliders, X } from "lucide-react";

const FilterChips = ({ filters = {}, onRemove, onClearAll, className = "" }) => {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value !== null && value !== undefined && value !== "" && value !== "ALL"
  );

  if (activeFilters.length === 0) return null;

  const formatLabel = (key, value) => {
    const labels = {
      category: `Category: ${value}`,
      location: `Location: ${value}`,
      minPrice: `Min: $${value}`,
      maxPrice: `Max: $${value}`,
      sortBy: `Sort: ${value}`,
      search: `Search: ${value}`,
    };
    return labels[key] || `${key}: ${value}`;
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Sliders className="w-4 h-4 text-base-content/50" />
      {activeFilters.map(([key, value]) => (
        <div key={key} className="badge badge-outline gap-1">
          <span className="text-xs">{formatLabel(key, value)}</span>
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => onRemove(key)}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {activeFilters.length > 1 && (
        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={onClearAll}
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterChips;
