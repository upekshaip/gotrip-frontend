"use client";

import MapSelector from "@/components/maps/MapSelector";
import SectionHeader from "@/components/reusable/SectionHeader";
import { routes } from "@/config/routes";
import UseFetch from "@/hooks/UseFetch";
import { getUserData } from "@/hooks/UseUserInfo";
import { BrushCleaning, Coffee, MapPin, Save } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    imageUrl: "",
    priceUnit: "PER_PERSON",
    price: 0,
    featured: false,
    latitude: 0,
    longitude: 0,
    discount: 0,
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location for the restaurant on the map.");
      setLoading(false);
      return;
    }
    let res;
    try {
      const userData = getUserData();
      res = await UseFetch("POST", "/restaurant-service", {
        ...formData,
      });
      if (res.timestamp) {
        toast.error("Failed to create restaurant service. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create restaurant service. Please try again.");
    } finally {
      setLoading(false);
    }
    if (res) {
      toast.success("Restaurant service created successfully!");
      redirect(routes.serviceProvider.restaurantManagement.url);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      imageUrl: "",
      priceUnit: "PER_PERSON",
      price: 0,
      featured: false,
      latitude: 0,
      longitude: 0,
      discount: 0,
    });
  };

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  return (
    <div className="section-container">
      <SectionHeader
        icon={<Coffee className="w-5 h-5" />}
        title={"Create Restaurant Service"}
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Restaurant Name
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter restaurant name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Description
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows="3"
              placeholder="Enter restaurant description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Restaurant Address
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter restaurant address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          {/* City */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">City</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Image URL
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              required
            />
          </div>

          {/* price unit */}
          <div className={"grid gap-4 grid-cols-2"}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  Price Unit
                </span>
              </label>
              <select
                required
                className="select select-bordered w-full"
                value={formData.priceUnit}
                onChange={(e) =>
                  setFormData({ ...formData, priceUnit: e.target.value })
                }
              >
                <option value="PER_DAY">Per Day</option>
                <option value="PER_HOUR">Per Hour</option>
                <option value="PER_PERSON">Per Person</option>
              </select>
            </div>

            {/* price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  Price (LKR)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
                min="100"
                step="0.01"
              />
            </div>
          </div>
          {/* discount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Discount (LKR)
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="0"
              value={formData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseFloat(e.target.value) || 0,
                })
              }
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="divider"></div>

          {/* Toggles */}
          <div className="">
            <div className="form-control my-6">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured: e.target.checked,
                    })
                  }
                />
                <div className="flex items-center gap-2">
                  <span className="label-text text-xs font-medium">
                    Featured
                  </span>
                </div>
              </label>
              <p className="text-xs mt-1">
                Featured restaurants are highlighted on the platform, increasing
                their visibility to potential customers. Enabling this option
                may attract more bookings and enhance the restaurant&apos;s
                reputation.
              </p>
            </div>
          </div>
        </div>

        <div className="divider"></div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-xs font-medium mb-2 flex items-center gap-2">
              Select Restaurant Location (Sri Lanka Only)
            </span>
          </label>

          <MapSelector
            lat={formData.latitude}
            lng={formData.longitude}
            onChange={handleLocationChange}
          />

          {formData.latitude !== 0 && (
            <div className="flex gap-4 mt-2 px-1">
              <p className="text-[10px] font-mono text-base-content/50">
                Lat: {formData.latitude.toFixed(6)}
              </p>
              <p className="text-[10px] font-mono text-base-content/50">
                Lng: {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
        <div className="divider"></div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-soft btn-primary btn-sm"
          >
            <BrushCleaning className="w-5 h-5" />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRestaurant;
