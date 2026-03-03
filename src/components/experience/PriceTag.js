"use client";
import React from "react";
import { normalizePrice } from "@/function/normalize";

const PriceTag = ({ price, priceUnit, size = "base" }) => {
  const unitLabel = priceUnit
    ? priceUnit.replace("PER_", "").toLowerCase()
    : "";

  const sizeClasses = {
    sm: "text-sm",
    base: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span className={`font-bold text-primary ${sizeClasses[size] || sizeClasses.base}`}>
      {normalizePrice(price)}
      {unitLabel && (
        <span className="text-xs font-normal text-base-content/50 ml-1">
          /{unitLabel}
        </span>
      )}
    </span>
  );
};

export default PriceTag;
