"use client";
import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { createReview, updateReview } from "@/hooks/ReviewApi";
import toast from "react-hot-toast";

const ReviewModal = ({
  isOpen,
  onClose,
  experienceId,
  existingReview = null,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
  }, [existingReview, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (existingReview) {
        result = await updateReview(existingReview.reviewId, {
          experienceId,
          rating,
          comment,
        });
      } else {
        result = await createReview({ experienceId, rating, comment });
      }

      if (result?.reviewId) {
        toast.success(
          existingReview ? "Review updated!" : "Review submitted!"
        );
        onSuccess && onSuccess(result);
        onClose();
      } else {
        toast.error(result?.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {existingReview ? "Edit Review" : "Write a Review"}
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Rating</span>
            </label>
            <StarRating rating={rating} onRate={setRating} size={24} />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Comment (optional)</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/50">
                {comment.length}/1000
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : existingReview ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ReviewModal;
