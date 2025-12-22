// Keys used in local/session storage and cookies
const STORAGE_KEYS = {
  TOKEN: 'jwtToken',
  PREFERED_LANGUAGE: 'strapi-admin-language',
  PROFILE_THEME: 'STRAPI_THEME',
};

/**
 * Retrieves a cookie value by name.
 * @param name - The name of the cookie.
 * @returns The cookie value or null if not found.
 */
export function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

/**
 * Retrieves the stored JWT token from local storage, session storage, or cookies.
 * @returns The token string or null.
 */
export function getStoredToken(): string | null {
  const tokenFromStorage =
    localStorage.getItem(STORAGE_KEYS.TOKEN) ?? sessionStorage.getItem(STORAGE_KEYS.TOKEN);

  if (tokenFromStorage) {
    try {
      return JSON.parse(tokenFromStorage);
    } catch {
      return tokenFromStorage; // return raw if not JSON
    }
  }

  return getCookieValue(STORAGE_KEYS.TOKEN);
}

/**
 * Retrieves the user's preferred language.
 * @returns The language code (default: 'en').
 */
export function getPreferedLanguage(): string {
  const language =
    localStorage.getItem(STORAGE_KEYS.PREFERED_LANGUAGE)?.replace(/^"|"$/g, '') || 'en';
  return language;
}

/**
 * Retrieves the user's profile theme preference.
 * @returns 'light', 'dark', 'system', or null.
 */
export function getProfileTheme(): 'light' | 'dark' | 'system' | null {
  const theme = localStorage.getItem(STORAGE_KEYS.PROFILE_THEME) as
    | 'light'
    | 'dark'
    | 'system'
    | null;
  return theme;
}
