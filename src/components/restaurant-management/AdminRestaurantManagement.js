/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Coffee, MapPin, Settings2, Activity } from "lucide-react";
import clsx from "clsx";
import { RestaurantStatusChangeModel } from "./RestaurantStatusChangeModel";
import { EditRestaurantModelForAdmin } from "./EditRestaurantModelForAdmin";

const AdminRestaurantManagement = () => {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editRestaurant, setEditRestaurant] = useState(null);
  const [statusRestaurant, setStatusRestaurant] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const observer = useRef();

  const fetchRestaurants = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    try {
      const data = await UseFetch(
        "GET",
        `/restaurant-service/admin/all?page=${currentPage}&limit=10`,
      );
      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setRestaurants((prev) =>
          isFirstLoad ? newContent : [...prev, ...newContent],
        );
        if (data.page) setHasMore(data.page.number < data.page.totalPages - 1);
      }
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(true);
  }, []);

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
    [loading, hasMore, page],
  );

  const handleOpenEdit = (restaurant) => {
    setEditRestaurant({
      ...restaurant,
      latitude: restaurant.latitude || 0,
      longitude: restaurant.longitude || 0,
    });
  };

  const handleOpenStatus = (restaurant) => {
    setStatusRestaurant(restaurant);
  };

  const executeUpdate = async (type, data) => {
    setIsUpdating(true);
    try {
      const method = "PUT";
      const url =
        type === "INFO"
          ? `/restaurant-service/admin/${data.restaurantId}`
          : `/restaurant-service/admin/status/${data.restaurantId}`;
      const payload =
        type === "INFO"
          ? {
              name: data.name,
              description: data.description,
              address: data.address,
              city: data.city,
              price: data.price,
              discount: data.discount,
              priceUnit: data.priceUnit,
              latitude: data.latitude,
              longitude: data.longitude,
              imageUrl: data.imageUrl,
              featured: data.featured,
            }
          : { status: data.status };

      const res = await UseFetch(method, url, payload);
      if (res && !res.timestamp && !res.error) {
        toast.success("Updated successfully.");
        setRestaurants((prev) =>
          prev.map((r) =>
            r.restaurantId === data.restaurantId ? { ...r, ...payload } : r,
          ),
        );
        setEditRestaurant(null);
        setStatusRestaurant(null);
      }
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="section-container">
      <div className="flex flex-col">
        <div className="p-4 bg-base-100 border-b border-base-200">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Coffee className="text-primary" /> Restaurant Management
          </h1>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Restaurant</th>
                <th>Pricing</th>
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
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img
                          src={restaurant.imageUrl}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          {restaurant.name}{" "}
                          {restaurant.featured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">
                          <MapPin size={10} /> {restaurant.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-mono font-bold">
                    LKR {restaurant.price.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-bold",
                        restaurant.status === "ACTIVE"
                          ? "badge-success"
                          : restaurant.status === "PENDING"
                            ? "badge-warning"
                            : restaurant.status === "INACTIVE"
                              ? "badge-error"
                              : "badge-neutral",
                      )}
                    >
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(restaurant.updatedAt)}
                  </td>
                  <td className="text-right">
                    {restaurant.status !== "REMOVED" && (
                      <button
                        className="btn btn-ghost btn-xs text-secondary"
                        onClick={() => handleOpenStatus(restaurant)}
                      >
                        <Activity size={16} />
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-xs text-primary"
                      onClick={() => handleOpenEdit(restaurant)}
                    >
                      <Settings2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={lastElementRef} className="py-10 flex justify-center">
            {loading && (
              <span className="loading loading-dots text-primary"></span>
            )}
          </div>
        </div>
      </div>

      <EditRestaurantModelForAdmin
        isOpen={!!editRestaurant}
        restaurant={editRestaurant}
        onClose={() => setEditRestaurant(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger ? executeUpdate("INFO", data) : setEditRestaurant(data)
        }
      />

      <RestaurantStatusChangeModel
        isOpen={!!statusRestaurant}
        restaurant={statusRestaurant}
        onClose={() => setStatusRestaurant(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger ? executeUpdate("STATUS", data) : setStatusRestaurant(data)
        }
      />
    </section>
  );
};

export default AdminRestaurantManagement;
