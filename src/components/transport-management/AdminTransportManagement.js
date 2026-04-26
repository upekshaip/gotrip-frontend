/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Bike, MapPin } from "lucide-react";
import clsx from "clsx";

const AdminTransportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [transports, setTransports] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const fetchTransports = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    try {
      const data = await UseFetch(
        "GET",
        `/transport-service/admin/all?page=${currentPage}&limit=10`,
      );
      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setTransports((prev) =>
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
    fetchTransports(true);
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchTransports(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page],
  );

  return (
    <section className="section-container">
      <div className="flex flex-col">
        <div className="p-4 bg-base-100 border-b border-base-200">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bike className="text-primary" /> Transport Management
          </h1>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Vehicle</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((transport, index) => (
                <tr key={`${transport.transportId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img
                          src={transport.imageUrl || "https://placehold.co/600x800?text=Vehicle"}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">
                          {transport.vehicleMake} {transport.vehicleModel}{" "}
                          {transport.isFeatured && (
                            <span className="badge badge-primary badge-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">
                          <MapPin size={10} /> {transport.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-mono font-bold">
                    LKR {(transport.price || 0).toLocaleString()}{" "}
                    {transport.priceUnit === "PER_DAY" ? "/ day" : "/ km"}
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-bold",
                        transport.status === "ACTIVE"
                          ? "badge-success"
                          : transport.status === "PENDING"
                            ? "badge-warning"
                            : transport.status === "INACTIVE"
                              ? "badge-error"
                              : "badge-neutral",
                      )}
                    >
                      {transport.status}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(transport.updatedAt)}
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
    </section>
  );
};

export default AdminTransportManagement;
