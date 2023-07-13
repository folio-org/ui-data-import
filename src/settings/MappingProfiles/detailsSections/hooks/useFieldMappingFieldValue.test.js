import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';

import '../../../../../test/jest/__mock__';
import { CURRENCY_FIELD } from '../../../../utils';

import { useFieldMappingFieldValue } from './useFieldMappingFieldValue';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const currency = 'USD';

const initialStateValues = {
  form: {
    mappingProfilesForm: {
      values: {
        profile: {
          mappingDetails: {
            mappingFields: [{
              name: 'currency',
              path: 'order.poLine.cost.currency',
              value: currency,
              subfields: [],
              enabled: 'true',
              required: false,
            }]
          }
        }
      }
    }
  }
};

const useSelectorMock = reactRedux.useSelector;

describe('useFieldMappingFieldValue hook', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(selector => selector(initialStateValues));
  });

  afterEach(() => {
    useSelectorMock.mockClear();
  });

  it('should return correct value', () => {
    const { result } = renderHook(() => useFieldMappingFieldValue(CURRENCY_FIELD));

    const [receivedValue] = result.current;

    expect(receivedValue).toEqual(currency);
  });
});
