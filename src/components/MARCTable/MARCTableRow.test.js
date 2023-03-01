import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { MARCTableRow } from './MARCTableRow';

import * as utils from '../../utils/fillEmptyFieldsWithValue';

expect.extend(toHaveNoViolations);

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

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MARC modifications table row', () => {
  afterEach(() => {
    mockedFunctions.forEach(fn => fn.mockClear());
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCTableRow();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
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
