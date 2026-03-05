/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Loader2,
  Inbox,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  BedDouble,
  Hash,
  AlertCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import UseFetch from "@/hooks/UseFetch";

const CameraBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  // --- Cancellation Modal State ---
  const [cancellingId, setCancellingId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const observerTarget = useRef(null);
  const limit = 10;

  // --- Fetch Logic ---
  const fetchBookings = useCallback(async (page) => {
    try {
      if (page === 1) setIsLoadingInitial(true);
      else setIsFetchingMore(true);

      const response = await UseFetch(
        "GET",
        `/camera-booking/my-bookings?page=${page}&limit=${limit}`,
      );

      if (response.timestamp || response.error) {
        throw new Error(response.message || "Failed to fetch");
      }

      setBookings((prev) => {
        const newContent = response.content || [];
        if (page === 1) return newContent;
        // Filter duplicates
        const existingIds = new Set(prev.map((b) => b.booking.bookingId));
        const uniqueNewContent = newContent.filter(
          (b) => !existingIds.has(b.booking.bookingId),
        );
        return [...prev, ...uniqueNewContent];
      });

      setTotalPages(response.page?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
      toast.error("Could not sync your bookings.");
    } finally {
      setIsLoadingInitial(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  // --- Infinite Scroll ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !isLoadingInitial) {
          if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 1.0 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [
    observerTarget,
    isFetchingMore,
    isLoadingInitial,
    currentPage,
    totalPages,
  ]);

  // --- Cancellation Logic ---
  const confirmCancellation = async () => {
    if (!cancellingId) return;

    setIsCancelling(true);

    try {
      const response = await UseFetch(
        "DELETE",
        `/camera-booking/${cancellingId}/cancel`,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success("Booking cancelled successfully");
        setCancellingId(null);
        // Reset and refetch from page 1 to get fresh data
        setBookings([]);
        setCurrentPage(1);
        fetchBookings(1);
        setIsLoadingInitial(true);
      } else {
        toast.error(response.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsCancelling(false);
    }
  };

  // --- Formatters ---
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // --- Status Styling ---
  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-warning",
          bg: "bg-warning/10",
          border: "border-warning/20",
          icon: <Clock size={14} className="text-warning" />,
        };
      case "ACCEPTED":
        return {
          color: "text-success",
          bg: "bg-success/10",
          border: "border-success/20",
          icon: <CheckCircle2 size={14} className="text-success" />,
        };
      case "DECLINED":
        return {
          color: "text-error",
          bg: "bg-error/10",
          border: "border-error/20",
          icon: <XCircle size={14} className="text-error" />,
        };
      default:
        return {
          color: "text-base-content/60",
          bg: "bg-base-200",
          border: "border-base-300",
          icon: <AlertCircle size={14} />,
        };
    }
  };

  // --- Loading States ---
  if (isLoadingInitial && bookings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
        <Loader2 className="animate-spin mb-4 text-primary" size={40} />
      </div>
    );

  if (!isLoadingInitial && bookings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-base-200/30 border-2 border-dashed border-base-200 rounded-[2rem]">
        <Inbox className="opacity-10 mb-4" size={64} />
        <p className="font-bold opacity-40">No bookings found.</p>
      </div>
    );

  return (
    <div className="space-y-4 pb-8 relative">
      {bookings.map((item, index) => {
        const { booking, cameraDetails } = item;
        const statusStyle = getStatusStyles(booking.status);

        return (
          <div
            key={`${booking.bookingId}-${index}`}
            tabIndex={0}
            className={`collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md focus:shadow-md group`}
          >
            {/* Header: Visible Summary */}
            <div className="collapse-title text-base font-medium p-4 pr-12 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
                <img
                  src={cameraDetails?.imageUrl || "https://placehold.co/100x100"}
                  alt={cameraDetails?.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base truncate leading-none">
                    {cameraDetails?.name || "Camera Booking"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}
                  >
                    {statusStyle.icon}
                    {booking.status}
                  </div>

                  {/* Date Range (Hidden on very small screens) */}
                  <span className="hidden sm:block text-xs opacity-40 font-medium truncate">
                    {formatDate(booking.startingDate)} —{" "}
                    {formatDate(booking.endingDate)}
                  </span>
                </div>
              </div>

              {/* Price (Right Aligned) */}
              <div className="text-right hidden xs:block">
                <p className="text-sm sm:text-base font-black text-base-content leading-none">
                  {formatCurrency(booking.finalAmount)}
                </p>
                <p className="text-[9px] sm:text-[10px] opacity-40 uppercase font-bold tracking-wider mt-1">
                  Total
                </p>
              </div>
            </div>

            {/* Content: Hidden Details */}
            <div className="collapse-content text-sm">
              <div className="pt-2 pb-2 opacity-50">
                <div className="divider my-0"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
                {/* 1. Location & Ref */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-40">
                    <Hash size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Ref: {booking.bookingReference}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 opacity-40 mb-1">
                      <MapPin size={14} />
                      <span className="text-[10px] font-black uppercase">
                        Location
                      </span>
                    </div>
                    <p className="font-medium opacity-80">
                      {cameraDetails?.address}, {cameraDetails?.city}
                    </p>
                  </div>
                </div>

                {/* 2. Dates */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-40 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Schedule
                    </span>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-2 text-xs border border-base-200">
                    <div className="flex justify-between mb-1">
                      <span className="opacity-60">In:</span>
                      <span className="font-bold">
                        {formatDate(booking.startingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Out:</span>
                      <span className="font-bold">
                        {formatDate(booking.endingDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Guests */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-40 mb-1">
                    <BedDouble size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Details
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-medium opacity-80">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary opacity-70" />
                      {booking.personCount} Guests
                    </div>
                    <div className="flex items-center gap-2">
                      <Inbox size={16} className="text-primary opacity-70" />
                      {booking.roomCount} Rooms
                    </div>
                  </div>
                </div>

                {/* 4. Payment Breakdown */}
                <div className="bg-base-200/30 rounded-xl p-3 border border-base-200">
                  <div className="flex items-center gap-2 opacity-40 mb-2">
                    <CreditCard size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Payment
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between opacity-60">
                      <span>Subtotal</span>
                      <span>{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    {booking.discountAmount > 0 && (
                      <div className="flex justify-between text-success font-medium">
                        <span>Savings</span>
                        <span>-{formatCurrency(booking.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm pt-2 mt-1 border-t border-base-300/50">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(booking.finalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Message */}
              {booking.requestMessage && (
                <div className="">
                  <p className="text-xs font-medium mt-4 mb-1">Your Note</p>
                  <div className="text-xs italic opacity-60 bg-base-200/50 p-2 rounded border-l-2 border-primary">
                    {booking.requestMessage}
                  </div>
                </div>
              )}
              {/* Optional Message */}
              {booking.providerMessage && (
                <div>
                  <p className="text-xs font-medium mt-4 mb-1">
                    Message from Provider
                  </p>
                  <div className="text-xs italic opacity-60 bg-base-200/50 p-2 rounded border-l-2 border-success">
                    {booking.providerMessage}
                  </div>
                </div>
              )}

              {booking.status === "PENDING" && (
                <div className="mt-4 flex justify-end">
                  <button
                    className="btn btn-outline btn-error btn-sm gap-2"
                    onClick={() => setCancellingId(booking.bookingId)}
                  >
                    <Trash2 size={14} /> Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Infinite Scroll Sentinel */}
      <div ref={observerTarget} className="flex justify-center py-6 h-12">
        {isFetchingMore && (
          <Loader2 className="animate-spin text-primary opacity-50" size={24} />
        )}
      </div>

      {/* --- DaisyUI Confirmation Modal --- */}
      <dialog
        className={`modal modal-bottom sm:modal-middle ${cancellingId ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <AlertCircle size={20} /> Cancel Booking
          </h3>
          <p className="py-4 text-sm opacity-80">
            Are you sure you want to cancel this booking request? This action
            cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setCancellingId(null)}
              disabled={isCancelling}
            >
              No, keep it
            </button>
            <button
              className="btn btn-error text-white min-w-[120px]"
              onClick={confirmCancellation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </div>
        {/* Backdrop for closing when clicking outside (disabled while cancelling) */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => !isCancelling && setCancellingId(null)}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default CameraBookings;
