/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import MapSelector from "@/components/maps/MapSelector";
import SectionHeader from "@/components/reusable/SectionHeader";
import { routes } from "@/config/routes";
import UseFetch from "@/hooks/UseFetch";
import {
  Coffee,
  BrushCleaning,
  Save,
  RotateCcw,
  Info,
  FileCog,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditRestaurant = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
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

  // Fetch existing restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const data = await UseFetch(
          "GET",
          `/restaurant-service/${resolvedParams.restaurantId}`,
        );

        if (data.timestamp || !data) {
          toast.error("Failed to get restaurant information.");
        } else {
          setRestaurantData(data);
          setFormData({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
            city: data.city || "",
            imageUrl: data.imageUrl || "",
            priceUnit: data.priceUnit || "PER_PERSON",
            price: data.price || 0,
            featured: data.featured || false,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            discount: data.discount || 0,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch restaurant data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [resolvedParams.restaurantId]);

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng,
    }));
  };

  const resetForm = () => {
    if (restaurantData) setFormData(restaurantData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map.");
      setLoading(false);
      return;
    }

    try {
      const res = await UseFetch(
        "PUT",
        `/restaurant-service/${resolvedParams.restaurantId}`,
        { ...formData },
      );

      if (res.timestamp) {
        toast.error("Failed to update restaurant. Please try again.");
      } else {
        toast.success("Restaurant updated successfully!");
        router.push(routes.serviceProvider.restaurantManagement.url);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !restaurantData) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!loading && !restaurantData) {
    return (
      <div className="alert alert-error mt-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5" />
          <span>Restaurant not found with the provided ID.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <SectionHeader
        icon={<FileCog className="w-5 h-5" />}
        title={"Edit Restaurant Service"}
      />
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Restaurant Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Restaurant Name
              </span>
            </label>
            <input
              disabled={loading}
              type="text"
              className="input input-bordered w-full"
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
              disabled={loading}
              className="textarea textarea-bordered w-full"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  Address
                </span>
              </label>
              <input
                disabled={loading}
                type="text"
                className="input input-bordered w-full"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  City
                </span>
              </label>
              <input
                disabled={loading}
                type="text"
                className="input input-bordered w-full"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-1">
                Image URL
              </span>
            </label>
            <input
              disabled={loading}
              type="text"
              className="input input-bordered w-full"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  Price Unit
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.priceUnit}
                onChange={(e) =>
                  setFormData({ ...formData, priceUnit: e.target.value })
                }
                required
              >
                <option value="PER_DAY">Per Day</option>
                <option value="PER_HOUR">Per Hour</option>
                <option value="PER_PERSON">Per Person</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium mb-1">
                  Price (LKR)
                </span>
              </label>
              <input
                disabled={loading}
                type="number"
                className="input input-bordered w-full"
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

          {/* Map Selector */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Edit Restaurant Location (Sri Lanka
                Only)
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

          {/* Featured Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                className="toggle toggle-sm"
                checked={formData.featured}
                onChange={(e) => {
                  setFormData({ ...formData, featured: e.target.checked });
                }}
              />
              <span className="label-text text-xs font-medium">
                Featured Restaurant
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center mt-6 gap-2 justify-end">
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
            Save Changes
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-soft btn-primary btn-sm"
            disabled={loading}
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Original
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRestaurant;
