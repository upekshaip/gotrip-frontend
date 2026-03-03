"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";

const ExperienceMapPreview = ({ location, className = "" }) => {
  if (!location) return null;

  const encodedLocation = encodeURIComponent(location);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=13&size=400x200&maptype=roadmap&markers=color:red%7C${encodedLocation}`;

  return (
    <div className={`card bg-base-200 ${className}`}>
      <div className="card-body p-4">
        <h3 className="card-title text-sm">
          <MapPin className="w-4 h-4" />
          Location
        </h3>

        {/* Location text */}
        <p className="text-base-content/70 text-sm">{location}</p>

        {/* Map placeholder */}
        <div className="w-full h-32 bg-base-300 rounded-box flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-error mx-auto" />
            <p className="text-xs text-base-content/40 mt-1">{location}</p>
          </div>
        </div>

        {/* Open in maps link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline btn-primary gap-2"
        >
          <Navigation className="w-3 h-3" />
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};

export default ExperienceMapPreview;
