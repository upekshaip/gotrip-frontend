"use client";
import React from "react";

const categoryColors = {
  TOUR: "badge-primary",
  RENTAL: "badge-secondary",
  ACTIVITY: "badge-accent",
};

const CategoryBadge = ({ category }) => {
  const colorClass = categoryColors[category] || "badge-ghost";
  const label = category
    ? category.charAt(0) + category.slice(1).toLowerCase()
    : "Unknown";

  return <span className={`badge ${colorClass} badge-sm`}>{label}</span>;
};

export default CategoryBadge;
