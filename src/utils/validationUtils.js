// Validation utilities for experience service forms

/**
 * Validate required field
 * @param {*} value - Field value
 * @param {string} fieldName - Field label for error message
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate minimum length
 * @param {string} value - String value
 * @param {number} min - Minimum length
 * @param {string} fieldName - Field label
 * @returns {string|null} Error message or null
 */
export const validateMinLength = (value, min, fieldName) => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

/**
 * Validate maximum length
 * @param {string} value - String value
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field label
 * @returns {string|null} Error message or null
 */
export const validateMaxLength = (value, max, fieldName) => {
  if (value && value.length > max) {
    return `${fieldName} must be at most ${max} characters`;
  }
  return null;
};

/**
 * Validate positive number
 * @param {number} value - Number value
 * @param {string} fieldName - Field label
 * @returns {string|null} Error message or null
 */
export const validatePositiveNumber = (value, fieldName) => {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

/**
 * Validate number range
 * @param {number} value - Number value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field label
 * @returns {string|null} Error message or null
 */
export const validateRange = (value, min, max, fieldName) => {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

/**
 * Validate URL format
 * @param {string} value - URL string
 * @returns {string|null} Error message or null
 */
export const validateUrl = (value) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

/**
 * Validate future date
 * @param {string} dateStr - Date string
 * @param {string} fieldName - Field label
 * @returns {string|null} Error message or null
 */
export const validateFutureDate = (dateStr, fieldName) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return `${fieldName} must be a future date`;
  }
  return null;
};

/**
 * Run multiple validators on a single field
 * @param {*} value - Field value
 * @param {Function[]} validators - Array of validator functions
 * @returns {string|null} First error message or null
 */
export const validateField = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
