import { useCallback } from "react";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Bulletlist from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import {
  type Content,
  type Editor,
  type Extensions,
  useEditor as useEditorPrimitive,
  type UseEditorOptions as UseEditorPrimitiveOptions,
} from "@tiptap/react";

import { cn } from "../../utils/utils";

import { ResetMarksOnEnter } from "./extensions/resetMarksOnEnter";
import { CustomHeading } from "./extensions/Heading";
import { useDebounceCallback } from "../../hooks/useDebounceCallback";

/**
 * Options for the useEditor hook.
 * Extends Tiptap's built-in options with additional features like throttling and output format.
 */
export interface UseEditorOptions
  extends Omit<UseEditorPrimitiveOptions, "onUpdate" | "onBlur"> {
  value?: Content;
  throttleDelay?: number;
  output?: "html" | "json" | "text";
  onUpdate?: (value: Content) => void;
  onBlur?: (content: Content) => void;
}

export const createExtensions = (): Extensions => [
  Document,
  Blockquote,
  Bulletlist,
  OrderedList,
  ListItem,
  CustomHeading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Paragraph,
  HorizontalRule,
  Text,
  HardBreak,
  Bold,
  Italic,
  Strike,
  Dropcursor,
  Gapcursor,
  History.configure({
    depth: 50,
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Color,
  ResetMarksOnEnter,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
];

const getOutput = (
  editor: Editor,
  output: UseEditorOptions["output"],
): Content => {
  if (output === "html") {
    return editor.getHTML();
  }

  if (output === "json") {
    return editor.getJSON();
  }

  return editor.getText();
};

/**
 * Hook to initialize and configure the Tiptap editor.
 * Handles value updates, throttling, and output formatting.
 */
export const useEditor = ({
  content,
  extensions = [],
  editorProps: { attributes: editorAttributes = {}, ...editorProps } = {},
  throttleDelay = 0,
  output,
  onUpdate,
  onCreate,
  onBlur,
  value,
  ...options
}: UseEditorOptions) => {
  const throttledSetValue = useDebounceCallback((v: Content) => {
    onUpdate?.(v);
  }, throttleDelay);

  const handleUpdate = useCallback(
    (editor: Editor) => {
      return throttledSetValue(getOutput(editor, output));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [output],
  );

  const handleCreate = useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value],
  );

  const handleBlur = useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur],
  );

  const editor = useEditorPrimitive({
    extensions: [...extensions, ...createExtensions()].filter(
      (ext, index, self) =>
        self.findIndex((e) => e.name === ext.name) === index,
    ),
    content,
    immediatelyRender: false,
    editorProps: {
      ...editorProps,
      attributes: {
        ...editorAttributes,
        class: cn("prose dark:prose-invert focus:outline-none", (editorAttributes as any).class),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    ...options,
  });

  return editor;
};
