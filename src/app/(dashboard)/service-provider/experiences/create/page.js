"use client";
import React, { useState } from "react";
import ExperienceForm from "@/components/experience/ExperienceForm";
import { createExperience } from "@/hooks/ExperienceApi";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateExperiencePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await createExperience(data);
      if (result?.experienceId) {
        toast.success("Experience created successfully!");
        router.push("/service-provider/experiences");
      } else {
        toast.error(result?.message || "Failed to create experience");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <Plus size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Create Experience</h1>
          <p className="text-sm text-base-content/60">
            Add a new tour, rental, or activity listing
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <ExperienceForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreateExperiencePage;
