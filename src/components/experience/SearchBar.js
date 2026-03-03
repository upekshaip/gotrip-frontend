"use client";
import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search experiences..." }) => {
  return (
    <div className="form-control w-full max-w-md">
      <label className="input input-bordered flex items-center gap-2">
        <Search size={16} className="text-base-content/50" />
        <input
          type="text"
          className="grow"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default SearchBar;
