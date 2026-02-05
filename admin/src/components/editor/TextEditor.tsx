import { useRef } from "react";

import { type Editor } from "@tiptap/core";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import Underline from '@tiptap/extension-underline'

import { Link } from "./extensions/link";

import {
    ToolbarButtons,
    type ToolbarButtonsType,
} from "./partials/ToolbarButtons";
import { BaseEditor, type BaseEditorProps } from "./BaseEditor";

export type TextEditorProps = BaseEditorProps & {
    toolbars?: ToolbarButtonsType[];
};

function TextEditor({ toolbars, ...restProps }: TextEditorProps) {
    const editorRef = useRef<Editor | null>(null);

    return (
        <BaseEditor
            ref={editorRef}
            extensions={[
                Link,
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

TextEditor.displayName = "TextEditor";

export { TextEditor };
