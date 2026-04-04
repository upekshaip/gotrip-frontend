/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import ProviderCard from "../reusable/ProviderCard";

const { Save, X } = require("lucide-react");
const { Activity } = require("react");

export const HotelStatusChnageModel = ({
  hotel,
  isOpen,
  onClose,
  isUpdating,
  onUpdate,
}) => {
  if (!hotel) return null;

  return (
    <div className={clsx("modal", isOpen && "modal-open")}>
      <div className="modal-box max-w-sm rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20} className="text-secondary" /> Quick Status
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        <ProviderCard providerId={hotel.providerId} />

        <div className="flex items-center gap-3 p-4 bg-base-200/30 rounded-2xl mb-6 border border-dashed border-base-300">
          <img
            src={hotel.imageUrl}
            className="w-12 h-12 mask mask-squircle object-cover"
          />
          <div className="truncate text-left">
            <p className="font-bold text-sm truncate">{hotel.name}</p>
            <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">
              ID: {hotel.hotelId}
            </p>
          </div>
        </div>

        <div className="form-control">
          <label className="label-text text-[10px] font-bold mb-2 opacity-50 uppercase tracking-widest ml-1">
            Current Visibility Status
          </label>
          <select
            className="select select-bordered w-full font-bold text-sm"
            value={hotel.status || ""}
            onChange={(e) =>
              onUpdate({ ...hotel, status: e.target.value }, false)
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="REMOVED">REMOVED</option>
          </select>
        </div>

        <div className="modal-action mt-6">
          <button
            disabled={isUpdating}
            onClick={() => onUpdate(hotel, true)}
            className="btn btn-secondary btn-block rounded-xl"
          >
            {!isUpdating && <Save size={18} className="mr-2" />} Apply Status
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !isUpdating && onClose()}
      ></div>
    </div>
  );
};
