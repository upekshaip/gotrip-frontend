/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  getUserData,
  storeViewAs,
  storeUserData,
  getViewAs,
} from "@/hooks/UseUserInfo";
import { UserCog } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const RoleSwitchToggle = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentView, setCurrentView] = useState("traveller");

  useEffect(() => {
    // 1. Get the data from cookies
    const _user = JSON.parse(JSON.stringify(getUserData()));

    // 2. Determine the view based on the current path
    let view = _user?.role || "traveller";
    if (pathname.startsWith("/admin") && _user?.role === "admin")
      view = "admin";
    else if (
      pathname.startsWith("/service-provider") &&
      (_user?.role === "serviceProvider" || _user?.role === "admin")
    )
      view = "serviceProvider";
    else if (pathname.startsWith("/traveller")) view = "traveller";

    setCurrentView(view);
    storeViewAs(view);
  }, [pathname]);

  const switchRole = async () => {
    const userData = getUserData();
    if (!userData) return;

    let nextRole = "";
    let newRole = getViewAs();

    if (userData.admin === true || userData.role === "admin") {
      if (newRole === "admin") nextRole = "serviceProvider";
      else if (newRole === "serviceProvider") nextRole = "traveller";
      else nextRole = "admin";
    } else if (userData.role === "serviceProvider") {
      nextRole =
        newRole === "serviceProvider" ? "traveller" : "serviceProvider";
    } else {
      nextRole = "traveller";
    }
    storeViewAs(nextRole);

    const urlSegment = nextRole
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();

    router.push(`/${urlSegment}`);
  };

  return (
    <button
      onClick={switchRole}
      className="btn btn-ghost btn-sm hover:bg-primary/20 flex items-center gap-2"
    >
      <UserCog className="w-5 h-5" />
      <span className="capitalize">
        {currentView.replace(/([A-Z])/g, " $1")}
      </span>
    </button>
  );
};

export default RoleSwitchToggle;
