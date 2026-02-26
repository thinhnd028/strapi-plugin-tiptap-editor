import { forwardRef } from "react";

import { Undo2 } from "lucide-react";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";

const UndoIcon = styled(Undo2)`
  width: 16px;
  height: 16px;
`;
const UndoToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useEditorContext();

    return (
      <ToolbarButton
        onClick={() => (editor.chain().focus() as unknown as { undo: () => { run: () => boolean } }).undo().run()}
        disabled={!(editor?.can() as unknown as { undo: () => boolean }).undo()}
        tooltip="Undo"
        aria-label="Undo"
        ref={ref}
        {...props}
      >
        {children || <UndoIcon />}
      </ToolbarButton>
    );
  },
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };
