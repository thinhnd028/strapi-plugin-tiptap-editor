import pluginPkg from '../../package.json';
import { Core } from '@strapi/strapi';

export default {
  register: ({ strapi }: { strapi: Core.Strapi }) => {
    strapi.customFields.register({
      name: "tiptap",
      plugin: "tiptap-editor",
      type: "json",
      inputSize: {
        default: 12,
        isResizable: true,
      },
    });
  }
}
