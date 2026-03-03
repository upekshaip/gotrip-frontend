"use client";
import React, { useEffect, useState } from "react";
import { getMyListings } from "@/hooks/ExperienceApi";
import { getReviewsByExperience, getReviewSummary } from "@/hooks/ReviewApi";
import ReviewCard from "@/components/experience/ReviewCard";
import StarRating from "@/components/experience/StarRating";
import { Star, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const SPReviewsPage = () => {
  const [listings, setListings] = useState([]);
  const [reviewsMap, setReviewsMap] = useState({});
  const [summaryMap, setSummaryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMyListings();
      if (Array.isArray(data)) {
        setListings(data);
        // Fetch summaries for all listings
        const summaries = {};
        await Promise.all(
          data.map(async (exp) => {
            try {
              const s = await getReviewSummary(exp.experienceId);
              summaries[exp.experienceId] = s;
            } catch {
              summaries[exp.experienceId] = {
                averageRating: 0,
                totalReviews: 0,
              };
            }
          })
        );
        setSummaryMap(summaries);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (experienceId) => {
    if (expandedId === experienceId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(experienceId);
    // Fetch reviews if not already loaded
    if (!reviewsMap[experienceId]) {
      try {
        const reviews = await getReviewsByExperience(experienceId);
        setReviewsMap((prev) => ({
          ...prev,
          [experienceId]: Array.isArray(reviews) ? reviews : [],
        }));
      } catch {
        setReviewsMap((prev) => ({ ...prev, [experienceId]: [] }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // Calculate overall stats
  const totalReviews = Object.values(summaryMap).reduce(
    (sum, s) => sum + (s?.totalReviews || 0),
    0
  );
  const avgRating =
    totalReviews > 0
      ? Object.values(summaryMap).reduce(
          (sum, s) => sum + (s?.averageRating || 0) * (s?.totalReviews || 0),
          0
        ) / totalReviews
      : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Star size={28} className="text-warning" />
        <div>
          <h1 className="text-2xl font-bold">Reviews Dashboard</h1>
          <p className="text-sm text-base-content/60">
            See what travellers say about your experiences
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow bg-base-100 border border-base-200">
        <div className="stat">
          <div className="stat-title">Total Reviews</div>
          <div className="stat-value text-warning">{totalReviews}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Average Rating</div>
          <div className="stat-value text-warning flex items-center gap-2">
            {avgRating.toFixed(1)}
            <StarRating rating={Math.round(avgRating)} size={18} />
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Experiences</div>
          <div className="stat-value">{listings.length}</div>
        </div>
      </div>

      {/* Experience-wise reviews */}
      <div className="space-y-3">
        {listings.map((exp) => {
          const s = summaryMap[exp.experienceId];
          const isExpanded = expandedId === exp.experienceId;
          const reviews = reviewsMap[exp.experienceId] || [];

          return (
            <div
              key={exp.experienceId}
              className="collapse collapse-arrow bg-base-100 shadow-sm border border-base-200"
            >
              <input
                type="checkbox"
                checked={isExpanded}
                onChange={() => toggleExpand(exp.experienceId)}
              />
              <div className="collapse-title">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-xs text-base-content/50">
                      {exp.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <StarRating
                      rating={Math.round(s?.averageRating || 0)}
                      size={14}
                    />
                    <span className="text-sm text-base-content/60">
                      {s?.averageRating?.toFixed(1) || "0.0"} (
                      {s?.totalReviews || 0})
                    </span>
                  </div>
                </div>
              </div>
              <div className="collapse-content">
                {isExpanded && (
                  <div className="space-y-3 pt-2">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <ReviewCard key={review.reviewId} review={review} />
                      ))
                    ) : (
                      <p className="text-sm text-base-content/50 text-center py-4">
                        No reviews for this experience yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-16">
          <Star size={48} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium">No experiences yet</h3>
          <p className="text-sm text-base-content/50 mt-1">
            Create experiences to start receiving reviews
          </p>
        </div>
      )}
    </div>
  );
};

export default SPReviewsPage;
