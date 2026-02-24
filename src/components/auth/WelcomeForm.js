"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import {
  User,
  Phone,
  Calendar,
  ArrowRight,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { getUserData } from "@/hooks/UseUserInfo";

const WelcomeForm = () => {
  const router = useRouter();
  const logUser = getUserData();

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("m");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const validateForm = () => {
    if (name.trim().length < 2) {
      setError("Name is too short");
      return false;
    }
    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const handleRedirect = (user) => {
    if (user.admin && user.serviceProvider && user.traveller) {
      router.push(routes.admin.dashboard.url);
    } else if (user.serviceProvider && user.traveller) {
      router.push(routes.serviceProvider.dashboard.url);
    } else {
      router.push(routes.traveller.dashboard.url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/signup-update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logUser.accessToken}`,
        },
        body: JSON.stringify({ name, phone, gender, address, dob }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An unexpected error occurred.");
        return;
      }

      handleRedirect(data);
    } catch (err) {
      console.error("Step 2 error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black tracking-tight mb-1 text-base-content">
          Personal Details
        </h2>
        <p className="text-base-content/40 font-bold uppercase text-[10px] tracking-[0.15em]">
          Final Step: Complete your profile
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Full Name
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-accent/20 transition-all">
            <User size={16} className="text-accent" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="grow text-sm font-medium"
              placeholder="e.g. Alex Smith"
              required
              disabled={loading}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date of Birth */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-bold opacity-70">
                Birthday
              </span>
            </label>
            <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-accent/20 transition-all">
              <Calendar size={16} className="text-accent" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="grow text-xs font-medium"
                required
                disabled={loading}
              />
            </label>
          </div>

          {/* Gender Select */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-bold opacity-70">
                Gender
              </span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
              className="select select-bordered h-11 min-h-0 w-full bg-base-200/50 border-none focus:outline-none focus:ring-2 ring-accent/20 text-xs font-medium"
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="o">Other</option>
            </select>
          </div>
        </div>

        {/* Phone Number */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Phone Number
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-accent/20 transition-all">
            <Phone size={16} className="text-accent" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="grow text-sm font-medium"
              placeholder="+94 7X XXX XXXX"
              required
              disabled={loading}
            />
          </label>
        </div>

        {/* Address (Optional) */}
        <div className="form-control col-span-2">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Home Address (Optional)
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-accent/20 transition-all">
            <MapPin size={16} className="text-accent" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="grow text-sm font-medium"
              placeholder="Enter your home address"
              disabled={loading}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert bg-error/10 border-none rounded-xl py-2 mt-2">
            <TriangleAlert className="w-4 h-4 text-error" />
            <span className="text-[11px] font-bold text-error uppercase tracking-wider">
              {error}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent btn-block min-h-0 h-12 text-white rounded-xl shadow-lg shadow-accent/30 group hover:scale-[1.01] active:scale-95 transition-all text-sm font-bold uppercase tracking-wider"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                Complete Signup
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WelcomeForm;
