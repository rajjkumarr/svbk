/**
 * Merge class names. Pass strings; falsy values are filtered out.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
