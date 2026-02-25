"use client";

import { Icon, PlaneTakeoff } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Icon Container with separate background and icon layers */}
      <div className="relative p-2.5 flex items-center justify-center">
        <div className="absolute inset-0 bg-current opacity-20 rounded-xl backdrop-blur-md"></div>
        <PlaneTakeoff size={24} className="relative z-20" />{" "}
        {/* Icon is now z-indexed above the bg */}
      </div>
      <span className="font-black tracking-tighter text-2xl italic">
        goTrip
      </span>
    </div>
  );
};

export default Logo;
