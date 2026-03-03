"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

const VARIANTS = {
  info: {
    className: "alert-info",
    icon: Info,
  },
  success: {
    className: "alert-success",
    icon: CheckCircle,
  },
  warning: {
    className: "alert-warning",
    icon: AlertTriangle,
  },
  error: {
    className: "alert-error",
    icon: XCircle,
  },
};

const NotificationBanner = ({
  message,
  variant = "info",
  onDismiss,
  action,
  actionLabel,
  className = "",
}) => {
  if (!message) return null;

  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <div className={`alert ${config.className} ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>

      <div className="flex items-center gap-2">
        {action && actionLabel && (
          <button className="btn btn-sm btn-ghost" onClick={action}>
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button className="btn btn-sm btn-ghost btn-circle" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;
