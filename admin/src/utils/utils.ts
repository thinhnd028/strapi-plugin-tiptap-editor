import { clsx, type ClassValue } from "clsx"

/**
 * Merges class names using clsx.
 * @param inputs - Class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
