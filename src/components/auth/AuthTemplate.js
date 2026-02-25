"use client";

import React from "react";
import { PlaneTakeoff, Heart } from "lucide-react";
import Logo from "../reusable/Logo";

const AuthTemplate = ({
  children,
  title,
  subtitle,
  description,
  sideContent,
  accentColor = "primary",
}) => {
  const bgClass = `bg-${accentColor}`;
  const textClass = `text-${accentColor}-content`;

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-0 md:p-8 transition-colors duration-300 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-base-200 rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[650px] border border-base-300">
        {/* Left Side: Dynamic Branding Section */}
        <div
          className={`md:w-5/12 relative ${bgClass} ${textClass} flex flex-col justify-between p-10 overflow-hidden transition-colors duration-500`}
        >
          {/* Decorative Circles */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-current opacity-10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <Logo />
            </div>
            <h1 className="text-4xl font-black leading-[1.1] mb-6">
              {title} <br />
              <span className="opacity-70">{subtitle}</span>
            </h1>
            <p className="text-base opacity-80 font-medium leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

          {/* Bottom Side Content Slot */}
          {sideContent && (
            <div className="mt-6 p-4 bg-base-content/10 backdrop-blur-md rounded-2xl border border-base-content/15 flex items-center justify-center">
              {sideContent}
            </div>
          )}
        </div>

        {/* Right Side: Form Content */}
        <div className="md:w-7/12 bg-base-100 p-8 md:p-14 flex flex-col justify-center text-base-content">
          <div className="max-w-md mx-auto w-full">
            {children}

            <div className="mt-12 flex justify-center items-center gap-2 opacity-30">
              <Heart size={12} className="fill-current" />
              <span className="text-[9px] uppercase font-black tracking-widest">
                Adventure is calling
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
