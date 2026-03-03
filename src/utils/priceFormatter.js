// Price formatting utilities for experience service

/**
 * Format a price value with currency symbol
 * @param {number} price - The price value
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = "USD") => {
  if (price === null || price === undefined) return "N/A";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `$${Number(price).toFixed(2)}`;
  }
};

/**
 * Normalize and format a price value
 * @param {*} price - Price value (string or number)
 * @returns {string} Normalized price string
 */
export const normalizePrice = (price) => {
  if (price === null || price === undefined) return "0.00";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

/**
 * Get price unit display label
 * @param {string} unit - Price unit enum value
 * @returns {string} Human-readable label
 */
export const getPriceUnitLabel = (unit) => {
  const labels = {
    PER_PERSON: "per person",
    PER_HOUR: "per hour",
    PER_DAY: "per day",
    FLAT_RATE: "flat rate",
  };
  return labels[unit] || unit?.toLowerCase()?.replace(/_/g, " ") || "";
};

/**
 * Format price with unit for display
 * @param {number} price - Price value
 * @param {string} unit - Price unit
 * @param {string} currency - Currency code
 * @returns {string} Formatted price with unit (e.g., "$99.00 / per person")
 */
export const formatPriceWithUnit = (price, unit, currency = "USD") => {
  const formattedPrice = formatPrice(price, currency);
  const unitLabel = getPriceUnitLabel(unit);
  return unitLabel ? `${formattedPrice} / ${unitLabel}` : formattedPrice;
};

/**
 * Calculate total price based on quantity and duration
 * @param {number} basePrice - Base price per unit
 * @param {number} quantity - Number of units
 * @param {number} duration - Duration in hours (for PER_HOUR)
 * @param {string} priceUnit - Price unit type
 * @returns {number} Total calculated price
 */
export const calculateTotalPrice = (basePrice, quantity, duration, priceUnit) => {
  if (!basePrice || !quantity) return 0;
  const price = Number(basePrice);
  const qty = Number(quantity);
  const dur = Number(duration) || 1;

  switch (priceUnit) {
    case "PER_PERSON":
      return price * qty;
    case "PER_HOUR":
      return price * qty * dur;
    case "PER_DAY":
      return price * qty;
    case "FLAT_RATE":
      return price;
    default:
      return price * qty;
  }
};
