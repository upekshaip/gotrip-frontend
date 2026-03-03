"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const categories = [
  { value: "TOUR", label: "Tour" },
  { value: "RENTAL", label: "Rental" },
  { value: "ACTIVITY", label: "Activity" },
];

const experienceTypes = [
  "WHALE_WATCHING",
  "DOLPHIN_WATCHING",
  "SNORKELING",
  "DIVING",
  "SURFING",
  "KAYAKING",
  "FISHING",
  "BOAT_RIDE",
  "HIKING",
  "CAMPING",
  "SAFARI",
  "CYCLING",
  "COOKING_CLASS",
  "CULTURAL_TOUR",
  "CITY_TOUR",
  "SCOOTER",
  "BICYCLE",
  "CAR",
  "SURFBOARD",
];

const priceUnits = [
  { value: "PER_PERSON", label: "Per Person" },
  { value: "PER_HOUR", label: "Per Hour" },
  { value: "PER_DAY", label: "Per Day" },
  { value: "PER_ITEM", label: "Per Item" },
];

const ExperienceForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    type: initialData?.type || "",
    location: initialData?.location || "",
    pricePerUnit: initialData?.pricePerUnit || "",
    priceUnit: initialData?.priceUnit || "PER_PERSON",
    maxCapacity: initialData?.maxCapacity || "",
    imageUrl: initialData?.imageUrl || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.type || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.pricePerUnit || parseFloat(form.pricePerUnit) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    onSubmit({
      ...form,
      pricePerUnit: parseFloat(form.pricePerUnit),
      maxCapacity: parseInt(form.maxCapacity) || 0,
    });
  };

  const typeLabel = (t) =>
    t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Title <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g., Mirissa Whale Watching Tour"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-24"
          placeholder="Describe your experience..."
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={2000}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/50">
            {form.description.length}/2000
          </span>
        </label>
      </div>

      {/* Category & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Category <span className="text-error">*</span>
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Type <span className="text-error">*</span>
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            required
          >
            <option value="" disabled>
              Select type
            </option>
            {experienceTypes.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Location <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g., Mirissa, Sri Lanka"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />
      </div>

      {/* Price & Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Price (LKR) <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="0.00"
            value={form.pricePerUnit}
            onChange={(e) => handleChange("pricePerUnit", e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Price Unit</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.priceUnit}
            onChange={(e) => handleChange("priceUnit", e.target.value)}
          >
            {priceUnits.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Max Capacity */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Max Capacity</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="e.g., 20"
          value={form.maxCapacity}
          onChange={(e) => handleChange("maxCapacity", e.target.value)}
          min="0"
        />
      </div>

      {/* Image URL */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <input
          type="url"
          className="input input-bordered w-full"
          placeholder="https://example.com/image.jpg"
          value={form.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : initialData ? (
          "Update Experience"
        ) : (
          "Create Experience"
        )}
      </button>
    </form>
  );
};

export default ExperienceForm;
