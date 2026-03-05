/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import UseFetch from "@/hooks/UseFetch";
import { normalizePrice, normalizeSriLankaTime } from "@/function/normalize";
import CategoryBadge from "@/components/experience/CategoryBadge";
import { useRouter } from "next/navigation";
import { Edit, MapPin, Trash2, AlertTriangle, Compass } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const SPExperiencesPage = () => {
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [availability, setAvailability] = useState(""); // "", "true", or "false"
  const [page, setPage] = useState(1); // 🔹 Starts at 0
  const [hasMore, setHasMore] = useState(true);

  // 🔹 State for Deletion
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const observer = useRef();

  const fetchExperiences = async (isFirstLoad = false, nextPage = 0) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");

    // Pass availability boolean if a specific filter is selected
    if (availability !== "") {
      params.append("available", availability);
    }

    try {
      // Adjusted to standard REST pattern based on your hotel example.
      // Update this endpoint path if your backend uses a different route!
      const data = await UseFetch(
        "GET",
        `/experience/my-listings?${params.toString()}`,
      );

      if (data && !data.timestamp) {
        const newExperiences = data.content || [];

        setExperiences((prev) => {
          if (isFirstLoad) return newExperiences;
          // Filter duplicates for safety
          const existingIds = new Set(prev.map((e) => e.experienceId));
          const uniqueNewContent = newExperiences.filter(
            (e) => !existingIds.has(e.experienceId),
          );
          return [...prev, ...uniqueNewContent];
        });

        // 🔹 Calculate hasMore using the top-level 'last' boolean from your JSON
        setHasMore(!data.last);
      } else {
        toast.error("Failed to fetch experiences data.");
      }
    } catch (error) {
      toast.error("Error connecting to experience service.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Logic
  const confirmDelete = async () => {
    if (!expToDelete) return;

    setIsDeleting(true);
    try {
      const res = await UseFetch(
        "DELETE",
        `/experience/delete/${expToDelete.experienceId}`,
      );

      // Checking if response is successful
      if (res && !res.timestamp && !res.error) {
        toast.success(`${expToDelete.title} has been removed.`);

        // Remove from local state immediately for a fast UX
        setExperiences((prev) =>
          prev.filter((e) => e.experienceId !== expToDelete.experienceId),
        );

        // Close the modal
        setExpToDelete(null);
      } else {
        toast.error(
          "Failed to delete the experience. It might have active bookings.",
        );
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("An unexpected error occurred during deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setExperiences([]);
    setPage(1); // 🔹 Reset to 1
    setHasMore(true);
    fetchExperiences(true);
  }, [availability]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchExperiences(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchExperiences],
  );

  return (
    <section className="section-container">
      <div className="flex flex-col">
        {/* Filter Section */}
        <div className="sticky top-0 p-4 bg-base-100 border-b border-base-200 z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <select
                className="select select-sm select-bordered"
                onChange={(e) => setAvailability(e.target.value)}
                value={availability}
              >
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                router.push("/service-provider/experiences/create")
              }
            >
              Add New Experience
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Experience</th>
                <th>Location</th>
                <th>Price Details</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, index) => (
                <tr key={`${exp.experienceId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200 flex items-center justify-center">
                          {exp.imageUrl ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.title}
                              className="object-cover"
                            />
                          ) : (
                            <Compass className="w-6 h-6 opacity-30" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {exp.title}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px] flex items-center gap-2 mt-1">
                          <CategoryBadge category={exp.category} />
                          {exp.type?.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{exp.location}</span>
                      {exp.maxCapacity > 0 && (
                        <span className="opacity-60 flex items-center gap-1 mt-1">
                          Max {exp.maxCapacity} persons
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">
                        {normalizePrice(exp.pricePerUnit)}
                      </span>
                      <span className="text-[10px] uppercase opacity-50">
                        {exp.priceUnit?.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-medium",
                        exp.available ? "badge-success" : "badge-error",
                      )}
                    >
                      {exp.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="text-xs">
                    {exp.updatedAt
                      ? normalizeSriLankaTime(exp.updatedAt)
                      : "N/A"}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          router.push(
                            `/service-provider/experiences/edit/${exp.experienceId}`,
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => setExpToDelete(exp)} // Open Modal
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Sentinel with "Fin." logic */}
          <div
            ref={lastElementRef}
            className="py-12 flex flex-col items-center justify-center min-h-[100px]"
          >
            {loading ? (
              <span className="loading loading-dots loading-md text-primary"></span>
            ) : (
              !hasMore &&
              experiences.length > 0 && (
                <div className="flex flex-col items-center opacity-20 mt-4">
                  <div className="h-px w-20 bg-base-content mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Fin.
                  </p>
                </div>
              )
            )}
            {!loading && experiences.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                <Compass size={32} className="mb-2" />
                <p className="font-medium">No experiences found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 DAISYUI CONFIRMATION MODAL */}
      <div className={clsx("modal", expToDelete && "modal-open")}>
        <div className="modal-box">
          <div className="flex items-center gap-3 text-error mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Confirm Deletion</h3>
          </div>
          <p className="py-4 text-xs">
            Are you sure you want to delete{" "}
            <span className="font-bold">{expToDelete?.title}</span>? This action
            cannot be undone and will remove the experience from the platform.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setExpToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className={clsx("btn btn-sm btn-error", isDeleting && "loading")}
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting.." : "Yes, Delete"}
            </button>
          </div>
        </div>
        {/* Click outside to close */}
        <div
          className="modal-backdrop"
          onClick={() => !isDeleting && setExpToDelete(null)}
        ></div>
      </div>
    </section>
  );
};

export default SPExperiencesPage;
