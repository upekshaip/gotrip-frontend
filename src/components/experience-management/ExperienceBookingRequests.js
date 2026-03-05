/* eslint-disable @next/next/no-img-element */
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
  Mail,
  Phone,
  User,
  MessageSquare,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import UseFetch from "@/hooks/UseFetch";

const ExperienceBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Starts at 0
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [providerResponses, setProviderResponses] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const observerTarget = useRef(null);
  const limit = 20;

  const fetchBookings = useCallback(async (page) => {
    try {
      if (page === 0) setIsLoadingInitial(true);
      else setIsFetchingMore(true);

      const response = await UseFetch(
        "GET",
        `/experience/booking/provider/all?page=${page}&limit=${limit}`,
      );

      if (response && response.content) {
        setBookings((prev) => {
          const newContent = response.content || [];
          // Reset array if it's the first page (page 0)
          if (page === 0) return newContent;

          // Track uniqueness by the nested bookingId
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
      console.error("Failed to load requests:", err);
      toast.error("Could not sync incoming requests.");
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
          // For 0-indexed pages, the last page is totalPages - 1
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

  const handleResponseChange = (bookingId, text) => {
    setProviderResponses((prev) => ({
      ...prev,
      [bookingId]: text,
    }));
  };

  const handleAction = async (bookingId, statusType) => {
    const message = providerResponses[bookingId] || "";
    setProcessingId(bookingId);

    try {
      const payload = {
        message: message,
        status: statusType,
      };

      const response = await UseFetch(
        "PATCH",
        `/experience/booking/${bookingId}/respond`,
        payload,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success(`Booking ${statusType.toLowerCase()}ed successfully.`);

        setProviderResponses((prev) => {
          const newState = { ...prev };
          delete newState[bookingId];
          return newState;
        });

        // Reset and fetch page 0
        setBookings([]);
        setCurrentPage(0);
        fetchBookings(0);
      } else {
        toast.error(
          response.message || `Failed to ${statusType.toLowerCase()} booking.`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
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
          <p className="text-xs font-bold uppercase tracking-widest opacity-50">
            Loading Experiences...
          </p>
        </div>
      ) : !isLoadingInitial && bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-base-200/30 border-2 border-dashed border-base-200 rounded-[2rem]">
          <Inbox className="opacity-10 mb-4" size={64} />
          <h3 className="text-lg font-bold">No requests found</h3>
          <p className="text-sm opacity-50 mt-1">
            You have no booking requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((item, index) => {
            // Destructure the new response layout
            const { booking, experience } = item;

            const statusStyle = getStatusStyles(booking.status);
            const currentResponse = providerResponses[booking.bookingId] || "";
            const isProcessingThis = processingId === booking.bookingId;

            return (
              <div
                key={`${booking.bookingId}-${index}`}
                tabIndex={0}
                className={`collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md focus:shadow-md group`}
              >
                <div className="collapse-title text-base font-medium p-4 pr-12 flex items-center gap-4">
                  {/* Now mapping the dynamic image if available */}
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
                      <span className="opacity-40 text-xs hidden md:inline">
                        • {booking.contact?.name}
                      </span>
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

                  {booking.contact && (
                    <div className="mt-6 p-4 bg-base-200/30 border border-base-200 rounded-xl">
                      <div className="flex items-center gap-2 opacity-60 mb-3">
                        <User size={16} />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          Guest Information
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="opacity-50 text-xs mb-1">Name</p>
                          <p className="font-medium">{booking.contact.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="opacity-40" />
                          <div className="truncate">
                            <p className="opacity-50 text-xs mb-1">Email</p>
                            <p className="font-medium truncate">
                              {booking.contact.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="opacity-40" />
                          <div>
                            <p className="opacity-50 text-xs mb-1">Phone</p>
                            <p className="font-medium">
                              {booking.contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.status === "PENDING" ? (
                    <div className="mt-6 border-t border-base-200 pt-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase font-bold opacity-50 block mb-2 flex items-center gap-1">
                            <MessageSquare size={12} /> Provider Response
                          </label>
                          <textarea
                            className="textarea textarea-bordered w-full text-sm bg-base-200/20 focus:bg-base-100 min-h-[5rem]"
                            placeholder="Add a message for the guest..."
                            value={currentResponse}
                            onChange={(e) =>
                              handleResponseChange(
                                booking.bookingId,
                                e.target.value,
                              )
                            }
                            disabled={isProcessingThis}
                          />
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-end md:w-48">
                          <button
                            className="btn btn-success text-white flex-1 md:flex-none shadow-sm"
                            onClick={() =>
                              handleAction(booking.bookingId, "ACCEPTED")
                            }
                            disabled={isProcessingThis}
                          >
                            {isProcessingThis ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Accept
                          </button>
                          <button
                            className="btn btn-error btn-outline flex-1 md:flex-none shadow-sm"
                            onClick={() =>
                              handleAction(booking.bookingId, "DECLINED")
                            }
                            disabled={isProcessingThis}
                          >
                            {isProcessingThis ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <XCircle size={16} />
                            )}
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {booking.requestMessage && (
                        <div>
                          <p className="text-xs font-medium mb-1 opacity-60">
                            Guest&apos;s Note
                          </p>
                          <div className="text-sm opacity-80 bg-error/5 p-3 rounded-lg border-l-2 border-primary">
                            {booking.requestMessage}
                          </div>
                        </div>
                      )}
                      {booking.providerMessage && (
                        <div>
                          <p className="text-xs font-medium mb-1 opacity-60">
                            Your Response
                          </p>
                          <div className="text-sm opacity-80 bg-base-200/50 p-3 rounded-lg border-l-2 border-base-content/20">
                            {booking.providerMessage}
                          </div>
                        </div>
                      )}
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
    </div>
  );
};

export default ExperienceBookingRequests;
