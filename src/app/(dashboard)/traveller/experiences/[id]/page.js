"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExperienceById } from "@/hooks/ExperienceApi";
import { getReviewsByExperience, getReviewSummary } from "@/hooks/ReviewApi";
import BookingForm from "@/components/experience/BookingForm";
import ReviewCard from "@/components/experience/ReviewCard";
import ReviewModal from "@/components/experience/ReviewModal";
import StarRating from "@/components/experience/StarRating";
import CategoryBadge from "@/components/experience/CategoryBadge";
import { normalizePrice } from "@/function/normalize";
import {
  MapPin,
  Users,
  Loader2,
  ArrowLeft,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";

const ExperienceDetailPage = () => {
  const params = useParams();
  const experienceId = params.id;

  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (experienceId) {
      fetchData();
    }
  }, [experienceId]);

  const fetchData = async () => {
    try {
      const [expData, reviewData, summaryData] = await Promise.all([
        getExperienceById(experienceId),
        getReviewsByExperience(experienceId),
        getReviewSummary(experienceId),
      ]);
      if (expData?.experienceId) setExperience(expData);
      if (Array.isArray(reviewData)) setReviews(reviewData);
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      console.error("Failed to fetch experience details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Experience not found</h2>
        <Link href="/traveller/experiences" className="btn btn-primary mt-4">
          Back to Experiences
        </Link>
      </div>
    );
  }

  const typeLabel = experience.type
    ? experience.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/traveller/experiences"
        className="btn btn-ghost btn-sm gap-1"
      >
        <ArrowLeft size={16} /> Back to Experiences
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-base-200 h-64 md:h-80">
            {experience.imageUrl ? (
              <img
                src={experience.imageUrl}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-base-content/20">
                <MapPin size={64} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{experience.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <CategoryBadge category={experience.category} />
                  <span className="badge badge-outline badge-sm">
                    {typeLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {normalizePrice(experience.pricePerUnit)}
                </p>
                <p className="text-xs text-base-content/50">
                  /{experience.priceUnit?.replace("PER_", "").toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-base-content/60">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {experience.location}
              </span>
              {experience.maxCapacity > 0 && (
                <span className="flex items-center gap-1">
                  <Users size={14} /> Max {experience.maxCapacity} people
                </span>
              )}
            </div>

            {summary && (
              <div className="flex items-center gap-2">
                <StarRating
                  rating={Math.round(summary.averageRating)}
                  size={16}
                />
                <span className="text-sm text-base-content/60">
                  {summary.averageRating?.toFixed(1)} ({summary.totalReviews}{" "}
                  review{summary.totalReviews !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <div className="divider"></div>

            <div>
              <h3 className="font-semibold mb-2">About this experience</h3>
              <p className="text-sm text-base-content/70 whitespace-pre-line">
                {experience.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Reviews section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Reviews ({reviews.length})
              </h3>
              <button
                className="btn btn-primary btn-sm gap-1"
                onClick={() => setShowReviewModal(true)}
              >
                <MessageSquarePlus size={14} /> Write Review
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.reviewId} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-base-content/50 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Booking form */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-md border border-base-200 sticky top-20">
            <div className="card-body">
              <h3 className="card-title text-base">Book this experience</h3>
              {bookingSuccess ? (
                <div className="alert alert-success">
                  <span>Booking request sent! The provider will respond soon.</span>
                </div>
              ) : experience.available ? (
                <BookingForm
                  experience={experience}
                  onSuccess={() => setBookingSuccess(true)}
                />
              ) : (
                <div className="alert alert-warning">
                  <span>This experience is currently unavailable.</span>
                </div>
              )}
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
