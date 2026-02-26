import { forwardRef, useCallback, useState } from "react";
import { Link2 } from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import { LinkEditBlock } from "../partials/LinkEditBlock";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import { Popover } from "@strapi/design-system";
import styled from "styled-components";

const LinkIcon = styled(Link2)`
  width: 20px;
  height: 20px;
`;

const PopoverContent = styled(Popover.Content)`
  width: 100%;
  min-width: 320px;
  padding: 12px;
`;

const LinkToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    const [open, setOpen] = useState(false);

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    const onSetLink = useCallback(
      (url: string, text?: string, openInNewTab?: boolean) => {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .insertContent({
            type: "text",
            text: text || url,
            marks: [
              {
                type: "link",
                attrs: {
                  href: url,
                  target: openInNewTab ? "_blank" : "",
                },
              },
            ],
          })
          .setLink({ href: url })
          .run();

        editor.commands.enter();
      },
      [editor],
    );

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <ToolbarButton
            isActive={editor.isActive("link")}
            tooltip="Link"
            aria-label="Insert link"
            disabled={editor.isActive("codeBlock")}
            {...props}
          >
            <LinkIcon />
          </ToolbarButton>
        </Popover.Trigger>
        <PopoverContent align="start" side="bottom">
          <LinkEditBlock onSave={onSetLink} defaultText={text} />
        </PopoverContent>
      </Popover.Root>
    );
  },
);

export { LinkToolbar };