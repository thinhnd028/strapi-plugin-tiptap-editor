import * as React from "react";

/**
 * Slot - merges props and ref onto the single child element.
 * Replicates the asChild pattern from Radix without @radix-ui/react-slot.
 */
const Slot = React.forwardRef<
  unknown,
  React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  }
>((props, ref) => {
  const { children, ...rest } = props;
  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    return null;
  }

  return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
    ...mergeProps(rest, (child as React.ReactElement).props as Record<string, unknown>),
    ref: mergeRefs(
      ref,
      (child as React.ReactElement & { ref?: React.Ref<unknown> }).ref
    ),
  });
});

Slot.displayName = "Slot";

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...childProps };

  for (const key in slotProps) {
    if (key === "children") continue;
    const slotValue = slotProps[key];
    const childValue = merged[key];

    if (
      key === "className" &&
      typeof slotValue === "string" &&
      typeof childValue === "string"
    ) {
      merged[key] = [childValue, slotValue].filter(Boolean).join(" ");
    } else if (
      key.startsWith("on") &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...args: unknown[]) => void)(...args);
        (slotValue as (...args: unknown[]) => void)(...args);
      };
    } else if (slotValue !== undefined) {
      merged[key] = slotValue;
    }
  }

  return merged;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.Ref<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export { Slot };
