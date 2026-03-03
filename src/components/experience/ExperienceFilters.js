"use client";
import React from "react";
import { Filter } from "lucide-react";

const categories = ["ALL", "TOUR", "RENTAL", "ACTIVITY"];

const ExperienceFilters = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter size={16} className="text-base-content/50" />
      {categories.map((cat) => (
        <button
          key={cat}
          className={`btn btn-sm ${
            selectedCategory === cat ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
};

export default ExperienceFilters;
