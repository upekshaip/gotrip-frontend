"use client";
import React, { useState } from "react";
import { Calendar, Clock, Hash, Timer } from "lucide-react";
import { createBooking } from "@/hooks/BookingApi";
import toast from "react-hot-toast";

const BookingForm = ({ experience, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bookingDate: "",
    startTime: "",
    quantity: 1,
    durationHours: 1,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        experienceId: experience.experienceId,
        bookingDate: form.bookingDate,
        startTime: form.startTime || null,
        quantity: parseInt(form.quantity),
        durationHours: parseInt(form.durationHours),
      };
      const result = await createBooking(payload);
      if (result?.bookingId) {
        toast.success("Booking request sent successfully!");
        onSuccess && onSuccess(result);
      } else {
        toast.error(result?.message || "Failed to create booking");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-1">
            <Calendar size={14} /> Booking Date
          </span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={form.bookingDate}
          onChange={(e) => handleChange("bookingDate", e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-1">
            <Clock size={14} /> Start Time
          </span>
        </label>
        <input
          type="time"
          className="input input-bordered w-full"
          value={form.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-1">
            <Hash size={14} /> Quantity
          </span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={form.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          min={1}
          max={experience.maxCapacity || 100}
          required
        />
      </div>

      {experience.priceUnit === "PER_HOUR" && (
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <Timer size={14} /> Duration (hours)
            </span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.durationHours}
            onChange={(e) => handleChange("durationHours", e.target.value)}
            min={1}
            required
          />
        </div>
      )}

      <button
        type="submit"
        className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Request Booking"
        )}
      </button>
    </form>
  );
};

export default BookingForm;
