"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { Edit, MapPin, Trash2, AlertTriangle } from "lucide-react";
import clsx from "clsx";

const HotelManagementTable = () => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 State for Deletion
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const observer = useRef();

  const fetchHotels = async (isFirstLoad = false, nextPage = 1) => {
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
        `/hotel-service/my?${params.toString()}`,
      );
      if (data && !data.timestamp) {
        const newHotels = data.content || [];
        setHotels((prev) =>
          isFirstLoad ? newHotels : [...prev, ...newHotels],
        );
        setHasMore(!data.last);
      } else {
        toast.error("Failed to fetch hotel data.");
      }
    } catch (error) {
      toast.error("Error connecting to hotel service.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Logic
  // 🔹 Delete Logic using /hotel-service/{id}
  const confirmDelete = async () => {
    if (!hotelToDelete) return;

    setIsDeleting(true);
    try {
      // Corrected endpoint path: /hotel-service/{id}
      const res = await UseFetch(
        "DELETE",
        `/hotel-service/${hotelToDelete.hotelId}`,
      );

      // Checking if response is successful (assuming your backend returns 200/204 or the deleted object)
      if (res && !res.timestamp) {
        toast.success(`${hotelToDelete.name} has been removed.`);

        // Remove from local state immediately for a fast UX
        setHotels((prev) =>
          prev.filter((h) => h.hotelId !== hotelToDelete.hotelId),
        );

        // Close the modal
        setHotelToDelete(null);
      } else {
        toast.error(
          "Failed to delete the hotel. It might have active bookings.",
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
    setHotels([]);
    setPage(1);
    setHasMore(true);
    fetchHotels(true);
  }, [status]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchHotels(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page],
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
                router.push(routes.serviceProvider.createHotel.url)
              }
            >
              Add New Hotel
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Hotel</th>
                <th>Location</th>
                <th>Price Details</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, index) => (
                <tr key={`${hotel.hotelId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          {/* <img
                            src={hotel.imageUrl || "/hotel-placeholder.png"}
                            alt={hotel.name}
                          /> */}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {hotel.name}
                          {hotel.featured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">
                          {hotel.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{hotel.city}</span>
                      <span className="opacity-60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {hotel.address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">
                        LKR {hotel.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase opacity-50">
                        {hotel.priceUnit.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-medium",
                        hotel.status === "ACTIVE"
                          ? "badge-success"
                          : hotel.status === "PENDING"
                            ? "badge-warning"
                            : "badge-ghost",
                      )}
                    >
                      {hotel.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(hotel.updatedAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          router.push(
                            routes.serviceProvider.editHotel.url.replace(
                              ":hotelId",
                              hotel.hotelId,
                            ),
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => setHotelToDelete(hotel)} // Open Modal
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            ref={lastElementRef}
            className="h-20 flex justify-center items-center"
          >
            {loading && (
              <span className="loading loading-dots loading-md text-primary"></span>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 DAISYUI CONFIRMATION MODAL */}
      <div className={clsx("modal", hotelToDelete && "modal-open")}>
        <div className="modal-box">
          <div className="flex items-center gap-3 text-error mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Confirm Deletion</h3>
          </div>
          <p className="py-4 text-xs">
            Are you sure you want to delete{" "}
            <span className="font-bold">{hotelToDelete?.name}</span>? This
            action cannot be undone and will remove the hotel from the platform.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setHotelToDelete(null)}
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
          onClick={() => !isDeleting && setHotelToDelete(null)}
        ></div>
      </div>
    </section>
  );
};

export default HotelManagementTable;
