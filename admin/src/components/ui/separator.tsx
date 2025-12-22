import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import styled from "styled-components";

type SeparatorOrientation = "horizontal" | "vertical";

type SeparatorProps = ComponentPropsWithoutRef<"div"> & {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
};

const StyledSeparator = styled.div<{
  $orientation?: "horizontal" | "vertical";
}>`
  flex-shrink: 0;
  background-color: ${props => props.theme.colors.neutral200};

  ${props => props.$orientation === "horizontal" && `
    height: 1px;
    width: 100%;
  `}

  ${props => props.$orientation === "vertical" && `
    height: 90%;
    width: 1px;
  `}
`;

const Separator = forwardRef<ElementRef<"div">, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, role, ...props }, ref) => {
    const computedRole = decorative ? undefined : (role ?? "separator");
    const ariaOrientation = computedRole === "separator" ? orientation : undefined;

    return (
      <StyledSeparator
        ref={ref}
        $orientation={orientation}
        role={computedRole}
        aria-orientation={ariaOrientation}
        aria-hidden={decorative ? true : undefined}
        {...props}
      />
    );
  },
);

Separator.displayName = "Separator";

export { Separator };