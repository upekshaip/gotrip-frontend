"use client";
import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Briefcase,
  Rocket,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";
import UseFetch from "@/hooks/UseFetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { routes } from "@/config/routes";
import { logoutFrontend } from "@/hooks/Logout";

const ProfileCreateProvider = () => {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessType: "",
    businessPhone: "",
  });

  // 1. Initial status check
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const res = await UseFetch("GET", "/user/check-me");
        if (res && !res.timestamp) {
          setUserStatus(res);
        }
      } catch (err) {
        console.error("Status check failed", err);
      } finally {
        setInitialLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await UseFetch(
        "POST",
        "/user/create-service-account",
        formData,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success("Registration complete!");
        setIsSuccess(true);
      } else {
        toast.error(res.message || "Failed to create service account.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutRedirect = () => {
    logoutFrontend();
    router.push(routes.out.home.url);
  };

  // --- RENDERING LOGIC ---

  if (initialLoading) {
    return (
      <div className="flex justify-center p-12">
        <span className="loading loading-spinner loading-md text-primary opacity-20"></span>
      </div>
    );
  }

  // 2. Show "Already a Provider/Admin" Tip
  if (userStatus?.admin || userStatus?.serviceProvider) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="card bg-base-100 shadow-xl border border-base-300 rounded-3xl overflow-hidden">
          <div className="bg-primary/10 p-6 flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl text-primary mt-1">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black italic tracking-tight">
                Pro Tip!
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">
                {userStatus.admin
                  ? "You are currently an Admin. Administrators have full access to all platform features, including provider tools."
                  : "You are already registered as a Service Provider. You can manage your business and services directly from your dashboard."}
              </p>
            </div>
          </div>
          <div className="p-6 bg-base-100 flex justify-end">
            <button
              onClick={() =>
                router.push(
                  userStatus.admin
                    ? routes.admin.dashboard.url
                    : routes.serviceProvider.dashboard.url,
                )
              }
              className="btn btn-primary btn-sm rounded-xl px-6"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Show Success Screen
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
        <div className="card bg-base-100 shadow-2xl border border-base-300 rounded-3xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={48} />
            </div>
          </div>

          <h2 className="text-2xl font-black mb-2">Almost There!</h2>
          <p className="text-sm opacity-70 mb-8 leading-relaxed">
            Your business profile for{" "}
            <span className="font-bold text-base-content">
              {formData.businessName}
            </span>{" "}
            has been created.
            <br />
            <br />
            To activate your provider dashboard,{" "}
            <span className="text-primary font-bold">
              please log out and sign in again.
            </span>
          </p>

          <button
            onClick={handleLogoutRedirect}
            className="btn btn-primary btn-block rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out to Activate
          </button>
        </div>
      </div>
    );
  }

  // 4. Default: Show Registration Form
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-4">
          <Rocket size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-base-content">
          Become a Provider
        </h1>
        <p className="text-sm opacity-60 mt-2 max-w-xs mx-auto">
          Scale your business by joining the Gotrip platform and reaching
          thousands of travelers.
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden rounded-3xl">
        <div className="bg-primary p-1"></div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control col-span-2 md:col-span-1">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-60 tracking-widest">
                  Business Name
                </span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                  size={18}
                />
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Blue Lagoon Resort"
                  className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:ring-2 ring-primary/20 transition-all"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control col-span-2 md:col-span-1">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-60 tracking-widest">
                  Contact Number
                </span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                  size={18}
                />
                <input
                  type="tel"
                  name="businessPhone"
                  required
                  placeholder="07xxxxxxxx"
                  className="input input-bordered w-full pl-12 bg-base-200/50 border-none focus:ring-2 ring-primary/20 transition-all"
                  value={formData.businessPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-60 tracking-widest">
                  Business Category
                </span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                  size={18}
                />
                <select
                  name="businessType"
                  required
                  className="select select-bordered w-full pl-12 bg-base-200/50 border-none focus:ring-2 ring-primary/20 transition-all font-medium"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select your service type
                  </option>
                  <option value="HOTEL">Hotels & Accommodation</option>
                  <option value="TRANSPORT">Transport & Vehicle Rental</option>
                  <option value="GUIDE">Tour Guides & Activities</option>
                  <option value="RESTAURANT">Food & Dining</option>
                </select>
              </div>
            </div>

            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase opacity-60 tracking-widest">
                  Full Business Address
                </span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-4 opacity-30"
                  size={18}
                />
                <textarea
                  name="businessAddress"
                  required
                  placeholder="Enter your full operational address"
                  className="textarea textarea-bordered w-full pl-12 pt-4 bg-base-200/50 border-none focus:ring-2 ring-primary/20 transition-all min-h-[100px]"
                  value={formData.businessAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
            >
              {!loading && <ShieldCheck size={20} className="mr-2" />}
              {loading ? "Registering..." : "Register My Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreateProvider;
