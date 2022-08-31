import { coerceToBoolean } from './coerce-to-boolean';

describe('Utils: Coerce to boolean', () => {
  it('should coerce value to boolean', () => {
    expect(coerceToBoolean('1')).toEqual(true);
    expect(coerceToBoolean('false')).toEqual(false);
    expect(coerceToBoolean('true')).toEqual(true);
    expect(coerceToBoolean(true as unknown as string)).toEqual(true);
    expect(coerceToBoolean(false as unknown as string)).toEqual(false);
  });
});
