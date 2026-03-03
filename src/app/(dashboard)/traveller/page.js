/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { getUserData } from "@/hooks/UseUserInfo";
import { getAvailableExperiences } from "@/hooks/ExperienceApi";
import { getMyBookings } from "@/hooks/BookingApi";
import { getMyReviews } from "@/hooks/ReviewApi";
import { LoadingSkeleton } from "@/components/experience";
import { Compass, CalendarCheck, Star, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableExperiences: 0,
    myBookings: 0,
    pendingBookings: 0,
    myReviews: 0,
  });

  useEffect(() => {
    const data = getUserData();
    setUser(data);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [experiences, bookings, reviews] = await Promise.all([
        getAvailableExperiences().catch(() => []),
        getMyBookings().catch(() => []),
        getMyReviews().catch(() => []),
      ]);

      const expArr = Array.isArray(experiences) ? experiences : [];
      const bookArr = Array.isArray(bookings) ? bookings : [];
      const revArr = Array.isArray(reviews) ? reviews : [];

      setStats({
        availableExperiences: expArr.length,
        myBookings: bookArr.length,
        pendingBookings: bookArr.filter((b) => b.status === "PENDING").length,
        myReviews: revArr.length,
      });
    } catch (error) {
      console.error("Failed to fetch traveller stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-box">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Traveller"}!</h1>
        <p className="text-base-content/60 mt-1">
          Discover amazing experiences and start your next adventure
        </p>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Compass className="w-8 h-8" />
          </div>
          <div className="stat-title">Available Experiences</div>
          <div className="stat-value text-primary">{stats.availableExperiences}</div>
          <div className="stat-desc">Ready to book</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">My Bookings</div>
          <div className="stat-value text-secondary">{stats.myBookings}</div>
          <div className="stat-desc">{stats.pendingBookings} pending</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <Star className="w-8 h-8" />
          </div>
          <div className="stat-title">My Reviews</div>
          <div className="stat-value text-accent">{stats.myReviews}</div>
          <div className="stat-desc">Experiences reviewed</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/traveller/experiences" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <MapPin className="w-10 h-10 text-primary" />
            <h2 className="card-title text-sm">Browse Experiences</h2>
            <p className="text-xs text-base-content/60">
              Explore {stats.availableExperiences} available experiences
            </p>
          </div>
        </Link>

        <Link href="/traveller/my-bookings" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <CalendarCheck className="w-10 h-10 text-secondary" />
            <h2 className="card-title text-sm">My Bookings</h2>
            <p className="text-xs text-base-content/60">
              View and manage your bookings
            </p>
          </div>
        </Link>

        <Link href="/traveller/my-reviews" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <Star className="w-10 h-10 text-accent" />
            <h2 className="card-title text-sm">My Reviews</h2>
            <p className="text-xs text-base-content/60">
              Manage your experience reviews
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;
