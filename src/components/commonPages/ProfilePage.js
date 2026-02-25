"use client";

import React, { useEffect, useState } from "react";
import { Settings, ShieldCheck } from "lucide-react";
import ProfileDetails from "./ProfileDetails";
import { getUserData } from "@/hooks/UseUserInfo";
import { normalizeRoles, normalizeSriLankaTime } from "@/function/normalize";
import ProfileImage from "../reusable/ProfileImage";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will connect to your /user/profile endpoint
    const fetchProfile = async () => {
      try {
        const user = getUserData();
        console.log(user);
        setUserData({
          name: user.name || "-",
          email: user.email || "alex@example.com",
          role: normalizeRoles(user.role) || "traveller",
          createdAt: user.createdAt || "-",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-200">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Brief Summary Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card bg-base-100 shadow-none border-b lg:border border-base-300 rounded-none lg:rounded-box">
            <div className="card-body items-center text-center">
              {/* prifile icon */}
              <div className="avatar placeholder mb-2">
                <div className="w-20">
                  <ProfileImage
                    className="rounded-xl"
                    name={userData?.name}
                    size={64}
                  />
                </div>
              </div>
              <h2 className="text-xl font-black italic tracking-tighter">
                {userData?.name}
              </h2>
              <div className="badge badge-primary badge-sm font-bold uppercase">
                {userData?.role}
              </div>
              <div className="divider opacity-50"></div>
            </div>
          </div>

          <div className="card bg-neutral text-neutral-content rounded-none lg:rounded-box">
            <div className="card-body p-6 flex-row items-start gap-4">
              <ShieldCheck className="text-primary" size={32} />
              <div>
                <div className="font-bold text-sm">Identity Verified</div>
                <div className="text-xs">
                  Created At:{" "}
                  {normalizeSriLankaTime(userData?.createdAt) || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-4">
          <ProfileDetails />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
