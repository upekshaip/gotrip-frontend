/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { Edit, MapPin, Trash2, AlertTriangle } from "lucide-react";
import clsx from "clsx";

const CameraManagementTable = () => {
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1); // 🔹 Starts at 0
  const [hasMore, setHasMore] = useState(true);

  // 🔹 State for Deletion
  const [cameraToDelete, setCameraToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const observer = useRef();

  const fetchCameras = async (isFirstLoad = false, nextPage = 0) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");
    if (status) params.append("status", status);

    try {
      const data = await UseFetch(
        "GET",
        `/camera-service/my?${params.toString()}`,
      );
      if (data && !data.timestamp) {
        const newCameras = data.content || [];

        setCameras((prev) => {
          if (isFirstLoad) return newCameras;
          // Filter duplicates for safety
          const existingIds = new Set(prev.map((h) => h.cameraId));
          const uniqueNewContent = newCameras.filter(
            (h) => !existingIds.has(h.cameraId),
          );
          return [...prev, ...uniqueNewContent];
        });

        // 🔹 Calculate hasMore using the nested page object
        if (data.page) {
          setHasMore(data.page.number < data.page.totalPages - 1);
        } else {
          setHasMore(false);
        }
      } else {
        toast.error("Failed to fetch camera data.");
      }
    } catch (error) {
      toast.error("Error connecting to camera service.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Logic using /camera-service/{id}
  const confirmDelete = async () => {
    if (!cameraToDelete) return;

    setIsDeleting(true);
    try {
      const res = await UseFetch(
        "DELETE",
        `/camera-service/${cameraToDelete.cameraId}`,
      );

      // Checking if response is successful (assuming your backend returns 200/204 or the deleted object)
      if (res && !res.timestamp) {
        toast.success(`${cameraToDelete.name} has been removed.`);

        // Remove from local state immediately for a fast UX
        setCameras((prev) =>
          prev.filter((h) => h.cameraId !== cameraToDelete.cameraId),
        );

        // Close the modal
        setCameraToDelete(null);
      } else {
        toast.error(
          "Failed to delete the camera. It might have active bookings.",
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
    setCameras([]);
    setPage(0); // 🔹 Reset to 0
    setHasMore(true);
    fetchCameras(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchCameras(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchCameras],
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
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                router.push(routes.serviceProvider.createCamera.url)
              }
            >
              Add New Camera
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Camera</th>
                <th>Location</th>
                <th>Price Details</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((camera, index) => (
                <tr key={`${camera.cameraId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          <img src={camera.imageUrl} alt={camera.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {camera.name}
                          {camera.featured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">
                          {camera.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{camera.city}</span>
                      <span className="opacity-60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {camera.address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">
                        LKR {camera.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase opacity-50">
                        {camera.priceUnit.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-medium",
                        camera.status === "ACTIVE"
                          ? "badge-success"
                          : camera.status === "PENDING"
                            ? "badge-warning"
                            : "badge-ghost",
                      )}
                    >
                      {camera.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(camera.updatedAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          router.push(
                            routes.serviceProvider.editCamera.url.replace(
                              ":cameraId",
                              camera.cameraId,
                            ),
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => setCameraToDelete(camera)} // Open Modal
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
              cameras.length > 0 && (
                <div className="flex flex-col items-center opacity-20 mt-4">
                  <div className="h-px w-20 bg-base-content mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Fin.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 🔹 DAISYUI CONFIRMATION MODAL */}
      <div className={clsx("modal", cameraToDelete && "modal-open")}>
        <div className="modal-box">
          <div className="flex items-center gap-3 text-error mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Confirm Deletion</h3>
          </div>
          <p className="py-4 text-xs">
            Are you sure you want to delete{" "}
            <span className="font-bold">{cameraToDelete?.name}</span>? This
            action cannot be undone and will remove the camera from the platform.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCameraToDelete(null)}
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
          onClick={() => !isDeleting && setCameraToDelete(null)}
        ></div>
      </div>
    </section>
  );
};

export default CameraManagementTable;
