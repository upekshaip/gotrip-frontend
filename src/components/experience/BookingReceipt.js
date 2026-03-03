"use client";

import React from "react";
import { Receipt, Calendar, Clock, Users, MapPin, DollarSign } from "lucide-react";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { formatPrice, getPriceUnitLabel } from "@/utils/priceFormatter";
import StatusBadge from "./StatusBadge";

const BookingReceipt = ({ booking }) => {
  if (!booking) return null;

  const {
    id,
    experienceTitle,
    experienceLocation,
    bookingDate,
    bookingTime,
    numberOfPeople,
    durationHours,
    totalPrice,
    priceUnit,
    status,
    providerMessage,
    createdAt,
  } = booking;

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <h3 className="card-title text-base">Booking Receipt</h3>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="divider my-1"></div>

        {/* Booking ID */}
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60">Booking ID</span>
          <span className="font-mono text-xs">#{id}</span>
        </div>

        {/* Experience */}
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60">Experience</span>
          <span className="font-medium">{experienceTitle || "N/A"}</span>
        </div>

        {/* Location */}
        {experienceLocation && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/60 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span>{experienceLocation}</span>
          </div>
        )}

        {/* Date & Time */}
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date
          </span>
          <span>{formatDate(bookingDate)}</span>
        </div>

        {bookingTime && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/60 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </span>
            <span>{formatTime(bookingTime)}</span>
          </div>
        )}

        {/* People */}
        <div className="flex justify-between text-sm">
          <span className="text-base-content/60 flex items-center gap-1">
            <Users className="w-3 h-3" /> People
          </span>
          <span>{numberOfPeople || 1}</span>
        </div>

        {/* Duration */}
        {durationHours && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/60 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duration
            </span>
            <span>{durationHours} hour{durationHours > 1 ? "s" : ""}</span>
          </div>
        )}

        <div className="divider my-1"></div>

        {/* Total Price */}
        <div className="flex justify-between items-center">
          <span className="font-medium flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Total
          </span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(totalPrice)}
            {priceUnit && (
              <span className="text-xs text-base-content/50 ml-1">
                ({getPriceUnitLabel(priceUnit)})
              </span>
            )}
          </span>
        </div>

        {/* Provider message */}
        {providerMessage && (
          <>
            <div className="divider my-1"></div>
            <div className="bg-base-200 rounded-box p-3">
              <p className="text-xs text-base-content/60 mb-1">Provider Message</p>
              <p className="text-sm">{providerMessage}</p>
            </div>
          </>
        )}

        {/* Booking date */}
        {createdAt && (
          <p className="text-xs text-base-content/40 text-right mt-2">
            Booked on {formatDate(createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingReceipt;
