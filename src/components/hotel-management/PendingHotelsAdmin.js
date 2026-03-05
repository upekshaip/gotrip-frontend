/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Building2, MapPin, Settings2, Check, X } from "lucide-react";
import clsx from "clsx";
import { EditHotelModelForAdmin } from "./EditHotelModelForAdmin";

const PendingHotelsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editHotel, setEditHotel] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const observer = useRef();

  const fetchPendingHotels = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    try {
      const data = await UseFetch(
        "GET",
        `/hotel-service/admin/pending?page=${currentPage}&limit=10`,
      );
      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setHotels((prev) =>
          isFirstLoad ? newContent : [...prev, ...newContent],
        );
        if (data.page) setHasMore(data.page.number < data.page.totalPages - 1);
      }
    } catch (error) {
      toast.error("Error fetching pending hotels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHotels(true);
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchPendingHotels(false, nextPage);
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

  const executeStatusUpdate = async (hotelId, newStatus) => {
    setIsUpdating(true);
    try {
      const payload = { status: newStatus };
      const res = await UseFetch(
        "PUT",
        `/hotel-service/admin/status/${hotelId}`,
        payload,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success(`Hotel status updated to ${newStatus}.`);
        // Remove the hotel from the pending list since it has been actioned
        setHotels((prev) => prev.filter((h) => h.hotelId !== hotelId));
      }
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const executeInfoUpdate = async (data) => {
    setIsUpdating(true);
    try {
      const payload = {
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
      };

      const res = await UseFetch(
        "PUT",
        `/hotel-service/admin/${data.hotelId}`,
        payload,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success("Hotel details updated successfully.");
        setHotels((prev) =>
          prev.map((h) =>
            h.hotelId === data.hotelId ? { ...h, ...payload } : h,
          ),
        );
        setEditHotel(null);
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
            <Building2 className="text-primary" /> Pending Hotel Approvals
          </h1>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Hotel</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 opacity-50">
                    No pending hotels found.
                  </td>
                </tr>
              ) : (
                hotels.map((hotel, index) => (
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
                      <span className="badge badge-sm font-bold badge-warning">
                        {hotel.status}
                      </span>
                    </td>
                    <td className="text-xs">
                      {normalizeSriLankaTime(hotel.createdAt)}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-xs text-primary"
                          onClick={() => handleOpenEdit(hotel)}
                          title="Edit Details"
                        >
                          <Settings2 size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-success"
                          onClick={() =>
                            executeStatusUpdate(hotel.hotelId, "ACTIVE")
                          }
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() =>
                            executeStatusUpdate(hotel.hotelId, "INACTIVE")
                          }
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
          trigger ? executeInfoUpdate(data) : setEditHotel(data)
        }
      />
    </section>
  );
};

export default PendingHotelsAdmin;
