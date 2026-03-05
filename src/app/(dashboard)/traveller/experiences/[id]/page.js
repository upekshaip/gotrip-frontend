"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExperienceById } from "@/hooks/ExperienceApi";
import { getReviewsByExperience, getReviewSummary } from "@/hooks/ReviewApi";
import UseFetch from "@/hooks/UseFetch";

import ReviewCard from "@/components/experience/ReviewCard";
import ReviewModal from "@/components/experience/ReviewModal";
import StarRating from "@/components/experience/StarRating";
import ProfileImage from "@/components/reusable/ProfileImage";
import { routes } from "@/config/routes";

import {
  MapPin,
  Star,
  ShieldCheck,
  ChevronLeft,
  Users,
  Clock,
  Calendar as CalendarIcon,
  Loader2,
  Activity,
  MessageSquarePlus,
  MessageSquare,
  Timer,
} from "lucide-react";
import toast from "react-hot-toast";

// Helper for currency formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(price || 0);
};

const ExperienceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id;

  // --- Data State ---
  const [experience, setExperience] = useState(null);
  const [contact, setContact] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);

  // --- UI State ---
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // --- Booking State ---
  const [bookingData, setBookingData] = useState({
    bookingDate: "",
    startTime: "10:00",
    quantity: 1,
    durationHours: 1,
    requestMessage: "",
  });

  const [summary, setSummary] = useState({
    totalAmount: 0,
    finalAmount: 0,
  });

  // 1. Fetch Experience Data
  useEffect(() => {
    if (experienceId) {
      fetchData();
    }
  }, [experienceId]);

  const fetchData = async () => {
    try {
      const [data, reviewData, summaryData] = await Promise.all([
        getExperienceById(experienceId),
        getReviewsByExperience(experienceId),
        getReviewSummary(experienceId),
      ]);

      if (data?.experience) {
        setExperience(data.experience);
        setContact(data.contact);
      }

      if (Array.isArray(reviewData)) setReviews(reviewData);
      if (summaryData) setReviewSummary(summaryData);
    } catch (err) {
      console.error("Failed to fetch experience details:", err);
      toast.error("Failed to load experience details.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-time Calculation Engine
  useEffect(() => {
    if (!experience) return;

    const { quantity, durationHours } = bookingData;
    const price = experience.pricePerUnit || 0;

    let calculatedTotal = price * quantity;

    if (experience.priceUnit === "PER_HOUR") {
      calculatedTotal *= durationHours;
    }

    setSummary({
      totalAmount: calculatedTotal,
      finalAmount: calculatedTotal,
    });
  }, [bookingData, experience]);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Submit Handler
  const handleReservation = async () => {
    if (!bookingData.bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }
    if (!bookingData.startTime) {
      toast.error("Please select a starting time.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        experienceId: parseInt(experienceId),
        bookingDate: bookingData.bookingDate,
        startTime: bookingData.startTime,
        quantity: bookingData.quantity,
        durationHours: bookingData.durationHours,
        requestMessage: bookingData.requestMessage,
      };

      const response = await UseFetch(
        "POST",
        "/experience/booking/request",
        payload,
      );

      if (response && !response.error && !response.timestamp) {
        setBookingSuccess(true);
        toast.success("Booking request sent successfully!");

        setTimeout(() => {
          router.push(routes.traveller.myBookings.url);
        }, 2000);
      } else {
        toast.error(response.message || "Failed to create booking request.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Experience not found</h2>
        <button onClick={() => router.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  const typeLabel = experience.type
    ? experience.type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="bg-base-100 min-h-screen pb-20 font-sans text-base-content">
      {/* --- HERO IMAGE SECTION --- */}
      <div className="relative h-[60vh] w-full group bg-base-300">
        {experience.imageUrl ? (
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/20">
            <Activity size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-base-100/90"></div>

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <button
            onClick={() => router.back()}
            className="btn btn-circle btn-ghost bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-2">
              <span className="badge badge-primary badge-lg font-bold uppercase tracking-wider border-none">
                {experience.category}
              </span>
              <span className="badge badge-outline badge-lg text-white border-white/40 font-bold uppercase tracking-wider">
                {typeLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
              {experience.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90 font-medium mt-3 drop-shadow-sm">
              <span className="flex items-center gap-1">
                <MapPin size={18} className="text-primary" />{" "}
                {experience.location}
              </span>
              {reviewSummary && reviewSummary.totalReviews > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={18} className="fill-warning text-warning" />
                  {reviewSummary.averageRating?.toFixed(1)} (
                  {reviewSummary.totalReviews} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="mx-auto px-6 lg:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl">
        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-12">
          {/* Host */}
          <div className="flex items-center justify-between border-b border-base-200 pb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">
                Hosted by {contact?.name || "Provider"}
              </h3>
              <p className="opacity-60 text-sm">
                Professional Guide • Verified
              </p>
            </div>
            <div className="avatar placeholder">
              <ProfileImage name={contact?.name || "P"} size={48} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">About this experience</h3>
            <p className="leading-relaxed opacity-80 whitespace-pre-line">
              {experience.description || "No description provided."}
            </p>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-6 border border-base-200 rounded-2xl bg-base-200/20">
              <div className="mb-3 opacity-70">
                <Activity size={24} />
              </div>
              <span className="font-bold text-sm text-center">{typeLabel}</span>
              <span className="text-xs opacity-50 mt-1 uppercase tracking-wider">
                Activity
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-base-200 rounded-2xl bg-base-200/20">
              <div className="mb-3 opacity-70">
                <MapPin size={24} />
              </div>
              <span className="font-bold text-sm text-center">
                {experience.location}
              </span>
              <span className="text-xs opacity-50 mt-1 uppercase tracking-wider">
                Location
              </span>
            </div>
            {experience.maxCapacity > 0 && (
              <div className="flex flex-col items-center justify-center p-6 border border-base-200 rounded-2xl bg-base-200/20">
                <div className="mb-3 opacity-70">
                  <Users size={24} />
                </div>
                <span className="font-bold text-sm text-center">
                  Up to {experience.maxCapacity}
                </span>
                <span className="text-xs opacity-50 mt-1 uppercase tracking-wider">
                  Group Size
                </span>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-4 border-t border-base-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">Reviews</h3>
                <span className="badge badge-base-200 font-bold">
                  {reviews.length}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm gap-2 rounded-full"
                onClick={() => setShowReviewModal(true)}
              >
                <MessageSquarePlus size={16} /> Write Review
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.reviewId} review={review} />
                ))}
              </div>
            ) : (
              <div className="bg-base-200/40 rounded-3xl p-8 text-center border border-base-200 border-dashed">
                <Star size={32} className="mx-auto opacity-20 mb-3" />
                <p className="font-medium opacity-60">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING CALCULATOR */}
        <div className="relative h-full">
          <div className="sticky top-24">
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
              <div className="card-body p-6 md:p-8 space-y-6">
                {/* Header: Price per Unit */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-black text-primary">
                      {formatPrice(experience.pricePerUnit)}
                    </span>
                    <span className="text-sm opacity-60 font-medium uppercase tracking-wide ml-1">
                      /{experience.priceUnit?.replace("PER_", "").toLowerCase()}
                    </span>
                  </div>
                </div>

                {!experience.available ? (
                  <div className="alert alert-warning rounded-xl">
                    <span>This experience is currently unavailable.</span>
                  </div>
                ) : bookingSuccess ? (
                  <div className="alert alert-success rounded-xl bg-success/10 text-success border-none">
                    <Loader2 size={24} className="animate-spin" />
                    <div className="flex flex-col">
                      <span className="font-bold">Request Sent!</span>
                      <span className="text-xs opacity-80">
                        Redirecting to your bookings...
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* --- DYNAMIC INPUT GROUP --- */}
                    <div className="border border-base-300 rounded-2xl overflow-hidden bg-base-100">
                      {/* Row 1: Date & Time */}
                      <div className="grid grid-cols-2 border-b border-base-300">
                        <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300 relative">
                          <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                            <CalendarIcon size={10} /> Date
                          </label>
                          <input
                            type="date"
                            className="w-full bg-transparent text-sm font-bold focus:outline-none"
                            onChange={(e) =>
                              handleInputChange("bookingDate", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="p-3 hover:bg-base-200 transition-colors relative">
                          <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                            <Clock size={10} /> Start Time
                          </label>
                          <input
                            type="time"
                            value={bookingData.startTime}
                            className="w-full bg-transparent text-sm font-bold focus:outline-none"
                            onChange={(e) =>
                              handleInputChange("startTime", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Row 2: Quantity & Duration */}
                      <div className="grid grid-cols-2">
                        <div className="p-3 hover:bg-base-200 transition-colors border-r border-base-300 flex flex-col justify-center">
                          <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                            <Users size={10} /> Quantity
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">
                              {bookingData.quantity}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleInputChange(
                                    "quantity",
                                    Math.max(1, bookingData.quantity - 1),
                                  )
                                }
                                className="btn btn-xs btn-circle btn-ghost border-base-300"
                              >
                                -
                              </button>
                              <button
                                onClick={() => {
                                  const nextVal = bookingData.quantity + 1;
                                  if (
                                    experience.maxCapacity > 0 &&
                                    nextVal > experience.maxCapacity
                                  ) {
                                    toast.error(
                                      `Maximum capacity is ${experience.maxCapacity}`,
                                    );
                                    return;
                                  }
                                  handleInputChange("quantity", nextVal);
                                }}
                                className="btn btn-xs btn-circle btn-ghost border-base-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 hover:bg-base-200 transition-colors flex flex-col justify-center">
                          <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                            <Timer size={10} /> Duration (Hrs)
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">
                              {bookingData.durationHours}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleInputChange(
                                    "durationHours",
                                    Math.max(1, bookingData.durationHours - 1),
                                  )
                                }
                                className="btn btn-xs btn-circle btn-ghost border-base-300"
                              >
                                -
                              </button>
                              <button
                                onClick={() =>
                                  handleInputChange(
                                    "durationHours",
                                    bookingData.durationHours + 1,
                                  )
                                }
                                className="btn btn-xs btn-circle btn-ghost border-base-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Message (Textarea) */}
                      <div className="p-3 hover:bg-base-200 transition-colors border-t border-base-300">
                        <label className="text-[10px] uppercase font-bold opacity-50 block mb-1 flex items-center gap-1">
                          <MessageSquare size={10} /> Special Request
                        </label>
                        <textarea
                          className="textarea textarea-ghost w-full bg-transparent text-sm p-0 min-h-[3rem] focus:outline-none resize-none leading-tight"
                          placeholder="e.g. Pickup location, dietary requirements..."
                          value={bookingData.requestMessage}
                          onChange={(e) =>
                            handleInputChange("requestMessage", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleReservation}
                      disabled={submitting || summary.finalAmount <= 0}
                      className="btn btn-primary w-full btn-lg rounded-xl shadow-lg shadow-primary/20 text-lg font-bold disabled:bg-base-300 disabled:text-base-content/30"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />{" "}
                          Processing...
                        </>
                      ) : (
                        "Request Booking"
                      )}
                    </button>
                    <p className="text-center text-xs opacity-50 font-medium">
                      You won&apos;t be charged yet
                    </p>

                    {/* --- PRICE BREAKDOWN --- */}
                    {summary.totalAmount > 0 && (
                      <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between text-sm opacity-80">
                          <span className="underline decoration-dotted text-xs sm:text-sm">
                            {formatPrice(experience.pricePerUnit)} x{" "}
                            {bookingData.quantity}{" "}
                            {experience.priceUnit === "PER_PERSON"
                              ? "person(s)"
                              : "qty"}
                            {experience.priceUnit === "PER_HOUR"
                              ? ` x ${bookingData.durationHours} hr(s)`
                              : ""}
                          </span>
                          <span>{formatPrice(summary.totalAmount)}</span>
                        </div>

                        <div className="divider my-2"></div>

                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatPrice(summary.finalAmount)}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-base-200/50 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs opacity-60 font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} /> Secure Transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        experienceId={parseInt(experienceId)}
        onSuccess={(newReview) => {
          setReviews((prev) => [newReview, ...prev]);
          fetchData();
        }}
      />
    </div>
  );
};

export default ExperienceDetailPage;
