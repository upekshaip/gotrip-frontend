"use client";

import React, { useState } from "react";
import { Bike, History } from "lucide-react";
import AdminTransportManagement from "@/components/transport-management/AdminTransportManagement";
import PendingTransportsAdmin from "@/components/transport-management/PendingTransportsAdmin";

const TransportManagementPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", icon: <Bike size={16} /> },
    {
      id: "pendingRequests",
      label: "PendingRequests",
      icon: <History size={16} />,
    },
  ];

  return (
    <div className="min-h-screen text-base-content selection:bg-primary/10">
      <div className="mx-auto px-4">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="font-bold tracking-tight">Transport Management</h1>
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
          {activeTab === "all" && <AdminTransportManagement />}
          {activeTab === "pendingRequests" && <PendingTransportsAdmin />}
        </main>
      </div>
    </div>
  );
};

export default TransportManagementPage;
