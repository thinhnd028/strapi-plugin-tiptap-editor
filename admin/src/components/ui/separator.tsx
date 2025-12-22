import { forwardRef } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import styled from "styled-components";

const StyledSeparator = styled(SeparatorPrimitive.Root) <{
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

const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <StyledSeparator
      ref={ref}
      decorative={decorative}
      $orientation={orientation}
      {...props}
    />
  ),
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };