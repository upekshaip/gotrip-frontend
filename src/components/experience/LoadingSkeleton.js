"use client";
import React from "react";

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm border border-base-200">
          <figure className="h-48 bg-base-200 animate-pulse" />
          <div className="card-body p-4 gap-3">
            <div className="h-4 bg-base-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-base-200 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-base-200 rounded animate-pulse w-1/2"></div>
            <div className="flex justify-between mt-2">
              <div className="h-6 bg-base-200 rounded animate-pulse w-1/4"></div>
              <div className="h-8 bg-base-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
