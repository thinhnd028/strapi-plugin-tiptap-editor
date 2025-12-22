/**
 * Prefixes a URL with the Strapi backend URL if it's a relative path.
 * @param url - The URL to process.
 * @returns The full URL.
 */
export const prefixWithBackendUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('//')) return url;

  // @ts-ignore - Strapi global object
  const backendURL = window.strapi?.backendURL || '';
  return `${backendURL}${url}`;
};
