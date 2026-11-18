import { isNightShift } from './night-shift';

describe('isNightShift', () => {
  const at = (h: number, m = 0) => new Date(2026, 0, 1, h, m);

  it('is true from midnight up to 4:59', () => {
    expect(isNightShift(at(0))).toBeTrue();
    expect(isNightShift(at(2, 30))).toBeTrue();
    expect(isNightShift(at(4, 59))).toBeTrue();
  });

  it('is false from 5:00 on and in the evening', () => {
    expect(isNightShift(at(5))).toBeFalse();
    expect(isNightShift(at(12))).toBeFalse();
    expect(isNightShift(at(23, 59))).toBeFalse();
  });
});
