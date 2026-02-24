/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { getUserTheme, mainThemes, setUserTheme } from "@/hooks/UseTheme";
import { Brush } from "lucide-react";
import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  // 1. Start with a safe default for SSR
  const [theme, setTheme] = useState("light");

  // 2. Sync with localStorage ONLY after mount
  useEffect(() => {
    const savedTheme = getUserTheme();
    setTheme(savedTheme);
    // Apply to HTML tag immediately on mount
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const currentIndex = mainThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % mainThemes.length;
    const newTheme = mainThemes[nextIndex];

    setTheme(newTheme);
    setUserTheme(newTheme);
  };

  return (
    <div className="tooltip tooltip-left" data-tip={theme}>
      <button
        onClick={toggleTheme}
        className="btn btn-circle btn-lg btn-primary"
        aria-label="Toggle theme"
      >
        <Brush className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ThemeToggle;
