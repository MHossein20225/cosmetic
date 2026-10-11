import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import ThemeToggle from "@/components/ThemeToggle";
import {
  applyThemePreference,
  normalizeThemePreference,
  persistThemePreference,
  readThemePreference,
  resolveTheme,
  syncSystemThemeChange,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

test("theme preference is validated and saved for later loads", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };

  assert.equal(normalizeThemePreference("dark"), "dark");
  assert.equal(normalizeThemePreference("invalid"), "system");
  assert.equal(persistThemePreference("dark", storage), true);
  assert.equal(values.get(THEME_STORAGE_KEY), "dark");
  assert.equal(readThemePreference(storage), "dark");
});

test("system preference resolves and updates the document theme", () => {
  const root = { dataset: {} as Record<string, string | undefined> };

  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  applyThemePreference("system", root, true);
  assert.equal(root.dataset.theme, "dark");
  assert.equal(root.dataset.themeChoice, "system");

  applyThemePreference("system", root, false);
  assert.equal(root.dataset.theme, "light");

  applyThemePreference("dark", root, false);
  syncSystemThemeChange(root, true);
  assert.equal(root.dataset.theme, "dark");
});

test("theme menu exposes an accessible label and three pressed states", () => {
  const markup = renderToStaticMarkup(createElement(ThemeToggle));

  assert.match(markup, /aria-label="انتخاب پوسته"/);
  assert.equal((markup.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.match(markup, /سیستم/);
  assert.match(markup, /روشن/);
  assert.match(markup, /تیره/);
});
