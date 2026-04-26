import React from "react";
import { Activity, CheckCircle, X } from "lucide-react";
import clsx from "clsx";
import ProviderCard from "../reusable/ProviderCard";

const VerifyTransportModel = ({
  transport,
  isOpen,
  onClose,
  isUpdating,
  onUpdate,
}) => {
  if (!transport) return null;

  return (
    <div className={clsx("modal", isOpen && "modal-open")}>
      <div className="modal-box max-w-sm rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Activity size={20} className="text-secondary" /> Verify Request
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        <ProviderCard providerId={transport.providerId} />

        <div className="flex items-center gap-3 p-4 bg-base-200/30 rounded-2xl mb-6 border border-dashed border-base-300">
          <img
            src={transport.imageUrl || "https://placehold.co/600x800?text=Vehicle"}
            className="w-12 h-12 mask mask-squircle object-cover"
          />
          <div className="truncate text-left">
            <p className="font-bold text-sm truncate">
              {transport.vehicleMake} {transport.vehicleModel}
            </p>
            <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">
              ID: {transport.transportId} | {transport.city}
            </p>
          </div>
        </div>

        <div className="modal-action mt-6">
          <button
            disabled={isUpdating}
            onClick={() => onUpdate(transport.transportId)}
            className="btn btn-secondary btn-block rounded-xl"
          >
            {isUpdating ? "Approving..." : <><CheckCircle size={18} className="mr-2" /> Approve Request</>}
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

export default VerifyTransportModel;
