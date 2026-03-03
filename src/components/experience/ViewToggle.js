"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";

const ViewToggle = ({ view = "grid", onChange, className = "" }) => {
  return (
    <div className={`join ${className}`}>
      <button
        className={`join-item btn btn-sm ${view === "grid" ? "btn-primary" : "btn-ghost"}`}
        onClick={() => onChange("grid")}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        className={`join-item btn btn-sm ${view === "list" ? "btn-primary" : "btn-ghost"}`}
        onClick={() => onChange("list")}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewToggle;
