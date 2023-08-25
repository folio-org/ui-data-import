import { renderHook } from '@testing-library/react';
import * as reactRedux from 'react-redux';

import '../../../../../test/jest/__mock__';
import { APPROVED_FIELD } from '../../../../utils';

import { useFieldMappingBoolFieldValue } from './useFieldMappingBoolFieldValue';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const booleanFieldAction = 'ALL_TRUE';

const initialStateValues = {
  form: {
    mappingProfilesForm: {
      values: {
        profile: {
          mappingDetails: {
            mappingFields: [{
              name: 'approved',
              path: 'order.po.approved',
              booleanFieldAction,
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

describe('useFieldMappingBoolFieldValue hook', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(selector => selector(initialStateValues));
  });

  afterEach(() => {
    useSelectorMock.mockClear();
  });

  it('should return correct value', () => {
    const { result } = renderHook(() => useFieldMappingBoolFieldValue(APPROVED_FIELD));
    const [expectedBooleanFieldAction] = result.current;

    expect(expectedBooleanFieldAction).toEqual(booleanFieldAction);
  });
});
