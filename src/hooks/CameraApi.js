"use client";
import UseFetch from "@/hooks/UseFetch";

// ============ CAMERA BOOKING OPERATIONS ============

// Aluth camera booking ekak create kirima
export const createCameraBooking = async (data) => {
  // Backend eke endpoint eka: /camera-service/api/v1/bookings/request
  return await UseFetch("POST", "/camera-service/api/v1/bookings/request", data);
};

// Provider visin booking eka accept/reject kirima (Action)
export const providerCameraBookingAction = async (bookingId, data) => {
  return await UseFetch("PATCH", `/camera-service/api/v1/bookings/${bookingId}/action`, data);
};

// Booking eka cancel kirima
export const cancelCameraBooking = async (bookingId) => {
  return await UseFetch("PATCH", `/camera-service/api/v1/bookings/${bookingId}/cancel`);
};

// Ekama eka booking ekaka details ganna
export const getCameraBookingById = async (bookingId) => {
  return await UseFetch("GET", `/camera-service/api/v1/bookings/${bookingId}`);
};

// Log wela inna user ge camera bookings tika ganna
export const getMyCameraBookings = async () => {
  return await UseFetch("GET", "/camera-service/api/v1/bookings/my-bookings");
};

// Camera owner (Provider) ge okkoma bookings ganna
export const getProviderCameraBookings = async () => {
  return await UseFetch("GET", "/camera-service/api/v1/bookings/provider/all");
};

// Provider ge pending wela thiyena bookings witarak ganna
export const getProviderPendingCameraBookings = async () => {
  return await UseFetch("GET", "/camera-service/api/v1/bookings/provider/pending");
};