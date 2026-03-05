/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizePrice, normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Compass,
  MapPin,
  Settings2,
  Activity,
  Filter,
  User,
} from "lucide-react";
import clsx from "clsx";
import EditExperienceModelForAdmin from "@/components/experience-management/EditExperienceModelForAdmin";
import ExperienceStatusChangeModel from "@/components/experience-management/ExperienceStatusChangeModel";

const AdminExperienceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");

  // 🔹 Modal & Update States
  const [editExperience, setEditExperience] = useState(null);
  const [statusExperience, setStatusExperience] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const observer = useRef();

  const fetchExperiences = async (isFirstLoad = false, nextPage = 0) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isFirstLoad ? 0 : nextPage;

    try {
      const data = await UseFetch(
        "GET",
        `/experience/admin/all?page=${currentPage + 1}&limit=10&filter=${filter}`,
      );

      if (data && !data.timestamp) {
        const newContent = data.content || [];
        setExperiences((prev) =>
          isFirstLoad ? newContent : [...prev, ...newContent],
        );
        setHasMore(!data.last);
      }
    } catch (error) {
      toast.error("Error fetching experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExperiences([]);
    setPage(0);
    setHasMore(true);
    fetchExperiences(true, 0);
  }, [filter]);

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
    [loading, hasMore, page],
  );

  const handleOpenEdit = (exp) => {
    setEditExperience(exp);
  };

  const handleOpenStatus = (exp) => {
    setStatusExperience(exp);
  };

  const executeUpdate = async (type, data) => {
    setIsUpdating(true);
    try {
      const method = "PUT";
      const url =
        type === "INFO"
          ? `/experience/admin/${data.experienceId}`
          : `/experience/admin/avaible/${data.experienceId}`;

      const payload = type === "INFO" ? data : { available: data.available };
      const res = await UseFetch(method, url, payload);

      if (res && !res.timestamp && !res.error) {
        toast.success("Updated successfully.");
        setExperiences((prev) =>
          prev.map((e) =>
            e.experienceId === data.experienceId ? { ...e, ...data } : e,
          ),
        );
        setEditExperience(null);
        setStatusExperience(null);
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
        <div className="sticky top-0 p-4 bg-base-100 border-b border-base-200 z-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Compass className="text-primary" /> Experience Management
          </h1>
          <div className="flex items-center gap-2">
            <Filter size={16} className="opacity-50" />
            <select
              className="select select-sm select-bordered font-bold"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Experiences</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>Experience</th>
                <th>Pricing</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Last Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, index) => (
                <tr key={`${exp.experienceId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="mask mask-squircle w-12 h-12 bg-base-200">
                        <img
                          src={exp.imageUrl}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{exp.title}</div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">
                          <MapPin size={10} /> {exp.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold">
                        {normalizePrice(exp.pricePerUnit)}
                      </span>
                      <span className="text-[9px] opacity-50 uppercase font-black">
                        {exp.priceUnit.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-xs opacity-70">
                      <User size={12} /> {exp.maxCapacity}
                    </div>
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "badge badge-sm font-bold",
                        exp.available ? "badge-success" : "badge-error",
                      )}
                    >
                      {exp.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(exp.updatedAt)}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-ghost btn-xs text-secondary"
                      onClick={() => handleOpenStatus(exp)}
                    >
                      <Activity size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-primary"
                      onClick={() => handleOpenEdit(exp)}
                    >
                      <Settings2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
          </div>
        </div>
      </div>

      <EditExperienceModelForAdmin
        isOpen={!!editExperience}
        experience={editExperience}
        onClose={() => setEditExperience(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger
            ? executeUpdate("INFO", {
                ...data,
                experienceId: editExperience.experienceId,
              })
            : setEditExperience(data)
        }
      />

      <ExperienceStatusChangeModel
        isOpen={!!statusExperience}
        experience={statusExperience}
        onClose={() => setStatusExperience(null)}
        isUpdating={isUpdating}
        onUpdate={(data, trigger) =>
          trigger
            ? executeUpdate("STATUS", {
                ...data,
                experienceId: statusExperience.experienceId,
              })
            : setStatusExperience(data)
        }
      />
    </section>
  );
};

export default AdminExperienceManagement;
