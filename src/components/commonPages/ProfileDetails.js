"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Edit3,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  X,
  Bookmark,
} from "lucide-react";
import UseFetch from "@/hooks/UseFetch";
import toast from "react-hot-toast";
import Topic from "../toggles/Topic";
import {
  getUserData,
  storeAccessToken,
  storeUserData,
} from "@/hooks/UseUserInfo";

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await UseFetch("GET", "/user/profile");
        if (!response) {
          toast.error(response.message || "Failed to load profile.");
          return;
        }
        setFormData({
          name: response.name || "",
          phone: response.phone || "",
          dob: response.dob || "",
          gender: response.gender || "",
        });
      } catch (error) {
        toast.error(
          error.message || "An error occurred while fetching profile details.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await UseFetch(
        "PATCH",
        "/user/update-profile",
        formData,
      );
      if (!response) {
        toast.error(response.message || "Failed to update profile.");
      }
      setFormData({
        name: response.user.name || "",
        phone: response.user.phone || "",
        dob: response.user.dob || "",
        gender: response.user.gender || "",
      });
      const role = response.user.admin
        ? "admin"
        : response.user.serviceProvider
          ? "serviceProvider"
          : "traveller";
      console.log(
        response.user.admin,
        response.user.serviceProvider,
        response.user.traveller,
      );
      console.log(role);
      // update user
      const dt = {
        ...response.user,
        accessToken: response.accessToken,
        role: role,
      };
      storeUserData(dt);
      storeAccessToken(response.accessToken);
      toast.success("Profile updated successfully!");

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating profile details.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow border-b lg:border border-base-300 rounded-none lg:rounded-box">
      <div className="card-body">
        <div className="flex justify-between items-center mb-6">
          <Topic Icon={User} title="Profile Details" />

          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary btn-sm gap-2 rounded-full px-4"
              >
                <Save size={16} /> Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1">
              <Bookmark size={12} /> Full Name
            </span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered input-sm w-full focus:input-primary"
              />
            ) : (
              <p className="font-medium">{formData?.name || "—"}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1">
              <Phone size={12} /> Mobile
            </span>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered input-sm w-full focus:input-primary"
              />
            ) : (
              <p className="font-medium">{formData?.phone || "—"}</p>
            )}
          </div>

          {/* Birthday Field (Strict YYYY-MM-DD) */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1">
              <Calendar size={12} /> Birthday
            </span>
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input input-bordered input-sm w-full focus:input-primary"
              />
            ) : (
              <p className="font-medium">{formData?.dob || "—"}</p>
            )}
          </div>

          {/* Gender Field */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold opacity-50 flex items-center gap-1">
              <MapPin size={12} /> Gender
            </span>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="select select-bordered select-sm w-full focus:select-primary"
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
                <option value="o">Other</option>
              </select>
            ) : (
              <p className="font-medium">
                {formData?.gender === "m"
                  ? "Male"
                  : formData?.gender === "f"
                    ? "Female"
                    : "Other" || "—"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
