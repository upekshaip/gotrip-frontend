"use client";

import React from "react";
import { DollarSign, Users, MapPin, Tag } from "lucide-react";

const ExperienceInfoGrid = ({ experience }) => {
  if (!experience) return null;

  const {
    price,
    priceUnit,
    maxCapacity,
    location,
    experienceType,
  } = experience;

  const priceUnitLabels = {
    PER_PERSON: "per person",
    PER_HOUR: "per hour",
    PER_DAY: "per day",
    FLAT_RATE: "flat rate",
  };

  const infoItems = [
    {
      icon: DollarSign,
      label: "Price",
      value: `$${Number(price || 0).toFixed(2)}`,
      sub: priceUnitLabels[priceUnit] || "",
      color: "text-success",
    },
    {
      icon: Users,
      label: "Capacity",
      value: maxCapacity || "N/A",
      sub: "max people",
      color: "text-info",
    },
    {
      icon: MapPin,
      label: "Location",
      value: location || "N/A",
      sub: "",
      color: "text-error",
    },
    {
      icon: Tag,
      label: "Type",
      value: (experienceType || "")
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" "),
      sub: "",
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {infoItems.map(({ icon: Icon, label, value, sub, color }) => (
        <div key={label} className="bg-base-200 rounded-box p-3 text-center">
          <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
          <p className="text-xs text-base-content/60">{label}</p>
          <p className="font-semibold text-sm truncate">{value}</p>
          {sub && <p className="text-xs text-base-content/40">{sub}</p>}
        </div>
      ))}
    </div>
  );
};

export default ExperienceInfoGrid;
