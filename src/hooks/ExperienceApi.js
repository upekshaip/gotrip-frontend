"use client";
import UseFetch from "@/hooks/UseFetch";

// ============ EXPERIENCE CRUD ============

export const createExperience = async (data) => {
  return await UseFetch("POST", "/experience/create", data);
};

export const updateExperience = async (id, data) => {
  return await UseFetch("PATCH", `/experience/update/${id}`, data);
};

export const deleteExperience = async (id) => {
  return await UseFetch("DELETE", `/experience/delete/${id}`);
};

export const getExperienceById = async (id) => {
  return await UseFetch("GET", `/experience/${id}`);
};

export const getAllExperiences = async () => {
  return await UseFetch("GET", "/experience/all");
};

export const getAvailableExperiences = async () => {
  return await UseFetch("GET", "/experience/available");
};

export const getExperiencesByCategory = async (category) => {
  return await UseFetch("GET", `/experience/category/${category}`);
};

export const getExperiencesByLocation = async (location) => {
  return await UseFetch("GET", `/experience/location/${location}`);
};

export const getMyListings = async () => {
  return await UseFetch("GET", "/experience/my-listings");
};
