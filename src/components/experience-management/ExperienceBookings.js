"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Loader2,
  Inbox,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Hash,
  AlertCircle,
  Activity,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import UseFetch from "@/hooks/UseFetch";

const ExperienceBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [cancellingId, setCancellingId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const observerTarget = useRef(null);
  const limit = 20;

  const fetchBookings = useCallback(async (page) => {
    try {
      if (page === 0) setIsLoadingInitial(true);
      else setIsFetchingMore(true);

      const response = await UseFetch(
        "GET",
        `/experience/booking/my-bookings?page=${page}&limit=${limit}`,
      );

      if (response && response.content) {
        setBookings((prev) => {
          const newContent = response.content || [];
          if (page === 0) return newContent;

          const existingIds = new Set(
            prev.map((item) => item.booking.bookingId),
          );
          const uniqueNewContent = newContent.filter(
            (item) => !existingIds.has(item.booking.bookingId),
          );
          return [...prev, ...uniqueNewContent];
        });

        setTotalPages(response.totalPages || 1);
      } else if (response.error || response.timestamp) {
        throw new Error(response.message || "Failed to fetch");
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      toast.error("Could not sync your bookings.");
    } finally {
      setIsLoadingInitial(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !isLoadingInitial) {
          if (currentPage < totalPages - 1) {
            const next = currentPage + 1;
            setCurrentPage(next);
            fetchBookings(next);
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
    fetchBookings,
  ]);

  const confirmCancellation = async () => {
    if (!cancellingId) return;
    setIsCancelling(true);

    try {
      const response = await UseFetch(
        "DELETE",
        `/experience/booking/${cancellingId}/cancel`,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success("Booking cancelled successfully.");
        setCancellingId(null);

        setBookings([]);
        setCurrentPage(0);
        fetchBookings(0);
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10), 0);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-warning",
          bg: "bg-warning/10",
          border: "border-warning/20",
          icon: <Clock size={14} className="text-warning" />,
        };
      case "CONFIRMED":
      case "ACCEPTED":
      case "ACCEPT":
        return {
          color: "text-success",
          bg: "bg-success/10",
          border: "border-success/20",
          icon: <CheckCircle2 size={14} className="text-success" />,
        };
      case "CANCELLED":
      case "DECLINED":
      case "EXPIRED":
        return {
          color: "text-error",
          bg: "bg-error/10",
          border: "border-error/20",
          icon: <XCircle size={14} className="text-error" />,
        };
      case "COMPLETED":
        return {
          color: "text-info",
          bg: "bg-info/10",
          border: "border-info/20",
          icon: <CheckCircle2 size={14} className="text-info" />,
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

  return (
    <div className="space-y-6 pb-8 relative">
      {isLoadingInitial && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
          <Loader2 className="animate-spin mb-4 text-primary" size={40} />
        </div>
      ) : !isLoadingInitial && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-base-200/30 border-2 border-dashed border-base-200 rounded-[2rem]">
          <Inbox className="opacity-10 mb-4" size={64} />
          <h3 className="text-lg font-bold">No bookings found</h3>
          <p className="text-sm opacity-50 mt-1">
            You haven&apos;t made any experience bookings yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((item, index) => {
            const { booking, experience } = item;
            const statusStyle = getStatusStyles(booking.status);

            return (
              <div
                key={`${booking.bookingId}-${index}`}
                tabIndex={0}
                className={`collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md focus:shadow-md group`}
              >
                <div className="collapse-title text-base font-medium p-4 pr-12 flex items-center gap-4">
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
                    {experience?.imageUrl ? (
                      <img
                        src={experience.imageUrl}
                        alt={booking.experienceTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                        <Activity size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base truncate leading-none">
                        {booking.experienceTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color}`}
                      >
                        {statusStyle.icon}
                        {booking.status}
                      </div>

                      <span className="hidden sm:block text-xs opacity-40 font-medium truncate">
                        {formatDate(booking.bookingDate)} at{" "}
                        {formatTime(booking.startTime)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right hidden xs:block">
                    <p className="text-sm sm:text-base font-black text-base-content leading-none">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] opacity-40 uppercase font-bold tracking-wider mt-1">
                      Total
                    </p>
                  </div>
                </div>

                <div className="collapse-content text-sm">
                  <div className="pt-2 pb-2 opacity-50">
                    <div className="divider my-0"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 opacity-40">
                        <Hash size={12} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Ref: EXP-{booking.bookingId}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 opacity-40 mb-1">
                          <Activity size={14} />
                          <span className="text-[10px] font-black uppercase">
                            Category
                          </span>
                        </div>
                        <p className="font-medium opacity-80 uppercase text-xs">
                          {booking.experienceCategory} •{" "}
                          {booking.experienceType}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 opacity-40 mb-1">
                        <Calendar size={14} />
                        <span className="text-[10px] font-black uppercase">
                          Schedule
                        </span>
                      </div>
                      <div className="bg-base-200/50 rounded-lg p-2 text-xs border border-base-200">
                        <div className="flex justify-between mb-1">
                          <span className="opacity-60">Date:</span>
                          <span className="font-bold">
                            {formatDate(booking.bookingDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="opacity-60">Time:</span>
                          <span className="font-bold">
                            {formatTime(booking.startTime)}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1 pt-1 border-t border-base-300">
                          <span className="opacity-60">Duration:</span>
                          <span className="font-bold">
                            {booking.durationHours} Hour(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 opacity-40 mb-1">
                        <Users size={14} />
                        <span className="text-[10px] font-black uppercase">
                          Booking Details
                        </span>
                      </div>
                      <div className="flex items-center gap-4 font-medium opacity-80">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">
                            {booking.quantity}
                          </span>
                          Quantity / Guests
                        </div>
                      </div>
                    </div>

                    <div className="bg-base-200/30 rounded-xl p-3 border border-base-200 flex flex-col justify-end">
                      <div className="flex items-center gap-2 opacity-40 mb-2">
                        <CreditCard size={14} />
                        <span className="text-[10px] font-black uppercase">
                          Payment
                        </span>
                      </div>
                      <div className="flex justify-between font-black text-base mt-auto">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatCurrency(booking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.requestMessage && (
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-1 opacity-60">
                        Your Note
                      </p>
                      <div className="text-sm opacity-80 bg-base-200/50 p-3 rounded-lg border-l-2 border-primary">
                        {booking.requestMessage}
                      </div>
                    </div>
                  )}
                  {booking.providerMessage && (
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-1 opacity-60">
                        Message from Provider
                      </p>
                      <div className="text-sm opacity-80 bg-base-200/50 p-3 rounded-lg border-l-2 border-success">
                        {booking.providerMessage}
                      </div>
                    </div>
                  )}

                  {booking.declineReason && (
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-1 opacity-60 text-error">
                        Decline Reason
                      </p>
                      <div className="text-sm opacity-80 bg-error/5 p-3 rounded-lg border-l-2 border-error">
                        {booking.declineReason}
                      </div>
                    </div>
                  )}

                  {booking.status === "PENDING" && (
                    <div className="mt-4 flex justify-end border-t border-base-200 pt-4">
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
        </div>
      )}

      <div ref={observerTarget} className="flex justify-center py-6 h-12">
        {isFetchingMore && (
          <Loader2 className="animate-spin text-primary opacity-50" size={24} />
        )}
      </div>

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
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => !isCancelling && setCancellingId(null)}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default ExperienceBookings;
