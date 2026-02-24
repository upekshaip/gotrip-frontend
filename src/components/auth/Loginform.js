"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldX, ArrowRight } from "lucide-react";
import { formLogin } from "@/app/actions/Authentication";
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const myError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (myError) setError(myError);
  }, [myError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await formLogin(email, password);
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black tracking-tight mb-1 text-base-content">
          Sign In
        </h2>
        <p className="text-base-content/40 font-bold uppercase text-[10px] tracking-[0.15em]">
          Access your goTrip account
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Email Address
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <Mail size={16} className="text-primary" />
            <input
              type="email"
              className="grow text-sm font-medium"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Password Input */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-xs font-bold opacity-70">
              Password
            </span>
          </label>
          <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/50 border-none shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <Lock size={16} className="text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              className="grow text-sm font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-base-content/40 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error bg-error/10 border-none rounded-xl py-2 mt-2">
            <ShieldX className="w-4 h-4 text-error" />
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
            className="btn btn-primary btn-block min-h-0 h-12 text-white rounded-xl shadow-lg shadow-primary/30 group hover:scale-[1.01] active:scale-95 transition-all text-sm font-bold uppercase tracking-wider"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Signup Redirect */}
      <div className="mt-8 text-center">
        <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
          New Explorer?{" "}
          <Link
            href="/signup"
            className="text-primary font-black hover:underline underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
