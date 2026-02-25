/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Menu } from "lucide-react";
import { logoutFrontend } from "@/hooks/Logout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationDropdown from "./Notificationdropdown";
import RoleSwitchToggle from "@/components/toggles/RoleSwitchToggle";
import { User, Bell, LogOut } from "lucide-react";
import { getUserData } from "@/hooks/UseUserInfo";
import { useEffect, useState } from "react";
import ProfileImage from "../reusable/ProfileImage";

export default function DashHeader({ toggleSidebar, activeItem }) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  const user = getUserData();

  const handleLogout = () => {
    logoutFrontend();
    router.push("/login");
  };

  return (
    <header className="relative bg-base-100 px-4 py-2 shadow flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold">{activeItem}</h2>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* role switch */}
        <RoleSwitchToggle />

        {/* Notifications */}
        <div className="flex items-center">
          <NotificationDropdown />
        </div>

        {/* Profile dropdown */}
        <div className="hidden md:block dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <ProfileImage name={user?.name} />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={() => router.push("/profile")}>
                <User className="w-4 h-4" />
                {"Profile"}
              </button>
            </li>

            <li>
              <button onClick={() => router.push("/notifications")}>
                <Bell className="w-4 h-4" />
                {"Notifications"}
              </button>
            </li>

            <li>
              <button onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                {"Logout"}
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile sidebar button */}
        <button
          className="md:hidden btn btn-ghost btn-circle hover:bg-primary/20 ml-1"
          onClick={toggleSidebar}
          aria-label={"Open menu"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
