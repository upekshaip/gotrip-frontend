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
import { EditCameraModelForAdmin } from "./EditCameraModelForAdmin";

const PendingCamerasAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editCamera, setEditCamera] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const observer = useRef();

  const fetchPendingCameras = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 1 : nextPage;
    try {
      const data = await UseFetch(
        "GET",
        `/camera-service/admin/pending?page=${currentPage}&limit=10`,
      );
      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setCameras((prev) =>
          isFirstLoad ? newContent : [...prev, ...newContent],
        );
        if (data.page) setHasMore(data.page.number < data.page.totalPages - 1);
      }
    } catch (error) {
      toast.error("Error fetching pending cameras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCameras(true);
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchPendingCameras(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page],
  );

  const handleOpenEdit = (camera) => {
    setEditCamera({
      ...camera,
      latitude: camera.latitude || 0,
      longitude: camera.longitude || 0,
    });
  };

  const executeStatusUpdate = async (cameraId, newStatus) => {
    setIsUpdating(true);
    try {
      const payload = { status: newStatus };
      const res = await UseFetch(
        "PUT",
        `/camera-service/admin/status/${cameraId}`,
        payload,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success(`Camera status updated to ${newStatus}.`);
        // Remove the camera from the pending list since it has been actioned
        setCameras((prev) => prev.filter((h) => h.cameraId !== cameraId));
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
        `/camera-service/admin/${data.cameraId}`,
        payload,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success("Camera details updated successfully.");
        setCameras((prev) =>
          prev.map((h) =>
            h.cameraId === data.cameraId ? { ...h, ...payload } : h,
          ),
        );
        setEditCamera(null);
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
            <Building2 className="text-primary" /> Pending Camera Approvals
          </h1>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Camera</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cameras.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 opacity-50">
                    No pending cameras found.
                  </td>
                </tr>
              ) : (
                cameras.map((camera, index) => (
                  <tr key={`${camera.cameraId}-${index}`}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="mask mask-squircle w-12 h-12 bg-base-200">
                          <img
                            src={camera.imageUrl}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <div className="font-bold">
                            {camera.name}{" "}
                            {camera.featured && (
                              <span className="badge badge-primary badge-xs">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] opacity-50 flex items-center gap-1">
                            <MapPin size={10} /> {camera.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs font-mono font-bold">
                      LKR {camera.price.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-sm font-bold badge-warning">
                        {camera.status}
                      </span>
                    </td>
                    <td className="text-xs">
                      {normalizeSriLankaTime(camera.createdAt)}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-xs text-primary"
                          onClick={() => handleOpenEdit(camera)}
                          title="Edit Details"
                        >
                          <Settings2 size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-success"
                          onClick={() =>
                            executeStatusUpdate(camera.cameraId, "ACTIVE")
                          }
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() =>
                            executeStatusUpdate(camera.cameraId, "INACTIVE")
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

      <EditCameraModelForAdmin
        isOpen={!!editCamera}
        camera={editCamera}
        onClose={() => setEditCamera(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger ? executeInfoUpdate(data) : setEditCamera(data)
        }
      />
    </section>
  );
};

export default PendingCamerasAdmin;
