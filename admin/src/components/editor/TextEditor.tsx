import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import Underline from "@tiptap/extension-underline";

import { Link } from "./extensions/link";

import {
    ToolbarButtons,
    type ToolbarButtonsType,
} from "./partials/ToolbarButtons";
import { BaseEditor, type BaseEditorProps } from "./BaseEditor";

export type TextEditorProps = BaseEditorProps & {
    toolbars?: ToolbarButtonsType[];
};

const BASIC_TOOLBARS: ToolbarButtonsType[] = [
    "undo",
    "redo",
    "Separator",
    "bold",
    "italic",
    "strikethrough",
    "link",
    "hardBreak",
];

function TextEditor({ toolbars = BASIC_TOOLBARS, ...restProps }: TextEditorProps) {
    const editorRef = useRef<Editor | null>(null);

    return (
        <BaseEditor
            ref={editorRef}
            extensions={[Link, Underline]}
            toolbar={<ToolbarButtons toolbars={toolbars} />}
            {...restProps}
        />
    );
}

TextEditor.displayName = "TextEditor";

export { TextEditor };
