"use client";
import UseFetch from "@/hooks/UseFetch";

// ============ REVIEW OPERATIONS ============

export const createReview = async (data) => {
  return await UseFetch("POST", "/experience/review", data);
};

export const updateReview = async (reviewId, data) => {
  return await UseFetch("PUT", `/experience/review/${reviewId}`, data);
};

export const deleteReview = async (reviewId) => {
  return await UseFetch("DELETE", `/experience/review/${reviewId}`);
};

export const getReviewsByExperience = async (experienceId) => {
  return await UseFetch("GET", `/experience/review/experience/${experienceId}`);
};

export const getMyReviews = async () => {
  return await UseFetch("GET", "/experience/review/my-reviews");
};

export const getReviewSummary = async (experienceId) => {
  return await UseFetch("GET", `/experience/review/summary/${experienceId}`);
};
