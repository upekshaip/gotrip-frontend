"use client";
import React from "react";
import { MapPin, Clock, Users } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { normalizePrice } from "@/function/normalize";
import Link from "next/link";

const ExperienceCard = ({ experience, linkPrefix = "/traveller/experiences" }) => {
  const typeLabel = experience.type
    ? experience.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
      <figure className="h-48 bg-base-200 relative">
        {experience.imageUrl ? (
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-base-content/30">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <CategoryBadge category={experience.category} />
        </div>
        {!experience.available && (
          <div className="absolute top-2 right-2">
            <span className="badge badge-error badge-sm">Unavailable</span>
          </div>
        )}
      </figure>
      <div className="card-body p-4 gap-2">
        <h2 className="card-title text-base">{experience.title}</h2>
        <p className="text-xs text-base-content/60 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-base-content/50 mt-1">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {experience.location}
          </span>
          {experience.maxCapacity > 0 && (
            <span className="flex items-center gap-1">
              <Users size={12} /> Max {experience.maxCapacity}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-base-content/50">
          <Clock size={12} /> {typeLabel}
        </div>
        <div className="card-actions justify-between items-center mt-2">
          <span className="text-lg font-bold text-primary">
            {normalizePrice(experience.pricePerUnit)}
            <span className="text-xs font-normal text-base-content/50 ml-1">
              /{experience.priceUnit?.replace("PER_", "").toLowerCase()}
            </span>
          </span>
          <Link
            href={`${linkPrefix}/${experience.experienceId}`}
            className="btn btn-primary btn-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
