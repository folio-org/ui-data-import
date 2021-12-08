import { compose } from '../compose';

describe('compose function', () => {
  it('composes function from right to left', () => {
    const square = x => x ** 2;
    const add = (x, y) => x + y;
    const double = x => 2 * x;
    const squared = square(add(2, 4));
    const doubled = double(square(add(5, 2)));

    expect(compose(square, add)(2, 4)).toBe(squared);
    expect(compose(double, square, add)(5, 2)).toBe(doubled);
  });
});
