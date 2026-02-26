import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { Slot } from "./Slot";

/* -------------------------------------------------------------------------------------------------
 * TooltipProvider - delay configuration
 * ------------------------------------------------------------------------------------------------- */

interface TooltipContextValue {
  delayDuration: number;
}

const TooltipContext = createContext<TooltipContextValue>({
  delayDuration: 500,
});

const TooltipProvider = ({
  children,
  delayDuration = 500,
}: {
  children?: React.ReactNode;
  delayDuration?: number;
}) => (
  <TooltipContext.Provider value={{ delayDuration }}>
    {children}
  </TooltipContext.Provider>
);

/* -------------------------------------------------------------------------------------------------
 * Tooltip Root - open state
 * ------------------------------------------------------------------------------------------------- */

interface TooltipRootContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const TooltipRootContext = createContext<TooltipRootContextValue | null>(null);

interface TooltipProps {
  children?: React.ReactNode;
  delayDuration?: number;
}

const Tooltip = ({ children, delayDuration }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <TooltipRootContext.Provider
      value={{ open, setOpen, triggerRef, contentRef }}
    >
      {children}
    </TooltipRootContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * TooltipTrigger
 * ------------------------------------------------------------------------------------------------- */

const TooltipTrigger = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
    children?: React.ReactNode;
  }
>(({ asChild, children, ...props }, ref) => {
  const ctx = useContext(TooltipRootContext);
  const providerCtx = useContext(TooltipContext);
  const delay =
    (props as { "data-delay"?: number })["data-delay"] ??
    providerCtx.delayDuration;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      ctx?.setOpen(true);
    }, delay);
  }, [delay, ctx]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    ctx?.setOpen(false);
  }, [ctx]);

  const handlePointerDown = useCallback(() => {
    hide();
  }, [hide]);

  const triggerProps: Record<string, unknown> = {
    ref: (node: HTMLElement | null) => {
      (ctx?.triggerRef as React.MutableRefObject<HTMLElement | null>).current =
        node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    onPointerEnter: show,
    onPointerLeave: hide,
    onPointerDown: handlePointerDown,
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return <Slot {...triggerProps}>{children}</Slot>;
  }

  return <span {...(triggerProps as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>;
});

TooltipTrigger.displayName = "TooltipTrigger";

/* -------------------------------------------------------------------------------------------------
 * TooltipContent - rendered in portal
 * ------------------------------------------------------------------------------------------------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const StyledContent = styled.div<{
  $x?: number;
  $y?: number;
  $visible?: boolean;
  $side?: string;
}>`
  position: fixed;
  left: ${(p) => p.$x ?? 0}px;
  top: ${(p) => p.$y ?? 0}px;
  transform: ${(p) =>
    p.$side === "top"
      ? "translate(-50%, -100%)"
      : p.$side === "bottom"
        ? "translate(-50%, 0)"
        : p.$side === "left"
          ? "translate(-100%, -50%)"
          : p.$side === "right"
            ? "translate(0, -50%)"
            : "translate(-50%, -100%)"};
  z-index: 1000;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.neutral200};
  background-color: ${(props) => props.theme.colors.neutral0};
  color: ${(props) => props.theme.colors.neutral800};
  padding: 6px 12px;
  font-size: 14px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  pointer-events: none;
  transform-origin: var(--tooltip-transform-origin, bottom center);
  animation: ${fadeIn} 0.1s ease-out;
`;

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ side = "top", sideOffset = 4, children, ...props }, ref) => {
    const ctx = useContext(TooltipRootContext);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const contentRef = useCallback(
      (node: HTMLDivElement | null) => {
        (ctx?.contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ctx, ref]
    );

    useLayoutEffect(() => {
      if (!ctx?.open || !ctx.triggerRef.current) return;
      const triggerEl = ctx.triggerRef.current;
      const rect = triggerEl.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (side) {
        case "top":
          x = rect.left + rect.width / 2;
          y = rect.top - sideOffset;
          break;
        case "bottom":
          x = rect.left + rect.width / 2;
          y = rect.bottom + sideOffset;
          break;
        case "left":
          x = rect.left - sideOffset;
          y = rect.top + rect.height / 2;
          break;
        case "right":
          x = rect.right + sideOffset;
          y = rect.top + rect.height / 2;
          break;
      }

      setPos({ x, y });
    }, [ctx?.open, side, sideOffset]);

    if (!ctx?.open) return null;

    const content = (
      <StyledContent
        ref={contentRef}
        $x={pos.x}
        $y={pos.y}
        $side={side}
        $visible={ctx.open}
        role="tooltip"
        {...props}
      >
        {children}
      </StyledContent>
    );

    return typeof document !== "undefined"
      ? createPortal(content, document.body)
      : null;
  }
);

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
