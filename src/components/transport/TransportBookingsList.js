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
  Hash,
  AlertCircle,
  Trash2,
  Car,
  Star,
  Map
} from "lucide-react";
import toast from "react-hot-toast";
import UseFetch from "@/hooks/UseFetch";

const TransportBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);

  // --- Cancellation Modal State ---
  const [cancellingId, setCancellingId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // --- Review Modal State ---
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const observerTarget = useRef(null);
  const limit = 10;

  // --- Fetch Logic ---
  const fetchBookings = useCallback(async (page) => {
    try {
      if (page === 1) setIsLoadingInitial(true);
      else setIsFetchingMore(true);

      const response = await UseFetch(
        "GET",
        `/transport-service/bookings/my-bookings?page=${page}&limit=${limit}`
      );

      if (response.timestamp || response.error) {
        throw new Error(response.message || "Failed to fetch");
      }

      setBookings((prev) => {
        const newContent = response.content || (Array.isArray(response) ? response : []);
        if (page === 1) return newContent;
        // Filter duplicates for infinite scroll
        const existingIds = new Set(prev.map((b) => b.booking.bookingId));
        const uniqueNewContent = newContent.filter(
          (b) => !existingIds.has(b.booking.bookingId)
        );
        return [...prev, ...uniqueNewContent];
      });

      setTotalPages(response.page?.totalPages || response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
      toast.error("Could not sync your transport bookings.");
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
      { threshold: 1.0 }
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
        "PATCH",
        `/transport-service/bookings/${cancellingId}/cancel`
      );

      if (response && !response.error && !response.timestamp) {
        toast.success("Ride cancelled successfully");
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

  // --- Review Logic ---
  const handleOpenReview = (bookingWrap) => {
    setSelectedBooking(bookingWrap);
    setReviewData({ rating: 5, comment: "" });
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!reviewData.comment.trim()) {
      toast.error("Please add a comment to your review.");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload = {
        transportId: selectedBooking.booking.transportId,
        bookingId: selectedBooking.booking.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      
      const res = await UseFetch("POST", "/transport-service/reviews", payload);
      if (res && !res.error) {
        toast.success("Review submitted successfully!");
        setReviewModalOpen(false);
      } else {
        toast.error("Failed to submit review. Have you already reviewed this ride?");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmittingReview(false);
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
      case "COMPLETED":
        return {
          color: "text-info",
          bg: "bg-info/10",
          border: "border-info/20",
          icon: <CheckCircle2 size={14} className="text-info" />,
        };
      case "DECLINED":
      case "CANCELLED":
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
        <Car className="opacity-10 mb-4" size={64} />
        <p className="font-bold opacity-40">No ride bookings found.</p>
      </div>
    );

  return (
    <div className="space-y-4 pb-8 relative mt-6">
      {bookings.map((item, index) => {
        const { booking, providerContact } = item;
        const statusStyle = getStatusStyles(booking.status);

        return (
          <div
            key={`${booking.bookingId}-${index}`}
            tabIndex={0}
            className={`collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md focus:shadow-md group`}
          >
            {/* Header: Visible Summary */}
            <div className="collapse-title text-base font-medium p-4 pr-12 flex items-center gap-4">
              
              {/* Thumbnail (Car Icon) */}
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-base-200 flex items-center justify-center border border-base-300">
                 <Car size={28} className="text-primary opacity-80" />
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base truncate leading-none">
                    Ride Booking #{booking.bookingReference}
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

                  {/* Provider Name */}
                  <span className="hidden sm:block text-xs opacity-40 font-medium truncate">
                    Provider: {providerContact?.name || "Verified Partner"}
                  </span>
                </div>
              </div>

              {/* Price (Right Aligned) */}
              <div className="text-right hidden xs:block">
                <p className="text-sm sm:text-base font-black text-base-content leading-none">
                  {formatCurrency(booking.totalAmount)}
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
                
                {/* 1. Locations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 opacity-40">
                    <Hash size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Ref: {booking.bookingReference}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 opacity-40 mb-1">
                      <Map size={14} />
                      <span className="text-[10px] font-black uppercase">
                        Route
                      </span>
                    </div>
                    <p className="font-medium opacity-80 flex items-center gap-2 text-xs">
                      <MapPin size={12} className="text-success shrink-0" /> {booking.pickupLocation}
                    </p>
                    <p className="font-medium opacity-80 flex items-center gap-2 text-xs mt-1">
                      <MapPin size={12} className="text-error shrink-0" /> {booking.dropoffLocation}
                    </p>
                  </div>
                </div>

                {/* 2. Dates & Times */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 opacity-40 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Schedule
                    </span>
                  </div>
                  <div className="bg-base-200/50 rounded-lg p-2 text-xs border border-base-200">
                    <div className="flex justify-between mb-1">
                      <span className="opacity-60">Pick-up:</span>
                      <span className="font-bold text-right">
                        {formatDate(booking.startingDate)}<br/>
                        <span className="font-normal">{booking.startingTime}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Drop-off:</span>
                      <span className="font-bold text-right">
                        {formatDate(booking.endingDate)}<br/>
                        <span className="font-normal">{booking.endingTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Notes / Messages */}
                <div className="space-y-1 lg:col-span-2">
                  {/* Payment Summary included here to save space */}
                  <div className="bg-base-200/30 rounded-xl p-3 border border-base-200 h-full">
                     <div className="flex justify-between items-center opacity-40 mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} />
                          <span className="text-[10px] font-black uppercase">Payment Summary</span>
                        </div>
                     </div>
                     <div className="flex justify-between font-bold text-sm">
                        <span>Total Paid</span>
                        <span className="text-primary">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      
                      {/* Optional Messages */}
                      {booking.requestMessage && (
                        <div className="mt-3 border-t border-base-300/50 pt-2">
                          <span className="text-[10px] font-black uppercase opacity-40 block mb-1">Your Note</span>
                          <p className="text-xs italic opacity-70">{booking.requestMessage}</p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (Cancel / Review) */}
              {(booking.status === "PENDING" || booking.status === "ACCEPTED" || booking.status === "COMPLETED") && (
                <div className="mt-4 pt-4 border-t border-base-200 flex justify-end gap-3">
                  
                  {/* Cancel Button */}
                  {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                    <button
                      className="btn btn-outline btn-error btn-sm gap-2"
                      onClick={() => setCancellingId(booking.bookingId)}
                    >
                      <Trash2 size={14} /> Cancel Booking
                    </button>
                  )}

                  {/* Review Button */}
                  {booking.status === "COMPLETED" && (
                    <button 
                      onClick={() => handleOpenReview(item)} 
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <Star size={14} /> Leave a Review
                    </button>
                  )}
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

      {/* --- DaisyUI Confirmation Modal for Cancellation --- */}
      <dialog
        className={`modal modal-bottom sm:modal-middle ${cancellingId ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <AlertCircle size={20} /> Cancel Ride
          </h3>
          <p className="py-4 text-sm opacity-80">
            Are you sure you want to cancel this ride request? This action
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

      {/* --- Review Modal --- */}
      {reviewModalOpen && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4 text-center">Rate your ride</h3>
            <p className="text-center text-sm opacity-70 mb-6">Booking {selectedBooking.booking.bookingReference}</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={32} 
                  className={`cursor-pointer transition-colors ${reviewData.rating >= star ? "fill-warning text-warning" : "text-base-300"}`} 
                  onClick={() => setReviewData({...reviewData, rating: star})}
                />
              ))}
            </div>

            <div className="form-control mb-6">
              <label className="label"><span className="label-text font-bold">Write your review</span></label>
              <textarea 
                className="textarea textarea-bordered h-24 w-full" 
                placeholder="How was the driver? Was the vehicle clean?"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              ></textarea>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setReviewModalOpen(false)}>Close</button>
              <button className="btn btn-primary" disabled={submittingReview} onClick={submitReview}>
                {submittingReview ? <Loader2 className="animate-spin" /> : "Submit Review"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setReviewModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default TransportBookingsList;