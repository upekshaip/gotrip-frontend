"use client";
import UseFetch from "@/hooks/UseFetch";

// ============ ADMIN DASHBOARD STATS ============

export const getAdminTravellers = async (page = 1, limit = 1) => {
  return await UseFetch("GET", `/user/admin/all-travellers?page=${page}&limit=${limit}`);
};

export const getAdminProviders = async (page = 1, limit = 1) => {
  return await UseFetch("GET", `/user/admin/all-providers?page=${page}&limit=${limit}`);
};

export const getAdminAllHotels = async (page = 1, limit = 1) => {
  return await UseFetch("GET", `/hotel-service/admin/all?page=${page}&limit=${limit}`);
};

export const getAdminPendingHotels = async (page = 1, limit = 1) => {
  return await UseFetch("GET", `/hotel-service/admin/pending?page=${page}&limit=${limit}`);
};

export const getExperienceAdminStats = async () => {
  return await UseFetch("GET", "/experience/admin/stats");
};

export const getTransportAdminStats = async () => {
  return await UseFetch("GET", "/transport-service/admin/stats");
};
