import React from 'react';
import {
  render,
  fireEvent,
} from '@testing-library/react';

import '../../../test/jest/__mock__';
import { Intl } from '../../../test/jest/__mock__/intl.mock';
import { reduxFormMock } from '../../../test/jest/__mock__/reduxForm.mock';

import { MARCTableRow } from './MARCTableRow';

const onFieldUpdate = jest.fn();
const removeSubfieldRows = jest.fn();
const removeSubactionFromRow = jest.fn();
const removeDataValuesFromRow = jest.fn();
const fillEmptyFieldsWithValue = jest.fn();

const mockedFunctions = [onFieldUpdate, removeSubfieldRows, removeSubactionFromRow,
  removeDataValuesFromRow, fillEmptyFieldsWithValue];

const renderMARCTableRow = () => {
  const component = () => (
    <Intl>
      <MARCTableRow
        subfieldIndex={0}
        name="profile.mappingDetails.marcMappingDetails[0]"
        order={0}
        columnWidths={{}}
        onAddSubfieldRow={() => {}}
        onRemoveSubfieldRow={() => {}}
        onFieldUpdate={onFieldUpdate}
        removeSubfieldRows={removeSubfieldRows}
        removeSubactionFromRow={removeSubactionFromRow}
        removeDataValuesFromRow={removeDataValuesFromRow}
        fillEmptyFieldsWithValue={fillEmptyFieldsWithValue}
      />
    </Intl>
  );

  return render(reduxFormMock(component));
};

describe('MARC modifications table row', () => {
  afterEach(() => {
    mockedFunctions.forEach(fn => fn.mockClear());
  });

  describe('when "Action" field changed', () => {
    it('table should be updated', () => {
      const { getByLabelText } = renderMARCTableRow();

      fireEvent.change(getByLabelText('Select action'), { target: { value: 'ADD' } });
      fireEvent.change(getByLabelText('Select action'), { target: { value: 'DELETE' } });
      fireEvent.change(getByLabelText('Select action'), { target: { value: 'EDIT' } });
      fireEvent.change(getByLabelText('Select action'), { target: { value: 'MOVE' } });

      expect(onFieldUpdate).toHaveBeenCalledTimes(4);
    });

    it('to "Delete" then fill in empty fields wil "*"', () => {
      const { getByLabelText } = renderMARCTableRow();

      fireEvent.change(getByLabelText('Select action'), { target: { value: 'DELETE' } });

      expect(fillEmptyFieldsWithValue).toHaveBeenCalledTimes(1);
    });
  });
});
