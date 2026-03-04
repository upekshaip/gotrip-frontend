"use client";

import React from "react";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Calendar,
  Hash,
  DoorOpen,
  Users,
  Receipt,
  Trash2,
} from "lucide-react";
import UseFetch from "@/hooks/UseFetch";

const HotelBookingCard = ({ data, onUpdate }) => {
  // Destructuring based on your JSON: { booking: {...}, hotelDetails: {...} }
  const { booking, hotelDetails } = data;

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-success";
      case "DECLINED":
        return "badge-error";
      case "CANCELLED":
        return "badge-ghost";
      case "COMPLETED":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await UseFetch("PATCH", `/hotel-booking/${booking.bookingId}/cancel`, {});
      toast.success("Booking cancelled");
      onUpdate();
    } catch (err) {
      console.error("Cancellation failed", err);
    }
  };

  return (
    <div className="card card-side card-bordered bg-base-100 transition-all hover:shadow-md h-auto sm:h-48 overflow-hidden border-base-200">
      {/* Thumbnail */}
      <figure className="w-1/4 max-w-[180px] hidden sm:block border-r border-base-200">
        <img
          src={hotelDetails.imageUrl}
          alt={hotelDetails.name}
          className="h-full w-full object-cover"
        />
      </figure>

      {/* Content Body */}
      <div className="card-body p-4 md:p-5 flex flex-col justify-between overflow-hidden">
        {/* Top: Name and Price */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold truncate leading-none text-base-content">
                {hotelDetails.name}
              </h3>
              <div
                className={`badge badge-sm font-bold text-[9px] uppercase tracking-tighter ${getStatusBadge(booking.status)}`}
              >
                {booking.status}
              </div>
            </div>
            <p className="flex items-center gap-1 text-[11px] opacity-50 mt-1.5">
              <MapPin size={10} className="text-primary" />
              <span className="truncate">
                {hotelDetails.city}, {hotelDetails.address}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-black leading-none text-base-content">
              LKR {booking.finalAmount.toLocaleString()}
            </p>
            <span className="text-[8px] uppercase font-bold opacity-30 mt-1 block">
              Net Amount
            </span>
          </div>
        </div>

        {/* Middle: Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-base-200 my-1">
          <InfoItem
            icon={<Calendar size={10} />}
            label="In"
            value={booking.startingDate}
          />
          <InfoItem
            icon={<Calendar size={10} />}
            label="Out"
            value={booking.endingDate}
          />
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-[8px] font-bold uppercase opacity-30 tracking-tight">
              <Users size={10} /> Guests
            </span>
            <span className="text-[10px] font-bold opacity-80">
              {booking.personCount} Pax / {booking.roomCount} Rooms
            </span>
          </div>
          <InfoItem
            icon={<Hash size={10} />}
            label="Ref"
            value={booking.bookingReference}
            isMono
          />
        </div>

        {/* Bottom: Actions */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] opacity-40 italic truncate hidden md:block">
            {booking.requestMessage || "No special requests"}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            {booking.status === "PENDING" && (
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-xs text-error hover:bg-error/10 px-2 normal-case"
              >
                <Trash2 size={14} />
                Cancel
              </button>
            )}
            <button className="btn btn-primary btn-sm normal-case font-bold px-4 h-8 min-h-8 gap-2 shadow-sm">
              <Receipt size={14} />
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, isMono }) => (
  <div className="flex flex-col gap-0.5">
    <span className="flex items-center gap-1 text-[8px] font-bold uppercase opacity-30 tracking-tight">
      {icon} {label}
    </span>
    <span
      className={`text-[10px] font-bold ${isMono ? "font-mono opacity-60 text-[9px]" : "opacity-80"}`}
    >
      {value}
    </span>
  </div>
);

export default HotelBookingCard;
