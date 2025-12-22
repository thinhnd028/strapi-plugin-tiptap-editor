import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  
  &.peer-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const MandatorySpan = styled.span`
  color: ${props => props.theme.colors.danger500};
`;

const OptionalSpan = styled.span`
  color: ${props => props.theme.colors.neutral500};
`;

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  mandatory?: boolean;
  optional?: boolean;
}

const Label = forwardRef<
  ElementRef<"label">,
  LabelProps
>(({ children, mandatory, optional, ...props }, ref) => (
  <StyledLabel ref={ref} {...props}>
    {children}
    {mandatory ? <MandatorySpan>&nbsp;*</MandatorySpan> : null}
    {optional ? <OptionalSpan>&nbsp;(opsional)</OptionalSpan> : null}
  </StyledLabel>
));

Label.displayName = "Label";

export { Label };