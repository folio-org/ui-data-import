import { renderHook } from '@testing-library/react-hooks';

import '../../../../../test/jest/__mock__';

import { useDisabledOrderFields } from './useDisabledOrderFields';
import { useFieldMappingFieldValue } from './useFieldMappingFieldValue';

import {
  ORDER_FORMATS,
  PO_STATUS,
} from '../constants';

jest.mock('./useFieldMappingFieldValue', () => ({
  useFieldMappingFieldValue: jest.fn(),
}));

describe('useDisabledOrderFields', () => {
  afterEach(() => {
    useFieldMappingFieldValue.mockClear();
  });

  it('should disable create inventory when the PO status is open', () => {
    useFieldMappingFieldValue.mockImplementation(() => [PO_STATUS.OPEN, ORDER_FORMATS.PE_MIX]);
    const { result } = renderHook(() => useDisabledOrderFields());

    const expectedResult = {
      dismissCreateInventory: true,
      dismissPhysicalDetails: false,
      dismissElectronicDetails: false,
    };

    expect(result.current).toEqual(expectedResult);
  });

  it('should disable physical details when the order format is electronic', () => {
    useFieldMappingFieldValue.mockImplementation(() => [PO_STATUS.PENDING, ORDER_FORMATS.ELECTRONIC_RESOURCE]);
    const { result } = renderHook(() => useDisabledOrderFields());

    const expectedResult = {
      dismissCreateInventory: false,
      dismissPhysicalDetails: true,
      dismissElectronicDetails: false,
    };

    expect(result.current).toEqual(expectedResult);
  });

  it('should disable electronic details when the order format is physical', () => {
    useFieldMappingFieldValue.mockImplementation(() => [PO_STATUS.PENDING, ORDER_FORMATS.PHYSICAL_RESOURCE]);
    const { result } = renderHook(() => useDisabledOrderFields());

    const expectedResult = {
      dismissCreateInventory: false,
      dismissPhysicalDetails: false,
      dismissElectronicDetails: true,
    };

    expect(result.current).toEqual(expectedResult);
  });

  it('or other', () => {
    useFieldMappingFieldValue.mockImplementation(() => [PO_STATUS.PENDING, ORDER_FORMATS.OTHER]);
    const { result } = renderHook(() => useDisabledOrderFields());

    const expectedResult = {
      dismissCreateInventory: false,
      dismissPhysicalDetails: false,
      dismissElectronicDetails: true,
    };

    expect(result.current).toEqual(expectedResult);
  });
});
