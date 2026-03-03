"use client";

import React, { useEffect, useState } from "react";
import { getUserData } from "@/hooks/UseUserInfo";
import { getMyListings } from "@/hooks/ExperienceApi";
import { getProviderBookings, getProviderPendingBookings } from "@/hooks/BookingApi";
import { LoadingSkeleton } from "@/components/experience";
import { Compass, CalendarCheck, ClipboardList, TrendingUp } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalExperiences: 0,
    availableExperiences: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getUserData();
    setUser(data);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [listings, bookings, pending] = await Promise.all([
        getMyListings().catch(() => []),
        getProviderBookings().catch(() => []),
        getProviderPendingBookings().catch(() => []),
      ]);

      const listingsArr = Array.isArray(listings) ? listings : [];
      const bookingsArr = Array.isArray(bookings) ? bookings : [];
      const pendingArr = Array.isArray(pending) ? pending : [];

      setStats({
        totalExperiences: listingsArr.length,
        availableExperiences: listingsArr.filter((e) => e.available).length,
        totalBookings: bookingsArr.length,
        pendingBookings: pendingArr.length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Welcome back, {user?.name || user?.email || "Provider"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Compass className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Experiences</div>
          <div className="stat-value text-primary">{stats.totalExperiences}</div>
          <div className="stat-desc">{stats.availableExperiences} currently available</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Bookings</div>
          <div className="stat-value text-secondary">{stats.totalBookings}</div>
          <div className="stat-desc">Across all experiences</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-warning">{stats.pendingBookings}</div>
          <div className="stat-desc">Awaiting your response</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Availability Rate</div>
          <div className="stat-value text-accent">
            {stats.totalExperiences > 0
              ? Math.round((stats.availableExperiences / stats.totalExperiences) * 100)
              : 0}
            %
          </div>
          <div className="stat-desc">Of your experiences are live</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/service-provider/experiences/create" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
          <div className="card-body items-center text-center">
            <Compass className="w-10 h-10 text-primary" />
            <h2 className="card-title text-sm">Create Experience</h2>
            <p className="text-xs text-base-content/60">Add a new experience listing</p>
          </div>
        </Link>

        <Link href="/service-provider/booking-requests" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
          <div className="card-body items-center text-center">
            <ClipboardList className="w-10 h-10 text-warning" />
            <h2 className="card-title text-sm">Booking Requests</h2>
            <p className="text-xs text-base-content/60">
              {stats.pendingBookings} pending requests
            </p>
          </div>
        </Link>

        <Link href="/service-provider/experiences" className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
          <div className="card-body items-center text-center">
            <CalendarCheck className="w-10 h-10 text-secondary" />
            <h2 className="card-title text-sm">My Listings</h2>
            <p className="text-xs text-base-content/60">
              Manage your {stats.totalExperiences} experiences
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
