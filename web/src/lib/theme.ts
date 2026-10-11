export const THEME_STORAGE_KEY = "cosmetic-theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export function normalizeThemePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  return preference === "system"
    ? systemPrefersDark
      ? "dark"
      : "light"
    : preference;
}

export function applyThemePreference(
  preference: ThemePreference,
  root: { dataset: Record<string, string | undefined> },
  systemPrefersDark: boolean,
) {
  root.dataset.theme = resolveTheme(preference, systemPrefersDark);
  root.dataset.themeChoice = preference;
}

export function syncSystemThemeChange(
  root: { dataset: Record<string, string | undefined> },
  systemPrefersDark: boolean,
) {
  if (root.dataset.themeChoice === "system") {
    root.dataset.theme = systemPrefersDark ? "dark" : "light";
  }
}

export function readThemePreference(storage: {
  getItem(key: string): string | null;
}): ThemePreference {
  try {
    return normalizeThemePreference(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

export function persistThemePreference(
  preference: ThemePreference,
  storage: { setItem(key: string, value: string): void },
): boolean {
  try {
    storage.setItem(THEME_STORAGE_KEY, preference);
    return true;
  } catch {
    return false;
  }
}

export const THEME_INIT_SCRIPT = `(() => {
  try {
    const value = localStorage.getItem("${THEME_STORAGE_KEY}");
    const preference = value === "light" || value === "dark" || value === "system" ? value : "system";
    const dark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.themeChoice = preference;
  } catch {
    // CSS follows the system preference when browser storage is unavailable.
  }
})();`;
