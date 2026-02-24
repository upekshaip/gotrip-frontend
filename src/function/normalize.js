export const normalizePrice = (price) => {
  return (
    "Rs " +
    parseFloat(price).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export const normalizeSriLankaTime = (utcDate) => {
  if (!utcDate) return "";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(utcDate));
};
