import { forwardRef } from "react";
import type { TooltipContentProps } from "../../ui/tooltip";
import { Toggle } from "../../ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import { ChevronDown } from "../icons";
import styled from "styled-components";

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean;
  tooltip?: React.ReactNode;
  tooltipOptions?: TooltipContentProps;
  hasArrow?: boolean;
}

// Styled Components
const StyledToggle = styled(Toggle) <{ $isActive?: boolean }>`
  width: auto;
  height: 32px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  ${props => props.$isActive && `
    background-color: ${props.theme.colors.neutral100};
  `}
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary100};
  }
`;

const StyledTooltipContent = styled(TooltipContent)`
  background-color: ${props => props.theme.colors.neutral800};
  color: ${props => props.theme.colors.neutral0};
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    { isActive, children, tooltip, className, tooltipOptions, hasArrow, ...props },
    ref,
  ) => {
    const toggleButton = (
      <StyledToggle
        size="sm"
        ref={ref}
        $isActive={isActive}
        {...props}
      >
        {children}
        {hasArrow && <ChevronDown width={12} height={12} style={{ opacity: 0.5 }} />}
      </StyledToggle>
    );

    if (!tooltip) {
      return toggleButton;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
        <StyledTooltipContent {...tooltipOptions}>
          {typeof tooltip === "string" ? <span>{tooltip}</span> : tooltip}
        </StyledTooltipContent>
      </Tooltip>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";

export default ToolbarButton;