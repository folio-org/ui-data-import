import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import * as reactRedux from 'react-redux';

import '../../../../../test/jest/__mock__';
import { NOTES_FIELD } from '../../../../utils';

import { useFieldMappingRefValues } from './useFieldMappingRefValues';

const noteTitle = '"test note"';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('../../initialDetails', () => ({
  getReferenceTables: () => ({
    notes: [{
      order: 0,
      path: 'order.po.notes[]',
      fields: [{
        name: 'notes',
        enabled: 'true',
        required: false,
        path: 'order.po.notes[]',
        value: noteTitle,
        subfields: []
      }]
    }]
  })
}));

const useSelectorMock = reactRedux.useSelector;

const initialStateValues = {
  form: {
    mappingProfilesForm: {
      values: {
        profile: {
          mappingDetails: {
            mappingFields: [{
              name: 'volumes',
              path: 'order.poLine.physical.volumes[]',
              value: '',
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

describe('useFieldMappingRefValues hook', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(selector => selector(initialStateValues));
  });

  afterEach(() => {
    useSelectorMock.mockClear();
  });

  it('should return correct value', () => {
    const { result } = renderHook(() => useFieldMappingRefValues(NOTES_FIELD));
    const [notes] = result.current;
    const receivedNoteTitle = notes[0].fields[0].value;

    expect(receivedNoteTitle).toEqual(noteTitle);
  });
});
