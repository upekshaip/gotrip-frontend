"use client";
import React from "react";
import { Calendar, Clock, Hash, DollarSign } from "lucide-react";
import { normalizePrice, normalizeSriLankaTime } from "@/function/normalize";

const statusColors = {
  PENDING: "badge-warning",
  ACCEPTED: "badge-success",
  DECLINED: "badge-error",
  CANCELLED: "badge-ghost",
  EXPIRED: "badge-neutral",
  COMPLETED: "badge-info",
};

const BookingCard = ({ booking, actions = null }) => {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4 gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sm">
              {booking.experienceTitle || `Booking #${booking.bookingId}`}
            </h3>
            <p className="text-xs text-base-content/50">
              Booking ID: {booking.bookingId}
            </p>
          </div>
          <span
            className={`badge ${statusColors[booking.status] || "badge-ghost"} badge-sm`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-base-content/70">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{booking.bookingDate}</span>
          </div>
          {booking.startTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{booking.startTime}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Hash size={12} />
            <span>Qty: {booking.quantity}</span>
          </div>
          {booking.durationHours > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{booking.durationHours}h</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-bold text-primary">
            {normalizePrice(booking.totalPrice)}
          </span>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {booking.providerMessage && (
          <div className="bg-base-200 rounded-lg p-2 text-xs">
            <span className="font-medium">Provider note: </span>
            {booking.providerMessage}
          </div>
        )}

        {booking.declineReason && (
          <div className="bg-error/10 rounded-lg p-2 text-xs text-error">
            <span className="font-medium">Decline reason: </span>
            {booking.declineReason}
          </div>
        )}

        <div className="text-xs text-base-content/40">
          Created: {normalizeSriLankaTime(booking.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
