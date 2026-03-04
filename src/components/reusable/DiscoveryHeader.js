"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

const DiscoveryHeader = ({
  title,
  subtitle,
  category,
  searchTerm,
  setSearchTerm,
  placeholder = "Search destinations...",
}) => {
  return (
    <header className="px-8 pt-8 pb-6 bg-base-100">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          {/* Category Label (e.g., PREMIUM STAYS) */}
          <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2">
            {category}
          </h2>
          {/* Main Title (e.g., Experience Sri Lanka) */}
          <h1 className="text-4xl font-black tracking-tight leading-none text-base-content">
            {title}
          </h1>
          {/* Subtitle (e.g., Like never before.) */}
          <p className="text-2xl font-bold text-base-content/30 tracking-tight">
            {subtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={placeholder}
              className="input input-bordered w-full pl-12 bg-base-200/50 border-none rounded-2xl focus:bg-base-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-square btn-ghost bg-base-200/50 rounded-2xl border-none">
            <Filter className="w-5 h-5 text-base-content/60" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DiscoveryHeader;
