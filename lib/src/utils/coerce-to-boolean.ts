
export function coerceToBoolean(value: string): boolean {
  return value != null && `${value}` !== 'false';
}
