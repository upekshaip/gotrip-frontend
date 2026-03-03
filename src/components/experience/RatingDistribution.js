"use client";

import React from "react";
import { Star } from "lucide-react";

const RatingDistribution = ({ reviews = [] }) => {
  const totalReviews = reviews.length;

  // Count reviews per rating (1-5)
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Calculate average
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : "0.0";

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h3 className="card-title text-sm">Rating Distribution</h3>

        {/* Average display */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl font-bold">{avgRating}</span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(avgRating))
                      ? "fill-warning text-warning"
                      : "text-base-content/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-base-content/60 mt-1">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Distribution bars */}
        <div className="space-y-2">
          {distribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-xs w-8 text-right">{rating} ★</span>
              <progress
                className="progress progress-warning flex-1 h-2"
                value={percentage}
                max="100"
              ></progress>
              <span className="text-xs w-8 text-base-content/60">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingDistribution;
