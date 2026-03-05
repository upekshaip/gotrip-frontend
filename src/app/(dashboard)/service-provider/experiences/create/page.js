"use client";

import React, { useState } from "react";
import ExperienceForm from "@/components/experience/ExperienceForm";
import { createExperience } from "@/hooks/ExperienceApi";
import { Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SectionHeader from "@/components/reusable/SectionHeader";

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
    <div className="section-container">
      <SectionHeader
        icon={<Compass className="w-5 h-5" />}
        title={"Create Experience"}
      />

      {/* The ExperienceForm is now placed directly within the section-container 
        to match the flat, card-less design of the CreateHotel form. 
      */}
      <div className="mt-4">
        <ExperienceForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateExperiencePage;
