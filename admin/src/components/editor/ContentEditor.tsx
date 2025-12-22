import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Gapcursor from "@tiptap/extension-gapcursor";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import Underline from '@tiptap/extension-underline'

import { FileHandler } from "./extensions/fileHandler";
import { Iframe } from "./extensions/Iframe";
import { ImageExtension } from "./extensions/Image";
import { ImagePlaceholder } from "./extensions/ImagePlaceholder";
import { Link } from "./extensions/link";
import { SearchAndReplace } from "./extensions/searchAndReplace";
import {
    ToolbarButtons,
    type ToolbarButtonsType,
} from "./partials/ToolbarButtons";
import { BaseEditor, type BaseEditorProps } from "./BaseEditor";
import CustomComponent from "./extensions/custom-component/CustomComponentExtension";

export type ContentEditorProps = BaseEditorProps & {
    toolbars?: ToolbarButtonsType[];
};

function ContentEditor({
    toolbars = [
        "undo",
        "redo",
        "Separator",
        "heading",
        "color",
        "bold",
        "italic",
        "strikethrough",
        "link",
        "blockquote",
        "alignment",
        "lists",
        "horizontalRule",
        "Separator",
        "table",
        "image",
        "iframe",
        "emoji",
        // "HTMLToolbar"
    ],
    extensions = [],
    ...restProps
}: ContentEditorProps) {
    const editorRef = useRef<Editor | null>(null);

    return (
        <BaseEditor
            ref={editorRef}
            extensions={[
                ...extensions,
                Link,
                CustomComponent,
                SearchAndReplace,
                ImagePlaceholder,
                ImageExtension,
                FileHandler,
                Iframe,
                Color,
                Gapcursor,
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableHeader,
                TableCell,
                Highlight.configure({
                    multicolor: true,
                }),
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Emoji.configure({
                    enableEmoticons: true,
                    emojis: gitHubEmojis,
                }),
                Underline,
            ]}
            toolbar={<ToolbarButtons toolbars={toolbars} />}
            {...restProps}
        />
    );
}

ContentEditor.displayName = "ContentEditor";

export { ContentEditor };
