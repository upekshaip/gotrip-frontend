"use client";

import React from "react";
import { MapPin, Clock, Users, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import CategoryBadge from "./CategoryBadge";
import AvailabilityIndicator from "./AvailabilityIndicator";

const ExperienceListItem = ({ experience, linkPrefix = "/traveller/experiences" }) => {
  if (!experience) return null;

  const {
    id,
    title,
    description,
    category,
    location,
    price,
    priceUnit,
    maxCapacity,
    available,
    averageRating,
    imageUrl,
  } = experience;

  const priceUnitLabels = {
    PER_PERSON: "/person",
    PER_HOUR: "/hour",
    PER_DAY: "/day",
    FLAT_RATE: "flat",
  };

  return (
    <div className="card card-side bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      {/* Image */}
      <figure className="w-48 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-base-content/20" />
          </div>
        )}
      </figure>

      {/* Body */}
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="card-title text-base">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <CategoryBadge category={category} />
              <AvailabilityIndicator available={available} size="sm" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              ${Number(price || 0).toFixed(2)}
            </p>
            <p className="text-xs text-base-content/50">
              {priceUnitLabels[priceUnit] || ""}
            </p>
          </div>
        </div>

        {description && (
          <p className="text-sm text-base-content/60 line-clamp-2 mt-1">{description}</p>
        )}

        <div className="flex items-center gap-4 mt-2 text-xs text-base-content/50">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          )}
          {maxCapacity && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Max {maxCapacity}
            </span>
          )}
          {averageRating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-warning text-warning" />
              {averageRating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="card-actions justify-end mt-2">
          <Link href={`${linkPrefix}/${id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceListItem;
