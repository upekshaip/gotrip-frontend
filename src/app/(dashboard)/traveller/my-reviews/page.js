"use client";
import React, { useEffect, useState } from "react";
import { getMyReviews, deleteReview } from "@/hooks/ReviewApi";
import ReviewCard from "@/components/experience/ReviewCard";
import ReviewModal from "@/components/experience/ReviewModal";
import { Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getMyReviews();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

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
        <Star size={28} className="text-warning" />
        <div>
          <h1 className="text-2xl font-bold">My Reviews</h1>
          <p className="text-sm text-base-content/60">
            Manage your experience reviews
          </p>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-base-content/50">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
      </p>

      {/* Reviews grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Star size={48} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium">No reviews yet</h3>
          <p className="text-sm text-base-content/50 mt-1">
            Book an experience and share your feedback!
          </p>
        </div>
      )}

      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingReview(null);
        }}
        experienceId={editingReview?.experienceId}
        existingReview={editingReview}
        onSuccess={(updated) => {
          setReviews((prev) =>
            prev.map((r) => (r.reviewId === updated.reviewId ? updated : r))
          );
        }}
      />
    </div>
  );
};

export default MyReviewsPage;
