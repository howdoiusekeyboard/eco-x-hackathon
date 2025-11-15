// Backwards compatibility - export locales
// Main config is now in i18n/request.ts and i18n/routing.ts
export const locales = ["hi", "en"] as const;
export type Locale = (typeof locales)[number];
