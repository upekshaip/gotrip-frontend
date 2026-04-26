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
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const observer = useRef();

  const fetchTransports = useCallback(async (isFirstLoad = false) => {
    if (loadingRef.current) return;

    if (observer.current) observer.current.disconnect();

    loadingRef.current = true;
    setLoading(true);

    if (isFirstLoad) {
      pageRef.current = 1;
    }

    const currentPage = pageRef.current;

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

        const totalPages = data.page?.totalPages ?? data.totalPages;
        const pageNumber = data.page?.number ?? data.number;

        let more = false;

        if (totalPages !== undefined && pageNumber !== undefined) {
          more = pageNumber < totalPages - 1;
        } else {
          more = newContent.length === 10;
        }

        hasMoreRef.current = more;
        setHasMore(more);

        if (more) {
          pageRef.current = currentPage + 1;
        }
      }
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransports(true);
  }, []);

  const lastRowRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          fetchTransports(false);
        }
      });
      observer.current.observe(node);
    },
    [fetchTransports],
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
              {transports.map((transport, index) => {
                const isLast = index === transports.length - 1;
                return (
                  <tr
                    key={`${transport.transportId}-${index}`}
                    ref={isLast ? lastRowRef : null}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          <img
                            src={
                              transport.imageUrl ||
                              "https://placehold.co/600x800?text=Vehicle"
                            }
                            className="object-cover h-full w-full"
                            alt={`${transport.vehicleMake} ${transport.vehicleModel}`}
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
                );
              })}
            </tbody>
          </table>

          <div className="py-10 flex justify-center">
            {loading && (
              <span className="loading loading-dots text-primary"></span>
            )}
            {!hasMore && !loading && transports.length > 0 && (
              <span className="text-xs opacity-40">No more transports</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminTransportManagement;
