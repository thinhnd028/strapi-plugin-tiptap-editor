import { Core } from '@strapi/strapi';
import pluginPkg from '../../package.json';

export default {
  register: ({ strapi }: { strapi: Core.Strapi }) => {
    strapi.customFields.register({
      name: "tiptap",
      plugin: pluginPkg.strapi.name,
      type: "richtext",
      inputSize: {
        default: 12,
        isResizable: true,
      },
    });
  }
}
