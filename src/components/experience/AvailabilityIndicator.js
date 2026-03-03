"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const AvailabilityIndicator = ({ available, showLabel = true, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;
  const textSize = textSizes[size] || textSizes.md;

  if (available) {
    return (
      <div className="flex items-center gap-1">
        <CheckCircle className={`${iconSize} text-success`} />
        {showLabel && <span className={`${textSize} text-success font-medium`}>Available</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <XCircle className={`${iconSize} text-error`} />
      {showLabel && <span className={`${textSize} text-error font-medium`}>Unavailable</span>}
    </div>
  );
};

export default AvailabilityIndicator;
