"use client";

import React from "react";
import { ImageOff } from "lucide-react";

const ImagePlaceholder = ({
  width = "w-full",
  height = "h-48",
  text = "No Image",
  className = "",
  icon: Icon = ImageOff,
}) => {
  return (
    <div
      className={`${width} ${height} bg-base-200 flex flex-col items-center justify-center gap-2 rounded-box ${className}`}
    >
      <Icon className="w-10 h-10 text-base-content/30" />
      <span className="text-sm text-base-content/40">{text}</span>
    </div>
  );
};

export default ImagePlaceholder;
