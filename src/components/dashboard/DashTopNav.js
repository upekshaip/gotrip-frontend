/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { routes } from "@/config/routes";
import { getUserData, storeUserData } from "@/hooks/UseUserInfo";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashTopNav({ activeItem }) {
  const pathname = usePathname();
  const params = useParams();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const [activeRole, setActiveRole] = useState(() => {
    const userData = getUserData();
    return userData ? userData.viewAs.toLowerCase() : "student";
  });

  // role switch check
  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.role) {
      const pathUser = pathname.split("/")[1];
      if (userData.viewAs !== pathUser) {
        setActiveRole(pathUser);
        storeUserData({ ...userData, viewAs: pathUser });
      } else {
        setActiveRole(userData.viewAs.toLowerCase());
      }
    }
  }, [activeItem, pathname]);

  const logic = () => {
    const crumbs = [];
    const roleRoutes = Object.values(routes[activeRole] || {});
    const commonRoutes = Object.values(routes.common || {});

    [...roleRoutes, ...commonRoutes].forEach((item) => {
      const cleanRoute = item.route;
      //   remove dynamic index 0 (dashboard)
      if (
        !item.name.toLowerCase().includes("dashboard") &&
        pathname.startsWith(cleanRoute)
      ) {
        if (!crumbs.find((c) => c.route === item.route)) {
          crumbs.push(item);
        }
      }
      // handle dynamic routes
      const segmantRoutes = item.route.includes("/:")
        ? item.route.split("/:")
        : null;
      const segmantRoute = segmantRoutes ? segmantRoutes[0] : null;

      // what this does: if the current path starts with the segmantRoute and the crumb is not already added, add it with the dynamic part replaced by the actual param
      if (
        segmantRoute &&
        pathname.startsWith(segmantRoute) &&
        !crumbs.find((c) => c.route === item.route)
      ) {
        crumbs.push({
          ...item,
          route: `${segmantRoute}/${params[segmantRoutes[1]]}`,
        });
      }
    });

    setBreadcrumbItems(crumbs);
  };

  useEffect(() => {
    logic();
  }, [pathname, activeItem, activeRole, params]);

  if (
    pathname === "/student" ||
    pathname === "/teacher" ||
    pathname === "/admin"
  ) {
    return; // No breadcrumb on dashboard home
  }

  if (breadcrumbItems.length === 0) {
    return; // No breadcrumb to show
  }

  return (
    <section className="my-2">
      <div className="breadcrumbs text-sm">
        <ul>
          {breadcrumbItems.map((crumb, idx) => (
            <li key={idx}>
              <Link href={crumb.route} className={``}>
                {crumb.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
