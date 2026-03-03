"use client";
import { Star } from "lucide-react";
import React from "react";

const StarRating = ({ rating = 0, onRate = null, size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? "fill-warning text-warning"
              : "fill-none text-base-content/30"
          } ${onRate ? "cursor-pointer hover:text-warning transition-colors" : ""}`}
          onClick={() => onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
