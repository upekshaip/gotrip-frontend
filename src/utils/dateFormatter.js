// Date formatting utilities for experience service

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string or date format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    };
    return date.toLocaleDateString("en-US", defaultOptions);
  } catch {
    return dateStr;
  }
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param {string} dateStr - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
};

/**
 * Format a date and time string
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateStr) => {
  return formatDate(dateStr, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format time only from a date string
 * @param {string} timeStr - Time string (HH:mm or HH:mm:ss)
 * @returns {string} Formatted time
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  try {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

/**
 * Check if a date is in the past
 * @param {string} dateStr - ISO date string
 * @returns {boolean}
 */
export const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

/**
 * Get today's date as YYYY-MM-DD string
 * @returns {string}
 */
export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};
