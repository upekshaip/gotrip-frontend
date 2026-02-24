"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, MessageCircleWarning } from "lucide-react";
import Link from "next/link";
import { formSignUp } from "@/app/actions/Authentication";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const myError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1 - Account Creation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (myError) {
      setError(myError);
    }
  }, [myError]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("validEmailError"));
      return false;
    }
    if (password.length < 5) {
      setError(t("passwordLengthError"));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
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
      setError("");
    } catch (err) {
      setError(err.message || "somethingWentWrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-md w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">{"createAccount"}</h1>
          <p className="text-base-content/60 text-sm">{"registration"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base-content font-medium">
                {"emailAddress"}
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"enterEmail"}
              className="input input-bordered w-full rounded-xl h-11 text-base"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base-content font-medium">
                {"password"}
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"createPassword"}
                className="input input-bordered w-full rounded-xl h-11 pr-12"
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-base-content font-medium">
                {"confirmPassword"}
              </span>
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={"confirmPasswordPlaceholder"}
                className="input input-bordered w-full rounded-xl h-11 pr-12"
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error rounded-xl py-2 text-sm">
              <MessageCircleWarning className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-xl mt-4"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {"creatingAccount"}
              </>
            ) : (
              "nextStep"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-base-300">
          <p className="text-sm text-base-content/60">
            {"alreadyHaveAccount"}{" "}
            <Link href="/login" className="link link-primary font-medium">
              {"login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
