"use client";
import React from "react";
import StarRating from "./StarRating";
import { normalizeSriLankaTime } from "@/function/normalize";
import { Trash2, Pencil } from "lucide-react";

const ReviewCard = ({ review, onEdit = null, onDelete = null, showActions = false }) => {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4 gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                <span className="text-xs">T{review.travellerId}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Traveller #{review.travellerId}</p>
              <p className="text-xs text-base-content/50">
                {normalizeSriLankaTime(review.createdAt)}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size={14} />
        </div>

        {review.experienceTitle && (
          <p className="text-xs text-base-content/60 font-medium">
            {review.experienceTitle}
          </p>
        )}

        {review.comment && (
          <p className="text-sm text-base-content/80 mt-1">{review.comment}</p>
        )}

        {showActions && (
          <div className="card-actions justify-end mt-1">
            {onEdit && (
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => onEdit(review)}
              >
                <Pencil size={12} /> Edit
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={() => onDelete(review.reviewId)}
              >
                <Trash2 size={12} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
