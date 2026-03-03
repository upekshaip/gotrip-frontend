"use client";
import React from "react";

const statusConfig = {
  PENDING: { class: "badge-warning", label: "Pending" },
  ACCEPTED: { class: "badge-success", label: "Accepted" },
  DECLINED: { class: "badge-error", label: "Declined" },
  CANCELLED: { class: "badge-ghost", label: "Cancelled" },
  EXPIRED: { class: "badge-neutral", label: "Expired" },
  COMPLETED: { class: "badge-info", label: "Completed" },
};

const StatusBadge = ({ status, size = "sm" }) => {
  const config = statusConfig[status] || {
    class: "badge-ghost",
    label: status,
  };

  return (
    <span className={`badge ${config.class} badge-${size}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
