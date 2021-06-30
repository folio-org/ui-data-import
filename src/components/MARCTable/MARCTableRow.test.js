import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { MARCTableRow } from './MARCTableRow';

import * as utils from '../../utils/fillEmptyFieldsWithValue';

const onFieldUpdate = jest.fn();
const removeSubfieldRows = jest.fn();
const removeSubactionFromRow = jest.fn();
const removeDataValuesFromRow = jest.fn();
const fillEmptyFieldsWithValue = jest.spyOn(utils, 'fillEmptyFieldsWithValue');

const mockedFunctions = [onFieldUpdate, removeSubfieldRows, removeSubactionFromRow,
  removeDataValuesFromRow, fillEmptyFieldsWithValue];
const columns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
  'subfield', 'subaction', 'data', 'position', 'addRemove'];

const renderMARCTableRow = () => {
  const component = () => (
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
      columns={columns}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
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
