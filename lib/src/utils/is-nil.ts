
export function isNil<T>(value: T | undefined | null): boolean {
  return value === null || value === undefined;
}
