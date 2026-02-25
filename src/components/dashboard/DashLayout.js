/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import DashSidebar from "@/components/dashboard/DashSidebar";
import DashHeader from "@/components/dashboard/DashHeader";
import { usePathname } from "next/navigation";
import DashSpeedDial from "./DashSpeedDial";
import { getUserData } from "@/hooks/UseUserInfo";
import { Toaster } from "react-hot-toast";
import { routes } from "@/config/routes";

export default function DashLayout({ children, role }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  // Use a hook or state to get user data
  const userData = getUserData();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // 1. Correctly compute menuItems as an Array
  const menuItems = useMemo(() => {
    if (!isMounted || !userData?.viewAs) {
      return Object.values(routes.common || {});
    }
    let selectedRoutes = {};

    // if the URL is a common route, then do not change the menu items
    let commonRoutes = Object.values(routes.common);
    commonRoutes = commonRoutes.map((route) => route.url);
    if (commonRoutes.some((url) => pathname.startsWith(url))) {
      selectedRoutes = routes[userData.viewAs];
    } else {
      // Determine base routes based on URL
      if (pathname.startsWith("/admin")) {
        selectedRoutes = routes.admin;
      } else if (pathname.startsWith("/service-provider")) {
        selectedRoutes = routes.serviceProvider;
      } else if (pathname.startsWith("/traveller")) {
        // Default to traveller
        selectedRoutes = routes.traveller;
      }
    }

    // Merge with common routes and convert Object values to an Array
    // This prevents the ".filter is not a function" error
    const combined = { ...selectedRoutes, ...routes.common };
    return Object.values(combined);
  }, [pathname, userData]);

  // 2. Sync Active Item whenever pathname or menuItems change
  useEffect(() => {
    if (menuItems && Array.isArray(menuItems)) {
      const active = menuItems
        .filter((item) => item.url) // Ensure item has a URL property
        .sort((a, b) => (b.url?.length || 0) - (a.url?.length || 0)) // Longest match first
        .find((item) => pathname.startsWith(item.url));

      if (active) {
        setActiveItem(active.name);
      }
    }
  }, [pathname, menuItems]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  if (!isMounted) {
    return null; // Or a simple non-dynamic skeleton
  }

  return (
    <div className="flex max-h-screen bg-base-200 min-w-0">
      {/* Sidebar */}
      <DashSidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        menuItems={menuItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "hsl(var(--b1))",
              color: "hsl(var(--bc))",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              maxWidth: "90vw",
              marginRight: "70px",
              wordWrap: "break-word",
              backdropFilter: "blur(10px)",
            },
          }}
        />

        <DashHeader toggleSidebar={toggleSidebar} activeItem={activeItem} />

        <main className="flex-1 overflow-y-auto px-4 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
