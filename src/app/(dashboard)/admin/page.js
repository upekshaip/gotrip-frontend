"use client";

import React, { useEffect, useState } from "react";
import { getUserData } from "@/hooks/UseUserInfo";
import {
  getAdminTravellers,
  getAdminProviders,
  getAdminAllHotels,
  getAdminPendingHotels,
  getExperienceAdminStats,
  getTransportAdminStats,
} from "@/hooks/AdminApi";
import { LoadingSkeleton } from "@/components/experience";
import {
  Users,
  Building2,
  Compass,
  Bike,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTravellers: 0,
    totalProviders: 0,
    totalHotels: 0,
    pendingHotels: 0,
    totalExperiences: 0,
    availableExperiences: 0,
    experienceBookings: 0,
    experiencePendingBookings: 0,
    totalTransports: 0,
    activeTransports: 0,
    transportBookings: 0,
    transportPendingBookings: 0,
  });

  useEffect(() => {
    const data = getUserData();
    setUser(data);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [travellers, providers, hotels, pendingHotels, expStats, transStats] =
        await Promise.all([
          getAdminTravellers(1, 1).catch(() => null),
          getAdminProviders(1, 1).catch(() => null),
          getAdminAllHotels(1, 1).catch(() => null),
          getAdminPendingHotels(1, 1).catch(() => null),
          getExperienceAdminStats().catch(() => null),
          getTransportAdminStats().catch(() => null),
        ]);

      setStats({
        totalTravellers: travellers?.totalElements ?? 0,
        totalProviders: providers?.totalElements ?? 0,
        totalHotels: hotels?.totalElements ?? 0,
        pendingHotels: pendingHotels?.totalElements ?? 0,
        totalExperiences: expStats?.totalExperiences ?? 0,
        availableExperiences: expStats?.availableExperiences ?? 0,
        experienceBookings: expStats?.totalBookings ?? 0,
        experiencePendingBookings: expStats?.pendingBookings ?? 0,
        totalTransports: transStats?.totalTransports ?? 0,
        activeTransports: transStats?.activeTransports ?? 0,
        transportBookings: transStats?.totalBookings ?? 0,
        transportPendingBookings: transStats?.pendingBookings ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-box">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-base-content/60 mt-1">
              Welcome back, {user?.name || "Admin"}. Here&apos;s your platform overview.
            </p>
          </div>
        </div>
      </div>

      {/* Users Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" /> User Management
        </h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Travellers</div>
            <div className="stat-value text-primary">{stats.totalTravellers}</div>
            <div className="stat-desc">Registered travellers</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Service Providers</div>
            <div className="stat-value text-secondary">{stats.totalProviders}</div>
            <div className="stat-desc">Registered providers</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-accent">
              {stats.totalTravellers + stats.totalProviders}
            </div>
            <div className="stat-desc">All platform users</div>
          </div>
        </div>
      </div>

      {/* Hotels Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5" /> Hotel Management
        </h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Hotels</div>
            <div className="stat-value text-primary">{stats.totalHotels}</div>
            <div className="stat-desc">All listed hotels</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-warning">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div className="stat-title">Pending Approval</div>
            <div className="stat-value text-warning">{stats.pendingHotels}</div>
            <div className="stat-desc">Awaiting admin review</div>
          </div>
        </div>
      </div>

      {/* Experiences Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Compass className="w-5 h-5" /> Experience Management
        </h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Compass className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Experiences</div>
            <div className="stat-value text-primary">{stats.totalExperiences}</div>
            <div className="stat-desc">{stats.availableExperiences} available</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">Experience Bookings</div>
            <div className="stat-value text-secondary">{stats.experienceBookings}</div>
            <div className="stat-desc">{stats.experiencePendingBookings} pending</div>
          </div>
        </div>
      </div>

      {/* Transport Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bike className="w-5 h-5" /> Transport Management
        </h2>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Bike className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Transports</div>
            <div className="stat-value text-primary">{stats.totalTransports}</div>
            <div className="stat-desc">{stats.activeTransports} active</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">Transport Bookings</div>
            <div className="stat-value text-secondary">{stats.transportBookings}</div>
            <div className="stat-desc">{stats.transportPendingBookings} pending</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/traveller-management"
            className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
          >
            <div className="card-body items-center text-center">
              <Users className="w-10 h-10 text-primary" />
              <h2 className="card-title text-sm">Manage Travellers</h2>
              <p className="text-xs text-base-content/60">
                {stats.totalTravellers} travellers
              </p>
            </div>
          </Link>

          <Link
            href="/admin/service-provider-management"
            className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
          >
            <div className="card-body items-center text-center">
              <Users className="w-10 h-10 text-secondary" />
              <h2 className="card-title text-sm">Manage Providers</h2>
              <p className="text-xs text-base-content/60">
                {stats.totalProviders} providers
              </p>
            </div>
          </Link>

          <Link
            href="/admin/hotel-management"
            className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
          >
            <div className="card-body items-center text-center">
              <Building2 className="w-10 h-10 text-warning" />
              <h2 className="card-title text-sm">Manage Hotels</h2>
              <p className="text-xs text-base-content/60">
                {stats.pendingHotels} pending approval
              </p>
            </div>
          </Link>

          <Link
            href="/admin/experience-management"
            className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
          >
            <div className="card-body items-center text-center">
              <Compass className="w-10 h-10 text-accent" />
              <h2 className="card-title text-sm">Manage Experiences</h2>
              <p className="text-xs text-base-content/60">
                {stats.totalExperiences} experiences
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
