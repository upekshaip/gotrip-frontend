"use client";

export const mainThemes = ["light", "dark"];

export const setUserTheme = (theme) => {
  // Check if we are in the browser
  if (typeof window === "undefined") return;

  if (!theme || !mainThemes.includes(theme)) {
    theme = "light";
  }

  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const getUserTheme = () => {
  // Check if we are in the browser
  if (typeof window === "undefined") return "light";

  const myTheme = localStorage.getItem("theme");
  if (myTheme && mainThemes.includes(myTheme)) {
    return myTheme;
  } else {
    // Note: Calling setUserTheme here is risky during render,
    // better to just return default.
    return "light";
  }
};
