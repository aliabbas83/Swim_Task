type ClassValue = string | false | null | undefined;

/** Joins truthy class names; tiny stand-in for `clsx`. */
export function cx(...classNames: ClassValue[]): string {
  return classNames.filter(Boolean).join(" ");
}
