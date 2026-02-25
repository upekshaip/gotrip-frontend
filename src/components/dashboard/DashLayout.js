/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import DashSidebar from "@/components/dashboard/DashSidebar";
import DashHeader from "@/components/dashboard/DashHeader";
import { usePathname } from "next/navigation";
import { getUserData, getViewAs, storeViewAs } from "@/hooks/UseUserInfo";
import { Toaster } from "react-hot-toast";
import { routes } from "@/config/routes";

export default function DashLayout({ children, role }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [viewAs, setViewAs] = useState(() => {
    const _viewAs = getViewAs();
    return _viewAs;
  });
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const user = getUserData();

    if (pathname.startsWith("/admin") && user?.role === "admin")
      setViewAs("admin");
    else if (
      pathname.startsWith("/service-provider") &&
      (user?.role === "serviceProvider" || user?.role === "admin")
    )
      setViewAs("serviceProvider");
    else if (pathname.startsWith("/traveller")) setViewAs("traveller");
    storeViewAs(viewAs);

    const myMenu = Object.values({ ...routes[getViewAs()], ...routes.common });
    setMenuItems(myMenu);
    console.log(typeof myMenu);
  }, [pathname, viewAs]);

  useEffect(() => {
    if (menuItems && Array.isArray(menuItems)) {
      const active = menuItems
        .filter((item) => item.url)
        .sort((a, b) => (b.url?.length || 0) - (a.url?.length || 0))
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
    return null;
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

        <main className="flex-1 overflow-y-auto px-4 mt-4 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
