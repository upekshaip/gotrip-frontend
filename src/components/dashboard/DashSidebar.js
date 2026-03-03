"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logoutFrontend } from "@/hooks/Logout";
import clsx from "clsx";
import Logo from "../reusable/Logo";

export default function DashSidebar({
  isOpen,
  toggleSidebar,
  menuItems,
  activeItem,
  setActiveItem,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. Logic to group and sort menu items
  const groupedMenuItems = useMemo(() => {
    if (!menuItems) return [];

    // Filter only items marked with 'menu: true'
    const visibleItems = menuItems.filter((item) => item.menu);

    // Group items by the 'group' property
    const groups = visibleItems.reduce((acc, item) => {
      const groupKey = item.group || 0; // Default group 0
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    }, {});

    // Sort group IDs numerically and sort items within each group by 'order'
    return Object.keys(groups)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => ({
        groupId: key,
        items: groups[key].sort((a, b) => (a.order || 0) - (b.order || 0)),
      }));
  }, [menuItems]);

  // 2. Logic to update active item (Parent Matching)
  useEffect(() => {
    if (!menuItems) return;

    // We only want to match against items that actually appear in the sidebar
    const sidebarItems = menuItems.filter((item) => item.menu && item.url);

    // Find the longest matching URL prefix to handle sub-routes like /edit/1
    const active = sidebarItems
      .sort((a, b) => b.url.length - a.url.length)
      .find((item) => {
        // Strip dynamic segments (e.g., :id) for cleaner prefix matching
        const baseUrl = item.url.split("/:")[0];
        return pathname.startsWith(baseUrl);
      });

    if (active) {
      setActiveItem(active.name);
    }
  }, [pathname, menuItems, setActiveItem]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logoutFrontend();
    setIsLoggingOut(false);
  };

  const handleItemClick = (item) => {
    if (item.name === "Logout") {
      handleLogout();
    } else {
      setActiveItem(item.name);
      router.push(item.url);
    }
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <div>
      <div
        className={clsx(`fixed top-0 left-0 h-screen w-68
        bg-base-100 backdrop-blur-xl md:bg-base-100 md:backdrop-blur-0
        p-0 pt-6 pb-8 border-r border-base-300 md:border-base-300
        rounded-tr-xl rounded-br-xl md:rounded-none
        transform transition-transform duration-300 ease-in-out z-20
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`)}
      >
        <div className="flex justify-start items-center px-4 mb-6">
          <Logo />
        </div>

        <ul className="menu text-sm space-y-2 w-full py-1 ml-2">
          {menuItems === null && (
            <li className="flex items-center justify-center mt-16">
              <span className="loading loading-spinner loading-xl"></span>
            </li>
          )}

          {groupedMenuItems.map((group, groupIdx) => (
            <React.Fragment key={group.groupId}>
              {/* Add a divider between groups (but not before the first one) */}
              {groupIdx > 0 && (
                <div className="divider my-1 pr-8 h-1 opacity-50"></div>
              )}

              {group.items.map((item) => (
                <li key={item.name}>
                  <button
                    className={clsx(
                      "btn-wide transition flex border-0 rounded-r-lg",
                      activeItem === item.name
                        ? "bg-primary text-white"
                        : "hover:bg-base-200",
                      item.action === "logout" && isLoggingOut && "opacity-50",
                    )}
                    onClick={() => handleItemClick(item)}
                    disabled={item.action === "logout" && isLoggingOut}
                  >
                    <div className="flex justify-start items-center gap-4 w-full min-w-0">
                      <span className="flex-shrink-0">
                        {item.name === "Logout" && isLoggingOut ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <div className="h-4 w-4">{item.icon}</div>
                        )}
                      </span>
                      <span className="truncate flex-1 text-left">
                        {item.name === "Logout" && isLoggingOut
                          ? "Logging out..."
                          : item.name}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
