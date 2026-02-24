"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  MessageCircleWarning,
  ArrowRight,
} from "lucide-react";
import { formSignUp } from "@/app/actions/Authentication";
import { useSearchParams } from "next/navigation";

const SignupForm = () => {
  const searchParams = useSearchParams();
  const myError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (myError) setError(myError);
  }, [myError]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await formSignUp(email, password);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl font-black tracking-tight mb-1 text-base-content">
          Create Account
        </h2>
        <p className="text-base-content/40 font-bold uppercase text-[10px] tracking-[0.15em]">
          Join the goTrip community
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Email Address
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-secondary/20 transition-all">
            <Mail size={16} className="text-secondary" />
            <input
              type="email"
              className="grow text-sm font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Password
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-secondary/20 transition-all">
            <Lock size={16} className="text-secondary" />
            <input
              type={showPassword ? "text" : "password"}
              className="grow text-sm font-medium"
              placeholder="Min. 5 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={16} className="opacity-40" />
              ) : (
                <Eye size={16} className="opacity-40" />
              )}
            </button>
          </label>
        </div>

        {/* Confirm Password */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Confirm Password
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-secondary/20 transition-all">
            <Lock size={16} className="text-secondary" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="grow text-sm font-medium"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={16} className="opacity-40" />
              ) : (
                <Eye size={16} className="opacity-40" />
              )}
            </button>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error bg-error/10 border-none rounded-xl py-2 mt-2">
            <MessageCircleWarning className="w-4 h-4 text-error" />
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
            className="btn btn-secondary btn-block min-h-0 h-12 text-white rounded-xl shadow-lg shadow-secondary/30 group hover:scale-[1.01] active:scale-95 transition-all text-sm font-bold uppercase tracking-wider"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                Next Step
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
          Already a traveler?{" "}
          <Link
            href="/login"
            className="text-secondary font-black hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
