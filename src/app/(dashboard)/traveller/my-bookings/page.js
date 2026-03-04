"use client";

import HotelBookings from "@/components/hotel-management/HotelBookings";
import React, { useState } from "react";
import { Hotel, Car, Map, History, LayoutDashboard } from "lucide-react";
import BookingLegacy from "@/components/experience-management/BookingLegacy";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("hotels");

  const tabs = [
    { id: "hotels", label: "Hotels", icon: <Hotel size={16} /> },
    { id: "transport", label: "Transport", icon: <Car size={16} /> },
    { id: "experiences", label: "Experiences", icon: <Map size={16} /> },
  ];

  // Helper for placeholder sections
  const ComingSoon = ({ label }) => (
    <div className="bg-base-200/40 border-2 border-dashed border-base-300 rounded-[2.5rem] text-center">
      <History className="mx-auto opacity-10" size={64} />
      <p className="font-bold opacity-40 uppercase tracking-widest text-xs">
        {label} Adventure Logs Coming Soon
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary/10">
      <div className="mx-auto px-4">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="font-bold tracking-tight">My Bookings</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1.5 bg-base-200 border border-base-300 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-base-100 shadow-md text-primary scale-[1.02]"
                    : "opacity-40 hover:opacity-100 hover:bg-base-100/50"
                }`}
              >
                {tab.icon}
                <span className="uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[400px]">
          {activeTab === "hotels" && <HotelBookings />}

          {activeTab === "transport" && (
            <p>Coming soon...</p>
            // <ComingSoon label="Transport" />
          )}

          {activeTab === "experiences" && <BookingLegacy />}
        </main>
      </div>
    </div>
  );
};

export default BookingsPage;
