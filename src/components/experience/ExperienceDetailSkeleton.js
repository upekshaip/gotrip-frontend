"use client";

import React from "react";

const ExperienceDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-base-300 rounded w-48"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Image & Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image skeleton */}
          <div className="w-full h-72 bg-base-300 rounded-box"></div>

          {/* Title & badges */}
          <div className="space-y-3">
            <div className="h-8 bg-base-300 rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-base-300 rounded w-20"></div>
              <div className="h-6 bg-base-300 rounded w-24"></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-full"></div>
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-base-200 rounded-box space-y-2">
                <div className="h-3 bg-base-300 rounded w-16"></div>
                <div className="h-5 bg-base-300 rounded w-20"></div>
              </div>
            ))}
          </div>

          {/* Reviews section skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-base-300 rounded w-32"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 bg-base-200 rounded-box space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-base-300 rounded-full"></div>
                  <div className="h-4 bg-base-300 rounded w-24"></div>
                </div>
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Booking form skeleton */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 sticky top-4">
            <div className="card-body space-y-4">
              <div className="h-6 bg-base-300 rounded w-32"></div>
              <div className="h-8 bg-base-300 rounded w-full"></div>
              <div className="h-10 bg-base-300 rounded w-full"></div>
              <div className="h-10 bg-base-300 rounded w-full"></div>
              <div className="h-10 bg-base-300 rounded w-full"></div>
              <div className="h-12 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailSkeleton;
