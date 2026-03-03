"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorDisplay = ({ error, onRetry, title = "Something went wrong", className = "" }) => {
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "An unexpected error occurred. Please try again.";

  return (
    <div className={`card bg-error/10 border border-error/20 ${className}`}>
      <div className="card-body items-center text-center py-10">
        <AlertTriangle className="w-12 h-12 text-error mb-2" />
        <h3 className="card-title text-error">{title}</h3>
        <p className="text-sm text-base-content/60 max-w-md">{errorMessage}</p>
        {onRetry && (
          <button className="btn btn-error btn-sm gap-2 mt-4" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
