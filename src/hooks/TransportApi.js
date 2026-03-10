"use client";
import UseFetch from "@/hooks/UseFetch";

// ============ TRANSPORT VEHICLE CRUD ============

export const createTransport = async (data) => {
  return await UseFetch("POST", "/transport-service", data);
};

export const getAllTransports = async () => {
  return await UseFetch("GET", "/transport-service");
};

export const getTransportById = async (id) => {
  return await UseFetch("GET", `/transport-service/${id}`);
};

export const searchTransportsByCity = async (city) => {
  return await UseFetch("GET", `/transport-service/search?city=${city}`);
};

export const updateTransport = async (id, data) => {
  return await UseFetch("PUT", `/transport-service/${id}`, data);
};

export const deleteTransport = async (id) => {
  return await UseFetch("DELETE", `/transport-service/${id}`);
};

// ============ BOOKING ACTIONS ============

export const createTransportBooking = async (data) => {
  return await UseFetch("POST", "/transport-service/bookings/request", data);
};

export const getMyTransportBookings = async () => {
  // For the Traveler to see their history
  return await UseFetch("GET", "/transport-service/bookings/my-bookings");
};

export const getIncomingTransportRequests = async () => {
  // For the Provider to see pending requests
  return await UseFetch("GET", "/transport-service/bookings/provider-requests");
};

export const respondToBooking = async (id, status, message) => {
  // status: ACCEPTED or DECLINED
  return await UseFetch("PATCH", `/transport-service/bookings/${id}/respond?status=${status}&message=${message}`);
};

export const markBookingCompleted = async (id) => {
  return await UseFetch("PATCH", `/transport-service/bookings/${id}/complete`);
};
export const cancelTransportBooking = async (id) => {
  return await UseFetch("PATCH", `/transport-service/bookings/${id}/cancel`);
};

// ============ REVIEWS ============

export const createTransportReview = async (data) => {
  return await UseFetch("POST", "/transport-service/reviews", data);
};

export const getVehicleReviews = async (transportId) => {
  return await UseFetch("GET", `/transport-service/reviews/vehicle/${transportId}`);
};