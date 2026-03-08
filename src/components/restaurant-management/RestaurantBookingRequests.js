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
  UtensilsCrossed,
  Hash,
  AlertCircle,
  Mail,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import UseFetch from "@/hooks/UseFetch";

const RestaurantBookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  const [providerResponses, setProviderResponses] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const observerTarget = useRef(null);
  const limit = 10;

  const fetchBookings = useCallback(async (page) => {
    try {
      if (page === 1) setIsLoadingInitial(true);
      else setIsFetchingMore(true);

      const response = await UseFetch(
        "GET",
        `/restaurant-booking/incoming-requests?page=${page}&limit=${limit}`,
      );

      if (response.timestamp || response.error) {
        throw new Error(response.message || "Failed to fetch");
      }

      setBookings((prev) => {
        const newContent = response.content || [];
        if (page === 1) return newContent;
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
      setError("Failed to load requests.");
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
        `/restaurant-booking/${bookingId}/respond`,
        payload,
      );

      if (response && !response.error && !response.timestamp) {
        toast.success(
          `Booking ${statusType === "ACCEPT" ? "accepted" : "declined"} successfully.`,
        );

        setProviderResponses((prev) => {
          const newState = { ...prev };
          delete newState[bookingId];
          return newState;
        });

        setBookings([]);
        setCurrentPage(1);
        fetchBookings(1);
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
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
        <p className="font-bold opacity-40">No incoming requests found.</p>
      </div>
    );

  return (
    <div className="space-y-4 pb-8 relative">
      {bookings.map((item, index) => {
        const { booking, restaurantDetails, travellerInfo } = item;
        const statusStyle = getStatusStyles(booking.status);
        const currentResponse = providerResponses[booking.bookingId] || "";
        const isProcessingThis = processingId === booking.bookingId;

        return (
          <div
            key={`${booking.bookingId}-${index}`}
            tabIndex={0}
            className={`collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md focus:shadow-md group`}
          >
            {/* Header */}
            <div className="collapse-title text-base font-medium p-4 pr-12 flex items-center gap-4">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
                <img
                  src={restaurantDetails?.imageUrl || "https://placehold.co/100x100"}
                  alt={restaurantDetails?.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base truncate leading-none">
                    {restaurantDetails?.name || "Restaurant Booking"}
                  </h3>
                  <span className="opacity-40 text-xs hidden md:inline">
                    • {travellerInfo?.name}
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
                    {formatDate(booking.startingDate)} —{" "}
                    {formatDate(booking.endingDate)}
                  </span>
                </div>
              </div>

              <div className="text-right hidden xs:block">
                <p className="text-sm sm:text-base font-black text-base-content leading-none">
                  {formatCurrency(booking.finalAmount)}
                </p>
                <p className="text-[9px] sm:text-[10px] opacity-40 uppercase font-bold tracking-wider mt-1">
                  Total
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="collapse-content text-sm">
              <div className="pt-2 pb-2 opacity-50">
                <div className="divider my-0"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-1">
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
                      {restaurantDetails?.address}, {restaurantDetails?.city}
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
                      <span className="opacity-60">From:</span>
                      <span className="font-bold">
                        {formatDate(booking.startingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">To:</span>
                      <span className="font-bold">
                        {formatDate(booking.endingDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-40 mb-1">
                    <UtensilsCrossed size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Reservation
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-medium opacity-80">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary opacity-70" />
                      {booking.personCount} Guests
                    </div>
                    <div className="flex items-center gap-2">
                      <Inbox size={16} className="text-primary opacity-70" />
                      {booking.roomCount} Tables
                    </div>
                  </div>
                </div>

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

              {/* Guest Information */}
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
                    <p className="font-medium">
                      {travellerInfo?.name || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="opacity-40" />
                    <div>
                      <p className="opacity-50 text-xs mb-1">Email</p>
                      <p className="font-medium">
                        {travellerInfo?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="opacity-40" />
                    <div>
                      <p className="opacity-50 text-xs mb-1">Phone</p>
                      <p className="font-medium">
                        {travellerInfo?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.requestMessage && (
                <div className="mt-4">
                  <p className="text-xs font-medium mb-1 opacity-60">
                    Guest Note
                  </p>
                  <div className="text-sm italic opacity-80 bg-base-200/50 p-3 rounded-lg border-l-2 border-primary">
                    {booking.requestMessage}
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
                        placeholder="Add a message for the guest (e.g., reservation details or reason for decline)..."
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
                booking.providerMessage && (
                  <div className="mt-4">
                    <p className="text-xs font-medium mb-1 opacity-60">
                      Your Response
                    </p>
                    <div className="text-sm opacity-80 bg-base-200/50 p-3 rounded-lg border-l-2 border-base-content/20">
                      {booking.providerMessage}
                    </div>
                  </div>
                )
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
    </div>
  );
};

export default RestaurantBookingRequests;
