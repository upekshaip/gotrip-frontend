"use client";
import React, { useEffect, useState } from "react";
import {
  getProviderBookings,
  getProviderPendingBookings,
} from "@/hooks/BookingApi";
import BookingCard from "@/components/experience/BookingCard";
import ProviderActionModal from "@/components/experience/ProviderActionModal";
import { ClipboardList, Loader2, Bell } from "lucide-react";

const ExperienceBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === "PENDING") {
        data = await getProviderPendingBookings();
      } else {
        data = await getProviderBookings();
      }
      if (Array.isArray(data)) {
        if (activeTab !== "PENDING") {
          setBookings(
            data.filter((b) => b.status === activeTab || activeTab === "ALL"),
          );
        } else {
          setBookings(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const tabs = [
    "PENDING",
    "ALL",
    "ACCEPTED",
    "DECLINED",
    "EXPIRED",
    "COMPLETED",
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            className={`tab tab-sm ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            {tab === "PENDING" &&
              bookings.length > 0 &&
              activeTab === "PENDING" && (
                <span className="badge badge-warning badge-xs ml-1">
                  {bookings.length}
                </span>
              )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              actions={
                booking.status === "PENDING" ? (
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => handleRespond(booking)}
                  >
                    Respond
                  </button>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium">No booking requests</h3>
          <p className="text-sm text-base-content/50 mt-1">
            {activeTab === "PENDING"
              ? "No pending requests at the moment"
              : "No bookings in this category"}
          </p>
        </div>
      )}

      {/* Action Modal */}
      <ProviderActionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onSuccess={() => fetchBookings()}
      />
    </div>
  );
};

export default ExperienceBookingRequests;
