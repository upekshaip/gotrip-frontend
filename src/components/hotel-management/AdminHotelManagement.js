/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Building2, MapPin, Settings2, Activity } from "lucide-react";
import clsx from "clsx";
import { HotelStatusChnageModel } from "./HotelStatusChnageModel";
import { EditHotelModelForAdmin } from "./EditHotelModelForAdmin";

const AdminHotelManagement = () => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editHotel, setEditHotel] = useState(null);
  const [statusHotel, setStatusHotel] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const observer = useRef();

  const fetchHotels = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    try {
      const data = await UseFetch(
        "GET",
        `/hotel-service/admin/all?page=${currentPage}&limit=10`,
      );
      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setHotels((prev) =>
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
    fetchHotels(true);
  }, []);

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

  const handleOpenEdit = (hotel) => {
    setEditHotel({
      ...hotel,
      latitude: hotel.latitude || 0,
      longitude: hotel.longitude || 0,
    });
  };

  const handleOpenStatus = (hotel) => {
    setStatusHotel(hotel);
  };

  const executeUpdate = async (type, data) => {
    setIsUpdating(true);
    try {
      const method = "PUT";
      const url =
        type === "INFO"
          ? `/hotel-service/admin/${data.hotelId}`
          : `/hotel-service/admin/status/${data.hotelId}`;
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
        setHotels((prev) =>
          prev.map((h) =>
            h.hotelId === data.hotelId ? { ...h, ...payload } : h,
          ),
        );
        setEditHotel(null);
        setStatusHotel(null);
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
        <div className="sticky top-0 p-4 bg-base-100 border-b border-base-200 z-10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="text-primary" /> Hotel Management
          </h1>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Hotel</th>
                <th>Pricing</th>
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
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img
                          src={hotel.imageUrl}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          {hotel.name}{" "}
                          {hotel.featured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">
                          <MapPin size={10} /> {hotel.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-mono font-bold">
                    LKR {hotel.price.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-bold",
                        hotel.status === "ACTIVE"
                          ? "badge-success"
                          : hotel.status === "PENDING"
                            ? "badge-warning"
                            : hotel.status === "INACTIVE"
                              ? "badge-error"
                              : "badge-neutral",
                      )}
                    >
                      {hotel.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(hotel.updatedAt)}
                  </td>
                  <td className="text-right">
                    {hotel.status !== "REMOVED" && (
                      <button
                        className="btn btn-ghost btn-xs text-secondary"
                        onClick={() => handleOpenStatus(hotel)}
                      >
                        <Activity size={16} />
                      </button>
                    )}
                    <button
                      className="btn btn-ghost btn-xs text-primary"
                      onClick={() => handleOpenEdit(hotel)}
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

      <EditHotelModelForAdmin
        isOpen={!!editHotel}
        hotel={editHotel}
        onClose={() => setEditHotel(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger ? executeUpdate("INFO", data) : setEditHotel(data)
        }
      />

      <HotelStatusChnageModel
        isOpen={!!statusHotel}
        hotel={statusHotel}
        onClose={() => setStatusHotel(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger ? executeUpdate("STATUS", data) : setStatusHotel(data)
        }
      />
    </section>
  );
};

export default AdminHotelManagement;
