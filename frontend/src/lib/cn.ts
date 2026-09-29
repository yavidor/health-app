export type ClassValue = string | number | false | null | undefined | ClassValue[];

/** Minimal classname joiner. Falsy values are dropped. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  values.forEach(walk);
  return out.join(' ');
}
