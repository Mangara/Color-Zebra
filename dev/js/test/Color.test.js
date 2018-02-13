jQuery = 0; // No jQuery required for this, but must be defined
require('../Color');

test('desaturate', () => {
  expect(ColorZebra.Color.desaturateLAB([0, 0, 0])).toEqual([0, 0, 0]);
  expect(ColorZebra.Color.desaturateLAB([3, 3, 3])).toEqual([3, 1, 1]);
});