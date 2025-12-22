import { PLUGIN_ID } from '../pluginId';

/**
 * Generates a translation key prefixed with the plugin ID.
 * @param id - The translation identifier.
 * @returns The namespaced translation key.
 */
const getTranslation = (id: string): string => `${PLUGIN_ID}.${id}`;

export { getTranslation };
