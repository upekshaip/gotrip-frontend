import React from "react";
import {
  X,
  Save,
  Settings2,
  Info,
  CircleDollarSign,
  Users,
  ImageIcon,
  MapPin,
  Tag,
} from "lucide-react";
import clsx from "clsx";
import ProviderCard from "../reusable/ProviderCard";

const EditExperienceModelForAdmin = ({
  experience,
  isOpen,
  onClose,
  isUpdating,
  onUpdate,
}) => {
  if (!experience) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // According to your DTO UpdateExperienceRequest
    const payload = {
      title: experience.title,
      description: experience.description,
      category: experience.category,
      type: experience.type,
      location: experience.location,
      pricePerUnit: experience.pricePerUnit,
      priceUnit: experience.priceUnit,
      maxCapacity: experience.maxCapacity,
      imageUrl: experience.imageUrl,
      available: experience.available,
    };
    onUpdate(payload, true); // trigger executeUpdate in parent
  };

  return (
    <div className={clsx("modal", isOpen && "modal-open")}>
      <div className="modal-box max-w-2xl rounded-3xl p-0 overflow-hidden">
        <div className="p-6 bg-base-100 h-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Settings2 size={20} className="text-primary" /> Edit Experience
              Details
            </h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X size={18} />
            </button>
          </div>

          <ProviderCard providerId={experience.providerId} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="form-control col-span-2">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Experience Title
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={experience.title || ""}
                  onChange={(e) =>
                    onUpdate({ ...experience, title: e.target.value }, false)
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="form-control col-span-2">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-20 text-sm"
                  value={experience.description || ""}
                  onChange={(e) =>
                    onUpdate(
                      { ...experience, description: e.target.value },
                      false,
                    )
                  }
                />
              </div>

              {/* Category & Type */}
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <Tag size={12} /> Category
                </label>
                <select
                  className="select select-bordered w-full"
                  value={experience.category}
                  onChange={(e) =>
                    onUpdate({ ...experience, category: e.target.value }, false)
                  }
                >
                  <option value="ACTIVITY">Activity</option>
                  <option value="TOUR">Tour</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Type
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={experience.type || ""}
                  onChange={(e) =>
                    onUpdate({ ...experience, type: e.target.value }, false)
                  }
                />
              </div>

              {/* Pricing */}
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <CircleDollarSign size={12} /> Price per Unit
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={experience.pricePerUnit || 0}
                  onChange={(e) =>
                    onUpdate(
                      {
                        ...experience,
                        pricePerUnit: parseFloat(e.target.value),
                      },
                      false,
                    )
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Price Unit
                </label>
                <select
                  className="select select-bordered w-full"
                  value={experience.priceUnit}
                  onChange={(e) =>
                    onUpdate(
                      { ...experience, priceUnit: e.target.value },
                      false,
                    )
                  }
                >
                  <option value="PER_PERSON">Per Person</option>
                  <option value="PER_GROUP">Per Group</option>
                  <option value="PER_HOUR">Per Hour</option>
                </select>
              </div>

              {/* Location & Capacity */}
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <MapPin size={12} /> Location
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={experience.location || ""}
                  onChange={(e) =>
                    onUpdate({ ...experience, location: e.target.value }, false)
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <Users size={12} /> Max Capacity
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={experience.maxCapacity || 0}
                  onChange={(e) =>
                    onUpdate(
                      { ...experience, maxCapacity: parseInt(e.target.value) },
                      false,
                    )
                  }
                />
              </div>

              {/* Image URL */}
              <div className="form-control col-span-2">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <ImageIcon size={12} /> Image URL
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={experience.imageUrl || ""}
                  onChange={(e) =>
                    onUpdate({ ...experience, imageUrl: e.target.value }, false)
                  }
                />
              </div>
            </div>

            <div className="divider"></div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4 p-0">
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={experience.available || false}
                  onChange={(e) =>
                    onUpdate(
                      { ...experience, available: e.target.checked },
                      false,
                    )
                  }
                />
                <span className="label-text text-xs font-bold">
                  Mark as Available
                </span>
              </label>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary btn-block rounded-xl"
                disabled={isUpdating}
              >
                {!isUpdating && <Save size={18} className="mr-2" />} Save
                Experience Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !isUpdating && onClose()}
      ></div>
    </div>
  );
};

export default EditExperienceModelForAdmin;
