"use client";

import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, Ban, Timer } from "lucide-react";

const TIMELINE_STEPS = {
  PENDING: {
    icon: Clock,
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning",
    description: "Waiting for provider response",
  },
  ACCEPTED: {
    icon: CheckCircle,
    label: "Accepted",
    color: "text-success",
    bgColor: "bg-success",
    description: "Booking confirmed by provider",
  },
  DECLINED: {
    icon: XCircle,
    label: "Declined",
    color: "text-error",
    bgColor: "bg-error",
    description: "Booking was declined",
  },
  CANCELLED: {
    icon: Ban,
    label: "Cancelled",
    color: "text-base-content/50",
    bgColor: "bg-base-300",
    description: "Booking was cancelled",
  },
  COMPLETED: {
    icon: CheckCircle,
    label: "Completed",
    color: "text-info",
    bgColor: "bg-info",
    description: "Experience completed",
  },
  EXPIRED: {
    icon: Timer,
    label: "Expired",
    color: "text-neutral",
    bgColor: "bg-neutral",
    description: "Booking has expired",
  },
};

const FLOW_ORDER = ["PENDING", "ACCEPTED", "COMPLETED"];

const BookingStatusTimeline = ({ currentStatus }) => {
  const isTerminal = ["DECLINED", "CANCELLED", "EXPIRED"].includes(currentStatus);

  const steps = isTerminal
    ? ["PENDING", currentStatus]
    : FLOW_ORDER.filter((_, index) => index <= FLOW_ORDER.indexOf(currentStatus) || index <= FLOW_ORDER.length);

  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="w-full py-4">
      <ul className="steps steps-horizontal w-full">
        {steps.map((status, index) => {
          const step = TIMELINE_STEPS[status];
          if (!step) return null;
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={status}
              className={`step ${isActive ? `step-${status === "DECLINED" || status === "CANCELLED" ? "error" : status === "PENDING" ? "warning" : "success"}` : ""}`}
            >
              <div className={`flex flex-col items-center gap-1 ${isCurrent ? "font-bold" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? step.color : "text-base-content/30"}`} />
                <span className={`text-xs ${isActive ? "" : "text-base-content/40"}`}>
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Current status description */}
      <div className="text-center mt-3">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className={`w-4 h-4 ${TIMELINE_STEPS[currentStatus]?.color || ""}`} />
          <span className="text-sm text-base-content/70">
            {TIMELINE_STEPS[currentStatus]?.description || "Unknown status"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusTimeline;
