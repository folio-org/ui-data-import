import { fillEmptyFieldsWithValue } from '../fillEmptyFieldsWithValue';

describe('fillEmptyFieldsWithValue function', () => {
  it('fills empty fields with given value', () => {
    const fieldNames = ['key2', 'key4'];
    const valueToFill = 'value';
    const field = {
      key1: 'value1',
      key2: null,
      key3: 'value3',
      key4: '',
    };
    const expected = {
      key1: 'value1',
      key2: 'value',
      key3: 'value3',
      key4: 'value',
    };

    expect(fillEmptyFieldsWithValue(field, fieldNames, valueToFill)).toEqual(expected);
  });
});
