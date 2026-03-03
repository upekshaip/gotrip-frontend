"use client";
import React, { useEffect, useState } from "react";
import { getMyListings, deleteExperience } from "@/hooks/ExperienceApi";
import { normalizePrice } from "@/function/normalize";
import CategoryBadge from "@/components/experience/CategoryBadge";
import {
  Compass,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const SPExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await getMyListings();
      if (Array.isArray(data)) {
        setExperiences(data);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      toast.success("Experience deleted");
      setExperiences((prev) => prev.filter((e) => e.experienceId !== id));
    } catch (err) {
      toast.error("Failed to delete experience");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Compass size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold">My Experiences</h1>
            <p className="text-sm text-base-content/60">
              Manage your experience listings
            </p>
          </div>
        </div>
        <Link
          href="/service-provider/experiences/create"
          className="btn btn-primary btn-sm gap-1"
        >
          <Plus size={16} /> Create New
        </Link>
      </div>

      {/* Stats */}
      <div className="stats shadow bg-base-100 border border-base-200">
        <div className="stat">
          <div className="stat-title">Total Listings</div>
          <div className="stat-value text-primary">{experiences.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Available</div>
          <div className="stat-value text-success">
            {experiences.filter((e) => e.available).length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Unavailable</div>
          <div className="stat-value text-error">
            {experiences.filter((e) => !e.available).length}
          </div>
        </div>
      </div>

      {/* Table */}
      {experiences.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Experience</th>
                <th>Category</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.experienceId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                          {exp.imageUrl ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.title}
                              className="object-cover"
                            />
                          ) : (
                            <MapPin size={16} />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{exp.title}</div>
                        <div className="text-xs text-base-content/50">
                          {exp.type?.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <CategoryBadge category={exp.category} />
                  </td>
                  <td className="text-sm">{exp.location}</td>
                  <td className="text-sm font-medium">
                    {normalizePrice(exp.pricePerUnit)}
                  </td>
                  <td>
                    {exp.available ? (
                      <span className="badge badge-success badge-sm gap-1">
                        <Eye size={10} /> Active
                      </span>
                    ) : (
                      <span className="badge badge-error badge-sm gap-1">
                        <EyeOff size={10} /> Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Link
                        href={`/service-provider/experiences/edit/${exp.experienceId}`}
                        className="btn btn-ghost btn-xs"
                      >
                        <Pencil size={12} />
                      </Link>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleDelete(exp.experienceId)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16">
          <Compass size={48} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-lg font-medium">No experiences yet</h3>
          <p className="text-sm text-base-content/50 mt-1">
            Create your first experience listing
          </p>
          <Link
            href="/service-provider/experiences/create"
            className="btn btn-primary btn-sm mt-4"
          >
            <Plus size={14} /> Create Experience
          </Link>
        </div>
      )}
    </div>
  );
};

export default SPExperiencesPage;
