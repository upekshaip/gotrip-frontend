"use client";

import React from "react";
import { SortAsc, SortDesc } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name_asc", label: "Name: A-Z" },
  { value: "name_desc", label: "Name: Z-A" },
];

const SortDropdown = ({ value, onChange, options = SORT_OPTIONS, className = "" }) => {
  const isDescending = value?.includes("desc") || value?.includes("high") || value === "newest";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isDescending ? (
        <SortDesc className="w-4 h-4 text-base-content/60" />
      ) : (
        <SortAsc className="w-4 h-4 text-base-content/60" />
      )}
      <select
        className="select select-bordered select-sm"
        value={value || "newest"}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
