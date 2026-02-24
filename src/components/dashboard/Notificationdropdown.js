"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import UseFetch from "@/hooks/UseFetch";
import Link from "next/link";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await UseFetch("GET", `/notifications?limit=5`, {});
      if (Array.isArray(data)) {
        setNotifications(data.slice(0, 5));
      } else if (data?.notifications) {
        setNotifications(data.notifications.slice(0, 5));
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id, event) => {
    event.stopPropagation();
    try {
      await UseFetch("DELETE", `/notifications/${id}`, {});
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Mark as read
  const markAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      await UseFetch("PATCH", `/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const seconds = Math.floor((now - notificationDate) / 1000);

    if (seconds < 60) return t("justNow") || "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tooltip tooltip-bottom btn btn-ghost btn-circle btn-sm hover:bg-primary/20"
        data-tip={"Notifications"}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="fixed md:absolute right-4 md:right-0 md:mt-2 top-16 md:top-auto w-80 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-base-100 border-b border-base-300 p-4 flex justify-between items-center gap-2">
              <h3 className="font-bold text-sm">{"Recent Notifications"}</h3>

              {/* Desktop View All */}
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="hidden md:block link link-primary text-xs"
              >
                {"View All"}
              </Link>

              {/* Mobile*/}
              <div className="flex md:hidden items-center gap-2">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="link link-primary text-xs"
                >
                  {"View All"}
                </Link>
                <div className="border-l border-base-300 h-4"></div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-circle btn-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-base-content/60 text-sm">
                {"No notifications"}
              </div>
            ) : (
              <div className="overflow-y-auto divide-y divide-base-300">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-base-200 transition-colors ${
                      !notif.isRead ? "bg-base-200/50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">
                          {notif.title}
                        </p>
                        <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-base-content/40 mt-1">
                          {formatTimeAgo(notif.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!notif.isRead && (
                          <button
                            onClick={(e) => markAsRead(notif.id, e)}
                            className="btn btn-ghost btn-xs btn-circle text-primary"
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notif.id, e)}
                          className="btn btn-ghost btn-xs btn-circle text-error"
                          title="Delete"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="border-t border-base-300 p-3 text-center text-sm font-semibold hover:bg-base-200 transition-colors"
              >
                {"View All Notifications"}
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
