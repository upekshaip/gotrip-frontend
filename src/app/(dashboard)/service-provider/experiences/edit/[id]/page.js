"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExperienceForm from "@/components/experience/ExperienceForm";
import { getExperienceById, updateExperience } from "@/hooks/ExperienceApi";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const EditExperiencePage = () => {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id;

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (experienceId) {
      fetchExperience();
    }
  }, [experienceId]);

  const fetchExperience = async () => {
    try {
      const data = await getExperienceById(experienceId);
      if (data?.experienceId) {
        setExperience(data);
      }
    } catch (err) {
      console.error("Failed to fetch experience:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await updateExperience(experienceId, data);
      if (result?.experienceId) {
        toast.success("Experience updated successfully!");
        router.push("/service-provider/experiences");
      } else {
        toast.error(result?.message || "Failed to update experience");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Experience not found</h2>
        <Link
          href="/service-provider/experiences"
          className="btn btn-primary mt-4"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Back button */}
      <Link
        href="/service-provider/experiences"
        className="btn btn-ghost btn-sm gap-1"
      >
        <ArrowLeft size={16} /> Back to Listings
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Pencil size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Edit Experience</h1>
          <p className="text-sm text-base-content/60">
            Update your experience listing details
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <ExperienceForm
            initialData={experience}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditExperiencePage;
