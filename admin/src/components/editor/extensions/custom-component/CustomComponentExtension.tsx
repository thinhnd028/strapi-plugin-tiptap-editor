
// src/tiptap/extensions/custom-component/CustomComponentExtension.ts
import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { CustomComponentRenderer } from "./CustomComponentRenderer";
import { CustomComponentInsertPopover } from "./CustomComponentInsertPopover";

import tippy from 'tippy.js';

const CustomComponent = Node.create({
  name: 'customComponent',
  group: 'block',
  atom: true,
  priority: 200,

  addAttributes() {
    return {
      type: { default: undefined },

      buttons: { default: undefined },
      align: { default: undefined },
      fullWidth: { default: undefined },

      label: { default: undefined },
      itemId: { default: undefined },
      layout: { default: undefined },
      maxItems: { default: undefined },

      entity_name: { default: undefined },
      entity_id: { default: undefined },
      custom_attrs: { default: undefined },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-node-type="customComponent"]',
        getAttrs(dom: any) {
          return {
            type: dom.getAttribute('data-component-type'),
          };
        },
      },
      {
        tag: 'div[data-custom-component="true"]',
        getAttrs(dom: any) {
          return {
            type: dom.getAttribute('data-type') || 'unknown',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }: { HTMLAttributes: Record<string, unknown>; node?: { attrs?: { type?: string } } }) {
    return [
      'div',
      {
        'data-custom-component': 'true',
        'data-type': node?.attrs?.type || 'unknown',
        class: 'custom-component-nodeview',
        style: 'margin: 1em 0; text-align: center;',
        ...HTMLAttributes,
      },
      0,
    ];
  },
  addNodeView() {
    try {
      return ReactNodeViewRenderer(CustomComponentRenderer);
    } catch (error) {
      console.warn('Failed to load CustomComponent node view', error);
      return ReactNodeViewRenderer(() => <div>Error loading component</div>)
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => {
          editor.chain().focus().insertContentAt(range, { type: this.name, attrs: props }).run();
        },
        items: ({ query }) => {
          const items = [
            { type: 'customButton', label: 'Button', description: 'Interactive button' },
            { type: 'customRelatedItem', label: 'Related Item', description: 'Show related item' },
            { type: 'customEntity', label: 'Custom', description: 'Show custom related entity' },
          ];
          return query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : items;
        },
        render: () => {
          let reactRenderer: any;
          let popup: any;

          return {
            onStart: props => {
              if (!props.editor.isEditable) return;
              reactRenderer = new ReactRenderer(CustomComponentInsertPopover, { props, editor: props.editor });
              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: reactRenderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate: props => {
              reactRenderer.updateProps(props);
              popup[0].setProps({ getReferenceClientRect: props.clientRect });
            },
            onExit: () => {
              popup?.[0].destroy();
              reactRenderer?.destroy();
            },
            onKeyDown: () => false,
          };
        },
      }),
    ];
  },
});

export default CustomComponent