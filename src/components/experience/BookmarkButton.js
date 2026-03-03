"use client";

import React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

const BookmarkButton = ({ isBookmarked = false, onToggle, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "btn-xs",
    md: "btn-sm",
    lg: "btn-md",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      className={`btn btn-ghost ${sizeClasses[size] || sizeClasses.md} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.(!isBookmarked);
      }}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className={`${iconSizes[size] || iconSizes.md} fill-primary text-primary`} />
      ) : (
        <Bookmark className={`${iconSizes[size] || iconSizes.md} text-base-content/50`} />
      )}
    </button>
  );
};

export default BookmarkButton;
