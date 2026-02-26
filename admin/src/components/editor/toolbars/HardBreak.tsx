import { forwardRef } from "react";
import { WrapText } from "../icons";
import { useEditorContext } from "../partials/EditorProvider";
import ToolbarButton, { ToolbarButtonProps } from "../partials/ToolbarButton";
import styled from "styled-components";

// Styled Components
const HardBreakIcon = styled(WrapText)`
  width: 16px;
  height: 16px;
`;

const HardBreakToolbar = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ className, onClick, children, ...props }, ref) => {
        const { editor } = useEditorContext();
        return (
            <ToolbarButton
                tooltip="Hard Break"
                aria-label="Insert hard break"
                onClick={(e) => {
                    editor?.chain().focus().setHardBreak().run();
                    onClick?.(e);
                }}
                ref={ref}
                {...props}
            >
                {children || <HardBreakIcon />}
            </ToolbarButton>
        );
    },
);

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };
