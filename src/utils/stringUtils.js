// String and text utilities for experience service

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Capitalize first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert enum-style string to readable label
 * e.g., "GUIDED_CITY_TOUR" -> "Guided City Tour"
 * @param {string} enumStr - Enum string
 * @returns {string} Human-readable label
 */
export const enumToLabel = (enumStr) => {
  if (!enumStr) return "";
  return enumStr
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Generate initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 chars)
 */
export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Pluralize a word based on count
 * @param {number} count - Number count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + "s")
 * @returns {string} Pluralized string with count
 */
export const pluralize = (count, singular, plural) => {
  const form = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${form}`;
};

/**
 * Generate a slug from a string
 * @param {string} str - Input string
 * @returns {string} URL-friendly slug
 */
export const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
