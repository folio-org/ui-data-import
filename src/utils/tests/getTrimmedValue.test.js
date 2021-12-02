import { getTrimmedValue } from '../getTrimmedValue';

describe('getTrimmedValue function', () => {
  it('should trim given value', () => {
    const value1 = '   trimMe ';
    const value2 = '  left';
    const value3 = 'right  ';

    expect(getTrimmedValue(value1)).toBe('trimMe');
    expect(getTrimmedValue(value2)).toBe('left');
    expect(getTrimmedValue(value3)).toBe('right');
    expect(getTrimmedValue('    ')).toBe('');
  });
});
