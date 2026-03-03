"use client";
import React, { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "@/hooks/BookingApi";
import BookingCard from "@/components/experience/BookingCard";
import { CalendarCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const statusTabs = ["ALL", "PENDING", "ACCEPTED", "DECLINED", "CANCELLED", "EXPIRED", "COMPLETED"];

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const result = await cancelBooking(bookingId);
      if (result?.bookingId) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
      } else {
        toast.error(result?.message || "Failed to cancel booking");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const filtered =
    activeTab === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarCheck size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-sm text-base-content/60">
            Track all your experience bookings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            className={`tab tab-sm ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-base-content/50">
        {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Bookings list */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              actions={
                booking.status === "PENDING" ? (
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleCancel(booking.bookingId)}
                  >
                    Cancel
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <CalendarCheck
            size={48}
            className="mx-auto text-base-content/20 mb-4"
          />
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-sm text-base-content/50 mt-1">
            {activeTab === "ALL"
              ? "You haven't made any bookings yet"
              : `No ${activeTab.toLowerCase()} bookings`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
