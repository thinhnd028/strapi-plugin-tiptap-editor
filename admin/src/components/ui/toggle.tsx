import { forwardRef } from "react";
import styled, { css } from "styled-components";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  pressed?: boolean;
  /** Alias for pressed - used by ToolbarButton */
  isActive?: boolean;
  /** @internal Radix-compat data-state */
  "data-state"?: "on" | "off";
}

const StyledToggle = styled.button<{
  $variant?: "default" | "outline";
  $size?: "default" | "sm" | "lg";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  gap: 8px;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.primary500};
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* Active state - matches data-state="on" from Radix */
  &[data-state="on"],
  &[aria-pressed="true"] {
    background-color: ${(props) => props.theme.colors.neutral100};
    color: ${(props) => props.theme.colors.neutral900};
  }

  /* Variant styles */
  ${(props) => {
    switch (props.$variant) {
      case "outline":
        return css`
          border: 1px solid ${props.theme.colors.neutral300};
          background-color: transparent;
          color: ${props.theme.colors.neutral700};

          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.neutral100};
            color: ${props.theme.colors.neutral800};
          }
        `;
      default:
        return css`
          background-color: transparent;
          color: ${props.theme.colors.neutral700};

          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.neutral100};
            color: ${props.theme.colors.neutral800};
          }
        `;
    }
  }}

  /* Size styles */
  ${(props) => {
    switch (props.$size) {
      case "sm":
        return css`
          height: 32px;
          padding: 0 6px;
          min-width: 32px;
        `;
      case "lg":
        return css`
          height: 40px;
          padding: 0 16px;
          min-width: 40px;
        `;
      default:
        return css`
          height: 36px;
          padding: 0 8px;
          min-width: 36px;
        `;
    }
  }}
`;

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      variant = "default",
      size = "default",
      pressed,
      isActive,
      "data-state": dataState,
      ...props
    },
    ref
  ) => {
    const isOn = pressed ?? isActive ?? (dataState === "on");
    const computedState = dataState ?? (isOn ? "on" : "off");

    return (
      <StyledToggle
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isOn}
        data-state={computedState}
        $variant={variant}
        $size={size}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

const toggleVariants = {
  default: "default",
  outline: "outline",
  sizes: {
    default: "default",
    sm: "sm",
    lg: "lg",
  },
};

export { Toggle, toggleVariants };
