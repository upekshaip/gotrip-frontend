"use client";

import React from "react";
import { Award, TrendingUp, Eye, Calendar } from "lucide-react";

const ExperienceStatsCard = ({ experience, className = "" }) => {
  if (!experience) return null;

  const {
    totalBookings = 0,
    totalReviews = 0,
    averageRating = 0,
    viewCount = 0,
    createdAt,
  } = experience;

  const statItems = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: totalBookings,
      color: "text-primary",
    },
    {
      icon: Award,
      label: "Reviews",
      value: totalReviews,
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      label: "Avg Rating",
      value: averageRating > 0 ? averageRating.toFixed(1) : "N/A",
      color: "text-warning",
    },
    {
      icon: Eye,
      label: "Views",
      value: viewCount,
      color: "text-info",
    },
  ];

  return (
    <div className={`card bg-base-200 ${className}`}>
      <div className="card-body p-4">
        <h3 className="card-title text-sm mb-2">Experience Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {statItems.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <div>
                <p className="text-xs text-base-content/60">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceStatsCard;
