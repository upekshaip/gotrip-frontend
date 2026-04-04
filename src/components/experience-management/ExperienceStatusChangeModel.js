import React from "react";
import { Activity, Save, X } from "lucide-react";
import clsx from "clsx";
import ProviderCard from "../reusable/ProviderCard";

const ExperienceStatusChangeModel = ({
  experience,
  isOpen,
  onClose,
  isUpdating,
  onUpdate,
}) => {
  if (!experience) return null;

  return (
    <div className={clsx("modal", isOpen && "modal-open")}>
      <div className="modal-box max-w-sm rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20} className="text-secondary" /> Change
            Availability
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        <ProviderCard providerId={experience.providerId} />

        <div className="flex items-center gap-3 p-4 bg-base-200/30 rounded-2xl mb-6 border border-dashed border-base-300">
          <img
            src={experience.imageUrl}
            className="w-12 h-12 mask mask-squircle object-cover"
          />
          <div className="truncate text-left">
            <p className="font-bold text-sm truncate">{experience.title}</p>
            <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">
              ID: {experience.experienceId}
            </p>
          </div>
        </div>

        <div className="form-control">
          <label className="label-text text-[10px] font-bold mb-2 opacity-50 uppercase tracking-widest ml-1">
            Availability Status
          </label>
          <select
            className="select select-bordered w-full font-bold text-sm"
            value={experience.available ? "true" : "false"}
            onChange={(e) =>
              onUpdate(
                { ...experience, available: e.target.value === "true" },
                false,
              )
            }
          >
            <option value="true">AVAILABLE</option>
            <option value="false">UNAVAILABLE</option>
          </select>
        </div>

        <div className="modal-action mt-6">
          <button
            disabled={isUpdating}
            onClick={() => onUpdate(experience, true)}
            className="btn btn-secondary btn-block rounded-xl"
          >
            {!isUpdating && <Save size={18} className="mr-2" />} Apply Status
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !isUpdating && onClose()}
      ></div>
    </div>
  );
};

export default ExperienceStatusChangeModel;
