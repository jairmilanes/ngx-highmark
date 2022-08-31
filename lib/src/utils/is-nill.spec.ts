import { isNil } from './is-nil';

describe('Utils: Is Nil', () => {
  it('should return true if value is undefined or null', () => {
    expect(isNil(null)).toEqual(true);
    expect(isNil(undefined)).toEqual(true);
  });

  it('should return false if value is anything other than undefined or null', () => {
    expect(isNil('test')).toEqual(false);
    expect(isNil(10)).toEqual(false);
    expect(isNil('10')).toEqual(false);
    expect(isNil([])).toEqual(false);
    expect(isNil({})).toEqual(false);
    expect(isNil(false)).toEqual(false);
    expect(isNil(true)).toEqual(false);
  });
});
