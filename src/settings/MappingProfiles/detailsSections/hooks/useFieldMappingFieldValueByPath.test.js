import { renderHook } from '@testing-library/react-hooks';
import * as reactRedux from 'react-redux';

import '../../../../../test/jest/__mock__';
import { CREATE_INVENTORY_ERESOURCE_PATH } from '../constants';

import { useFieldMappingFieldValueByPath } from './useFieldMappingFieldValueByPath';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const createInventoryValue = '"Instance, Holding, Item"';

const initialStateValues = {
  form: {
    mappingProfilesForm: {
      values: {
        profile: {
          mappingDetails: {
            mappingFields: [{
              name: 'createInventory',
              path: 'order.poLine.eresource.createInventory',
              value: createInventoryValue,
              subfileds: [],
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

describe('useFieldMappingFieldValueByPath', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(selector => selector(initialStateValues));
  });

  afterEach(() => {
    useSelectorMock.mockClear();
  });

  it('should return correct value', () => {
    const { result } = renderHook(() => useFieldMappingFieldValueByPath(CREATE_INVENTORY_ERESOURCE_PATH));

    const [receivedValue] = result.current;

    expect(receivedValue).toEqual(createInventoryValue);
  });
});
