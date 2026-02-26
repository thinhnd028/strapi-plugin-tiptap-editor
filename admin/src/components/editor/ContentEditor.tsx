import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import { Table } from "@tiptap/extension-table/table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

import { FileHandler } from "./extensions/fileHandler";
import { ImageExtension } from "./extensions/Image";
import { Iframe } from "./extensions/Iframe";
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
        "hardBreak",
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
            extensions={([
                ...extensions,
                Link,
                CustomComponent,
                SearchAndReplace,
                ImageExtension,
                FileHandler,
                Iframe,
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableHeader,
                TableCell,
                TaskList,
                TaskItem.configure({
                    nested: true,
                }),
                Emoji.configure({
                    enableEmoticons: true,
                    emojis: gitHubEmojis,
                }),
                Underline,
                CharacterCount.configure({
                    limit: null,
                }),
            ] as any)}
            toolbar={<ToolbarButtons toolbars={toolbars} />}
            {...restProps}
        />
    );
}

ContentEditor.displayName = "ContentEditor";

export { ContentEditor };
