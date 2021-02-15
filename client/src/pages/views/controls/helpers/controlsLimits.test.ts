import { circularMax, minMax } from './controlsLimits';

describe('circularMax', () => {
  describe.each([
    [{ val: -2, max: 3 }, 1],
    [{ val: -1, max: 3 }, 2],
    [{ val: 0, max: 3 }, 0],
    [{ val: 1, max: 3 }, 1],
    [{ val: 2, max: 3 }, 2],
    [{ val: 3, max: 3 }, 0],
    [{ val: 4, max: 3 }, 1],
    [{ val: 5, max: 3 }, 2],
  ])('circularMax(%s)', ({ val, max }, expected) => {
    test(`returns ${expected}`, () => {
      expect(circularMax(val, max)).toBe(expected);
    });
  });

  describe.each([
    [{ val: 2, min: 0, max: 3 }, 2],
    [{ val: 5, min: 0, max: 3 }, 3],
    [{ val: -4, min: 0, max: 3 }, 0],
    [{ val: 0, min: 2, max: 5 }, 2],
  ])('minMax(%d)', ({ val, min, max }, expected) => {
    test(`returns ${expected}`, () => {
      expect(minMax(val, min, max)).toBe(expected);
    });
  });
});
