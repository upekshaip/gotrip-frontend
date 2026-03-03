"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  confirmClass = "btn-error",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-warning/20">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-base-content/70">{message}</p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn ${confirmClass}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              confirmLabel
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

export default ConfirmDialog;
