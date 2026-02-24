/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { getUserData } from "@/hooks/UseUserInfo";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getUserData();
    setUser(data);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading traveler profile...</div>;

  return (
    <div className="p-4 bg-base-100 rounded-box shadow-md">
      <h1 className="text-xl font-bold">Welcome, Traveler</h1>
      <p className="mt-2 text-sm">
        <span className="">{user?.email || "Guest"}</span>
      </p>
    </div>
  );
};

export default Page;
