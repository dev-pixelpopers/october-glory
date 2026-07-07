"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type DashTheme = "dark" | "light";

const STORAGE_KEY = "dashboard-theme";

const ThemeContext = createContext<{ theme: DashTheme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export const useDashTheme = () => useContext(ThemeContext);

/**
 * Dashboard-scoped theme. Persists to localStorage("dashboard-theme") and
 * applies CSS variables via a wrapper class — the public site is untouched.
 */
export function DashThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DashTheme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={`dash-theme-${theme} min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useDashTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-11 h-11 rounded-full border border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[#cba660] hover:border-[#cba660] transition-colors cursor-pointer"
    >
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
