// Import necessary styles and utilities
import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';

// Export public API
export * from './exports';

/**
 * Strapi Plugin Entry Point
 * Registers the Tiptap Editor plugin and its custom fields.
 */
export default {
  /**
   * Registers the plugin with the Strapi admin application.
   * @param app - The Strapi administration application instance.
   */
  async register(app: any) {
    // Register the "Tiptap" custom field
    app.customFields.register({
      name: "tiptap",
      pluginId: PLUGIN_ID,
      type: "richtext",
      intlLabel: {
        id: `${PLUGIN_ID}.tiptap.label`,
        defaultMessage: "Tiptap Editor",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.tiptap.description`,
        defaultMessage: "Powerful rich text editor",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/TiptapEditorInput'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'tiptap-editor.section.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.preset',
                type: 'select',
                intlLabel: {
                  id: 'tiptap-editor.options.preset.label',
                  defaultMessage: 'Preset',
                },
                intlDescription: {
                  id: 'tiptap-editor.options.preset.description',
                  defaultMessage: 'Select the editor mode',
                },
                defaultValue: 'basic',
                options: [
                  {
                    key: 'basic',
                    value: 'basic',
                    metadatas: {
                      intlLabel: {
                        id: 'tiptap-editor.options.preset.basic',
                        defaultMessage: 'Basic (Recommended)',
                      },
                    },
                  },
                  {
                    key: 'full',
                    value: 'full',
                    metadatas: {
                      intlLabel: {
                        id: 'tiptap-editor.options.preset.full',
                        defaultMessage: 'Full',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  },

  /**
   * Registers translations for the plugin.
   * @param {Object} context - Context object containing supported locales.
   * @param {string[]} context.locales - Array of locale codes.
   * @returns {Promise<Array>} Array of translation objects.
   */
  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
