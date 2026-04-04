/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import {
  Hotel,
  Compass,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Server,
  UserCheck,
  Zap,
  HelpCircle,
  Database,
} from "lucide-react";
import clsx from "clsx";

const InfoPage = () => {
  return (
    <section className="section-container animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* 🔹 HERO HEADER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-base-100 border border-base-300 p-8 md:p-16 mb-8 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="badge badge-primary font-black tracking-[0.2em] mb-4 text-[10px] py-3 px-4 uppercase">
            Platform Documentation v3.2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none mb-6">
            YOUR GUIDE TO <span className="text-primary italic">SEAMLESS</span>{" "}
            TRAVEL.
          </h1>
          <p className="text-sm md:text-md opacity-60 leading-relaxed font-medium">
            Welcome to the internal goTrip knowledge base. This guide is
            designed to clarify the operational mechanics of our
            microservice-driven platform. Whether you are managing your traveler
            profile or operating as a verified service provider, the following
            documentation outlines our core processes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🔹 LEFT COLUMN: Technical & Security Logic */}
        <div className="lg:col-span-1 space-y-6">
          {/* Architecture Overview */}
          <div className="card bg-base-100 border border-base-300 rounded-[2rem] p-6">
            <h3 className="text-lg font-black italic uppercase mb-4 flex items-center gap-2">
              <Server size={20} className="text-primary" /> Architecture
            </h3>
            <p className="text-xs opacity-60 leading-relaxed mb-4">
              goTrip operates on a <strong>Microservice Architecture</strong>.
              This means our Hotel, Experience, and Auth services run
              independently to ensure high availability.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-base-200 rounded-xl border-l-4 border-primary">
                <p className="text-[10px] font-bold uppercase mb-1">
                  State Sync
                </p>
                <p className="text-[10px] opacity-50">
                  Real-time status updates (ACTIVE, PENDING) are synced across
                  services via our internal API gateway.
                </p>
              </div>
              <div className="p-3 bg-base-200 rounded-xl border-l-4 border-secondary">
                <p className="text-[10px] font-bold uppercase mb-1">
                  Map Integration
                </p>
                <p className="text-[10px] opacity-50">
                  Locations are verified using Google Maps API. Exact
                  coordinates are mandatory for all listings.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Roles */}
          <div className="card bg-neutral text-neutral-content rounded-[2rem] p-6 shadow-xl shadow-neutral/20">
            <h3 className="text-lg font-black italic uppercase mb-4 flex items-center gap-2">
              <UserCheck size={20} className="text-primary" /> Identity & Roles
            </h3>
            <p className="text-xs opacity-70 leading-relaxed">
              To maintain platform security, transitioning from a{" "}
              <strong>Traveller</strong> to a <strong>Service Provider</strong>{" "}
              requires a formal registration and a subsequent session refresh.
              <br />
              <br />
              <strong>Note:</strong> Your Auth token must be updated to grant
              permission to management dashboards. If you cannot see your tools
              after registration, please log out and sign in again.
            </p>
          </div>
        </div>

        {/* 🔹 MIDDLE & RIGHT COLUMN: Detailed Operational Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Content Section */}
          <div className="card bg-base-100 border border-base-300 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Database size={120} />
            </div>

            <div className="relative z-10 space-y-12">
              {/* Hotel Service Detailed Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <Hotel className="text-primary" /> 01. Hotel Stay Management
                </h2>
                <div className="prose prose-sm opacity-70 max-w-none space-y-4 font-medium">
                  <p>
                    The goTrip Hotel Microservice is responsible for managing
                    all accommodation-related data. Providers can list
                    properties with detailed pricing models including{" "}
                    <strong>Per Day</strong>, <strong>Per Hour</strong>, and{" "}
                    <strong>Per Person</strong> units.
                  </p>
                  <p>
                    Listing visibility is determined by the <code>status</code>{" "}
                    attribute. While 'ACTIVE' hotels are visible to all
                    travelers, 'PENDING' or 'INACTIVE' listings remain hidden in
                    the management view. Admins have the authority to feature
                    specific hotels, placing them at the top of search results
                    with a 'Featured' badge.
                  </p>
                </div>
              </div>

              {/* Experience Service Detailed Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                  <Compass className="text-secondary" /> 02. Experience &
                  Activities
                </h2>
                <div className="prose prose-sm opacity-70 max-w-none space-y-4 font-medium">
                  <p>
                    Experiences represent curated local activities, tours, and
                    events. Unlike static hotel rooms, experiences are driven by{" "}
                    <strong>Capacity Management</strong>. Every experience has a{" "}
                    <code>maxCapacity</code> limit to ensure safety and quality.
                  </p>
                  <p>
                    Providers must manage the <code>available</code> flag
                    carefully. If an activity is fully booked or temporarily
                    unavailable, switching this toggle immediately hides the
                    listing from the public marketplace, preventing overbooking.
                  </p>
                </div>
              </div>

              {/* Transportation Pause Note */}
              <div className="p-6 bg-warning/5 border border-warning/20 rounded-3xl flex items-start gap-4">
                <AlertTriangle
                  size={24}
                  className="text-warning shrink-0 mt-1"
                />
                <div className="space-y-2">
                  <h4 className="font-black italic uppercase text-warning text-sm">
                    Transport Service Status
                  </h4>
                  <p className="text-xs opacity-60 leading-relaxed font-medium">
                    Transportation services are currently{" "}
                    <strong>PAUSED</strong> for development optimization. We are
                    rebuilding the driver-to-traveler matching algorithm to
                    better support real-time Sri Lankan road conditions. We
                    anticipate this service going live in the final quarter of
                    2026.
                  </p>
                </div>
              </div>

              {/* Support & Troubleshooting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base-200">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <HelpCircle size={16} className="text-primary" /> Common
                    Doubts
                  </h4>
                  <p className="text-[11px] opacity-50">
                    Can I be a provider and a traveler? Yes. Our system supports
                    multi-role profiles under a single UID.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Zap size={16} className="text-primary" /> Quick Support
                  </h4>
                  <p className="text-[11px] opacity-50">
                    Need technical help? Contact our developer support team
                    directly from the internal help desk in your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Bottom System Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-base-100 border border-base-300 rounded-2xl px-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 italic">
                  Auth-Service: Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 italic">
                  Hotel-Service: Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 italic">
                  Experience-Service: Online
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono opacity-30">
              © 2026 GOTRIP ARCHITECTURE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoPage;
