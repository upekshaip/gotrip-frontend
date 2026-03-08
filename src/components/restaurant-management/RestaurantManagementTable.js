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

const RestaurantManagementTable = () => {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const observer = useRef();

  const fetchRestaurants = async (isFirstLoad = false, nextPage = 0) => {
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
        `/restaurant-service/my?${params.toString()}`,
      );
      if (data && !data.timestamp) {
        const newRestaurants = data.content || [];

        setRestaurants((prev) => {
          if (isFirstLoad) return newRestaurants;
          const existingIds = new Set(prev.map((r) => r.restaurantId));
          const uniqueNewContent = newRestaurants.filter(
            (r) => !existingIds.has(r.restaurantId),
          );
          return [...prev, ...uniqueNewContent];
        });

        if (data.page) {
          setHasMore(data.page.number < data.page.totalPages - 1);
        } else {
          setHasMore(false);
        }
      } else {
        toast.error("Failed to fetch restaurant data.");
      }
    } catch (error) {
      toast.error("Error connecting to restaurant service.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) return;

    setIsDeleting(true);
    try {
      const res = await UseFetch(
        "DELETE",
        `/restaurant-service/${restaurantToDelete.restaurantId}`,
      );

      if (res && !res.timestamp) {
        toast.success(`${restaurantToDelete.name} has been removed.`);
        setRestaurants((prev) =>
          prev.filter((r) => r.restaurantId !== restaurantToDelete.restaurantId),
        );
        setRestaurantToDelete(null);
      } else {
        toast.error(
          "Failed to delete the restaurant. It might have active bookings.",
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
    setRestaurants([]);
    setPage(0);
    setHasMore(true);
    fetchRestaurants(true);
  }, [status]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchRestaurants(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchRestaurants],
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
                router.push(routes.serviceProvider.createRestaurant.url)
              }
            >
              Add New Restaurant
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Restaurant</th>
                <th>Location</th>
                <th>Price Details</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant, index) => (
                <tr key={`${restaurant.restaurantId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          <img src={restaurant.imageUrl} alt={restaurant.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {restaurant.name}
                          {restaurant.featured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-50 truncate max-w-[200px]">
                          {restaurant.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{restaurant.city}</span>
                      <span className="opacity-60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {restaurant.address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">
                        LKR {restaurant.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase opacity-50">
                        {restaurant.priceUnit.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-medium",
                        restaurant.status === "ACTIVE"
                          ? "badge-success"
                          : restaurant.status === "PENDING"
                            ? "badge-warning"
                            : "badge-ghost",
                      )}
                    >
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(restaurant.updatedAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          router.push(
                            routes.serviceProvider.editRestaurant.url.replace(
                              ":restaurantId",
                              restaurant.restaurantId,
                            ),
                          )
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => setRestaurantToDelete(restaurant)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sentinel */}
          <div
            ref={lastElementRef}
            className="py-12 flex flex-col items-center justify-center min-h-[100px]"
          >
            {loading ? (
              <span className="loading loading-dots loading-md text-primary"></span>
            ) : (
              !hasMore &&
              restaurants.length > 0 && (
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

      {/* Confirmation Modal */}
      <div className={clsx("modal", restaurantToDelete && "modal-open")}>
        <div className="modal-box">
          <div className="flex items-center gap-3 text-error mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Confirm Deletion</h3>
          </div>
          <p className="py-4 text-xs">
            Are you sure you want to delete{" "}
            <span className="font-bold">{restaurantToDelete?.name}</span>? This
            action cannot be undone and will remove the restaurant from the platform.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setRestaurantToDelete(null)}
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
        <div
          className="modal-backdrop"
          onClick={() => !isDeleting && setRestaurantToDelete(null)}
        ></div>
      </div>
    </section>
  );
};

export default RestaurantManagementTable;
