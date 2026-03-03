"use client";
import React, { useState } from "react";
import { providerBookingAction } from "@/hooks/BookingApi";
import toast from "react-hot-toast";

const ProviderActionModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const payload = {
        action,
        message: message || null,
        declineReason: action === "DECLINE" ? declineReason : null,
      };
      const result = await providerBookingAction(booking.bookingId, payload);
      if (result?.bookingId) {
        toast.success(
          action === "ACCEPT" ? "Booking accepted!" : "Booking declined."
        );
        onSuccess && onSuccess(result);
        onClose();
      } else {
        toast.error(result?.message || "Action failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Respond to Booking</h3>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="font-medium">Experience:</span>{" "}
            {booking.experienceTitle}
          </p>
          <p>
            <span className="font-medium">Date:</span> {booking.bookingDate}
          </p>
          <p>
            <span className="font-medium">Quantity:</span> {booking.quantity}
          </p>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Message to traveller (optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-20"
            placeholder="Add a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">
              Decline reason (required if declining)
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-16"
            placeholder="Reason for declining..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={() => handleAction("DECLINE")}
            disabled={loading || !declineReason.trim()}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Decline"
            )}
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleAction("ACCEPT")}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ProviderActionModal;
