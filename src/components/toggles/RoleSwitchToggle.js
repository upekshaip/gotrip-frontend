"use client";

import { getUserData, storeUserData } from "@/hooks/UseUserInfo";
import { UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RoleSwitchToggle = () => {
  const pathname = usePathname();
  const [newRole, setNewRole] = useState(() => {
    const userData = getUserData();
    const currentPath = pathname;
    if (currentPath.startsWith("/admin") && userData?.role === "admin") {
      return "admin";
    }
    if (
      currentPath.startsWith("/service-provider") &&
      (userData?.role === "serviceProvider" || userData?.role === "admin")
    ) {
      return "serviceProvider";
    }
    if (
      currentPath.startsWith("/traveller") &&
      (userData?.role === "traveller" ||
        userData?.role === "serviceProvider" ||
        userData?.role === "admin")
    ) {
      return "traveller";
    }
    return userData?.viewAs || "traveller";
  });
  const router = useRouter();
  const switchRole = async () => {
    const userData = getUserData();
    if (!userData) return;

    //  if userData.role is admin, can switch to teacher and student
    // if userData.role is teacher, can switch to student (and back to teacher)
    // if userData.role is student, can only be student
    // needs to rotate through available roles based on original role
    let nextRole = "";
    if (userData.role === "admin") {
      if (newRole === "admin") nextRole = "serviceProvider";
      else if (newRole === "serviceProvider") nextRole = "traveller";
      else nextRole = "admin";
    } else if (userData.role === "serviceProvider") {
      if (newRole === "serviceProvider") nextRole = "traveller";
      else nextRole = "serviceProvider";
    } else {
      nextRole = "traveller";
    }
    console.log(nextRole);
    storeUserData({ ...userData, viewAs: nextRole });
    setNewRole(nextRole);
    router.push(`/${nextRole}`);
  };

  return (
    <button
      onClick={async () => await switchRole()}
      // disabled={loading}
      className="btn btn-ghost btn-sm hover:bg-primary/20"
    >
      <UserCog className="w-5 h-5" />
      <span className="capitalize">{newRole}</span>
    </button>
  );
};

export default RoleSwitchToggle;
