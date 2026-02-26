import { forwardRef } from "react";
import { Redo2 } from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";

const RedoIcon = styled(Redo2)`
  width: 16px;
  height: 16px;
`;

const RedoToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        tooltip="Redo"
        aria-label="Redo"
        onClick={(e) => {
          (editor?.chain().focus() as unknown as { redo: () => { run: () => boolean } })?.redo().run();
          onClick?.(e);
        }}
        disabled={!(editor?.can().chain().focus() as unknown as { redo: () => { run: () => boolean } })?.redo().run()}
        ref={ref}
        {...props}
      >
        {children || <RedoIcon />}
      </ToolbarButton>
    );
  },
);

RedoToolbar.displayName = "RedoToolbar";

export { RedoToolbar };