"use client";

import { routes } from "@/config/routes";

import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  redirect(routes.admin.travellerManagement.url);
};

export default page;
