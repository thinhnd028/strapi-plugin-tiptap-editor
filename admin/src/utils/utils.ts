/**
 * Merges class names.
 * @param inputs - Class values to merge (strings, undefined).
 * @returns The merged class string.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
