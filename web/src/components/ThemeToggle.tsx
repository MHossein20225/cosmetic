"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyThemePreference,
  persistThemePreference,
  readThemePreference,
  syncSystemThemeChange,
  type ThemePreference,
} from "@/lib/theme";

const options: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "سیستم" },
  { value: "light", label: "روشن" },
  { value: "dark", label: "تیره" },
];

const themeStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
};

function subscribeToThemePreference(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("cosmetic-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("cosmetic-theme-change", onChange);
  };
}

function getThemePreferenceSnapshot(): ThemePreference {
  return readThemePreference(themeStorage);
}

function getServerThemePreferenceSnapshot(): ThemePreference {
  return "system";
}

export default function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreferenceSnapshot,
    getServerThemePreferenceSnapshot,
  );

  useEffect(() => {
    const root = document.documentElement;
    const stored = readThemePreference(themeStorage);
    applyThemePreference(
      stored,
      root,
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      syncSystemThemeChange(document.documentElement, event.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function chooseTheme(nextPreference: ThemePreference) {
    persistThemePreference(nextPreference, themeStorage);
    applyThemePreference(
      nextPreference,
      document.documentElement,
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    window.dispatchEvent(new Event("cosmetic-theme-change"));
  }

  const Icon = preference === "dark" ? Moon : preference === "light" ? Sun : Monitor;

  return (
    <details className="theme-menu relative">
      <summary
        aria-label="انتخاب پوسته"
        title="انتخاب پوسته"
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
      >
        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      </summary>
      <div
        role="group"
        aria-label="انتخاب پوسته"
        className="absolute end-0 top-full z-[60] mt-2 w-36 rounded-xl border border-rose-100 bg-white p-1.5 shadow-xl"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={preference === option.value}
            onClick={(event) => {
              chooseTheme(option.value);
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
            className="block w-full rounded-lg px-3 py-2 text-start text-sm text-gray-700 transition-colors hover:bg-rose-50 aria-pressed:bg-rose-50 aria-pressed:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            {option.label}
          </button>
        ))}
      </div>
    </details>
  );
}
