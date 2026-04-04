"use client";
import UseFetch from "@/hooks/UseFetch";


// ============ BOOKING OPERATIONS ============


export const createBooking = async (data) => {
  return await UseFetch("POST", "/experience/booking/request", data);
};

export const providerBookingAction = async (bookingId, data) => {
  return await UseFetch("PATCH", `/experience/booking/${bookingId}/action`, data);
};

export const cancelBooking = async (bookingId) => {
  return await UseFetch("PATCH", `/experience/booking/${bookingId}/cancel`);
};

export const getBookingById = async (bookingId) => {
  return await UseFetch("GET", `/experience/booking/${bookingId}`);
};

export const getMyBookings = async () => {
  return await UseFetch("GET", "/experience/booking/my-bookings");
};

export const getProviderBookings = async () => {
  return await UseFetch("GET", "/experience/booking/provider/all");
};

export const getProviderPendingBookings = async () => {
  return await UseFetch("GET", "/experience/booking/provider/pending");
};
