"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ExperienceForm from "@/components/experience/ExperienceForm";
import { getExperienceById, updateExperience } from "@/hooks/ExperienceApi";
import { FileCog, Info } from "lucide-react";
import toast from "react-hot-toast";
import SectionHeader from "@/components/reusable/SectionHeader";

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
      if (data?.experience) {
        setExperience(data.experience);
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

  if (loading && !experience) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!loading && !experience) {
    return (
      <div className="alert alert-error mt-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5" />
          <span>Experience not found with the provided ID.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <SectionHeader
        icon={<FileCog className="w-5 h-5" />}
        title={"Edit Experience"}
      />

      {/* The ExperienceForm is placed directly within the section-container 
        without the card wrapper to match the flat design of EditHotel. 
      */}
      <div className="mt-4">
        <ExperienceForm
          initialData={experience}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default EditExperiencePage;
