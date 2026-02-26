import { forwardRef } from "react";
import { ItalicIcon } from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";

const ItalicIconStyled = styled(ItalicIcon)`
  width: 16px;
  height: 16px;
`;

const ItalicToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();
    return (
      <ToolbarButton
        tooltip="Italic"
        aria-label="Set italic"
        isActive={editor?.isActive("italic")}
        onClick={(e) => {
          editor?.chain().focus().toggleItalic().run();
          onClick?.(e);
        }}
        disabled={!editor?.can().chain().focus().toggleItalic().run()}
        ref={ref}
        {...props}
      >
        {children || <ItalicIconStyled />}
      </ToolbarButton>
    );
  },
);

ItalicToolbar.displayName = "ItalicToolbar";

export { ItalicToolbar };