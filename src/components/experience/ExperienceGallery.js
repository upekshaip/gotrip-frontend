"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

const ExperienceGallery = ({ images = [], title = "Experience" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-base-200 rounded-box flex flex-col items-center justify-center gap-2">
        <ImageOff className="w-12 h-12 text-base-content/30" />
        <span className="text-base-content/40">No images available</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative w-full h-72 rounded-box overflow-hidden bg-base-200">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              className="btn btn-circle btn-sm btn-ghost bg-base-100/60 absolute left-2 top-1/2 -translate-y-1/2"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="btn btn-circle btn-sm btn-ghost bg-base-100/60 absolute right-2 top-1/2 -translate-y-1/2"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 badge badge-neutral badge-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceGallery;
