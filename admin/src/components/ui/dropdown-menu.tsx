import React, { createContext, forwardRef, useContext, useState } from "react";
import { Popover } from "@strapi/design-system";
import { Slot } from "./Slot";
import styled, { css } from "styled-components";

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu - uses Strapi Popover
 * ------------------------------------------------------------------------------------------------- */

const DropdownMenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const DropdownMenu = ({
  children,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
}: {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <Popover.Root open={open} onOpenChange={(next) => setOpen(next)}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {children as any}
      </Popover.Root>
    </DropdownMenuContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger - wraps Popover.Trigger with asChild
 * ------------------------------------------------------------------------------------------------- */

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    children?: React.ReactNode;
  }
>(({ asChild, children, disabled, ...props }, ref) => (
  <Popover.Trigger disabled={disabled}>
    {asChild && children ? (
      <Slot ref={ref} {...props}>
        {children}
      </Slot>
    ) : (
      <button ref={ref} type="button" disabled={disabled} {...props}>
        {children}
      </button>
    )}
  </Popover.Trigger>
));

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* -------------------------------------------------------------------------------------------------
 * Content & Item styles
 * ------------------------------------------------------------------------------------------------- */

const ContentStyles = css`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.neutral200};
  background-color: ${(props) => props.theme.colors.neutral0};
  color: ${(props) => props.theme.colors.neutral800};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 4px;
`;

const ItemStyles = css`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  gap: 8px;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.1s ease-in-out;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: ${(props) => props.theme.colors.neutral100};
  }

  &:focus {
    background-color: ${(props) => props.theme.colors.neutral100};
    color: ${(props) => props.theme.colors.neutral900};
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * ------------------------------------------------------------------------------------------------- */

const StyledContent = styled(Popover.Content)`
  ${ContentStyles}
`;

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    loop?: boolean;
    onCloseAutoFocus?: (e: Event) => void;
  }
>(
  (
    {
      align = "start",
      sideOffset = 4,
      side = "bottom",
      onCloseAutoFocus,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledContent
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        onCloseAutoFocus={onCloseAutoFocus}
        {...props}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {children as any}
      </StyledContent>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * ------------------------------------------------------------------------------------------------- */

const DropdownMenuGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} role="group" {...props} />);

DropdownMenuGroup.displayName = "DropdownMenuGroup";

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * ------------------------------------------------------------------------------------------------- */

const StyledItem = styled.button<{ $inset?: boolean }>`
  ${ItemStyles}
  ${(props) => props.$inset && "padding-left: 32px;"}
`;

const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    inset?: boolean;
    onSelect?: (e: Event) => void;
  }
>(({ inset, onSelect, onClick, ...props }, ref) => {
  const ctx = useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onSelect?.(e as unknown as Event);
    ctx?.setOpen(false);
  };

  return (
    <StyledItem
      ref={ref}
      $inset={inset}
      data-dropdown-menu-item
      type="button"
      onClick={handleClick}
      {...props}
    />
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

/* -------------------------------------------------------------------------------------------------
 * Placeholder exports for compatibility (not implemented - use DropdownMenuItem)
 * ------------------------------------------------------------------------------------------------- */

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) =>
  children;
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) =>
  children;
const DropdownMenuRadioGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => children;
const DropdownMenuSubTrigger = forwardRef<HTMLButtonElement, never>(() => null);
const DropdownMenuSubContent = forwardRef<HTMLDivElement, never>(() => null);
const DropdownMenuCheckboxItem = forwardRef<HTMLButtonElement, never>(() => null);
const DropdownMenuRadioItem = forwardRef<HTMLButtonElement, never>(() => null);
const DropdownMenuLabel = forwardRef<HTMLSpanElement, never>(() => null);
const DropdownMenuSeparator = forwardRef<HTMLDivElement, never>(() => null);
const DropdownMenuShortcut = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} />
);

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
