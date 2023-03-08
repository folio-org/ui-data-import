import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { MARCTable } from './MARCTable';

const onChange = jest.fn();
const initialFields = [
  {
    order: 0,
    field: { subfields: [{}] },
  },
];

const initialColumns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
  'subfield', 'subaction', 'data', 'position', 'addRemove'];

const renderMARCTable = (fields, columns) => {
  const component = () => (
    <MARCTable
      fields={fields}
      columns={columns}
      onChange={onChange}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MARC modifications table', () => {
  afterEach(() => {
    onChange.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCTable(initialFields, initialColumns);

    await runAxeTest({ rootNode: container });
  });

  describe('when "Add new row" button clicked', () => {
    it('one more row should be added', () => {
      const updatedRows = [...initialFields, {
        order: 1,
        field: { subfields: [{}] },
      }];
      const { getByLabelText } = renderMARCTable(initialFields, initialColumns);

      fireEvent.click(getByLabelText('Add a new field'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(updatedRows);
    });
  });

  describe('when "Remove row" button clicked', () => {
    it('one row should be removed', () => {
      const fields = [...initialFields, {
        order: 1,
        field: { subfields: [{}] },
      }];
      const { getAllByLabelText } = renderMARCTable(fields, initialColumns);

      fireEvent.click(getAllByLabelText('Delete this field')[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(initialFields);
    });
  });

  describe('when "Move row" button clicked', () => {
    it('one row should be moved', () => {
      const fields = [...initialFields, {
        order: 1,
        field: { subfields: [{}] },
      }];
      const { getByLabelText } = renderMARCTable(fields, initialColumns);

      fireEvent.click(getByLabelText('Move field up a row'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(fields);
    });
  });

  describe('when "Add subfield row" button clicked', () => {
    it('one subfield should be added', () => {
      const fields = [
        {
          order: 0,
          action: 'ADD',
          field: { subfields: [{}] },
        },
      ];
      const updatedFields = [
        {
          order: 0,
          action: 'ADD',
          field: { subfields: [{}, {}] },
        },
      ];
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'ADD_SUBFIELD' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(updatedFields);
    });
  });

  describe('when "Remove subfield row" button clicked', () => {
    it('one row should be removed', () => {
      const fields = [{
        order: 0,
        action: 'ADD',
        field: { subfields: [{ subaction: 'ADD_SUBFIELD' }, {}] },
      }];
      const updatedFields = [{
        order: 0,
        action: 'ADD',
        field: { subfields: [{ subaction: null }] },
      }];
      const { getAllByLabelText } = renderMARCTable(fields, initialColumns);

      fireEvent.click(getAllByLabelText('Delete this field')[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(updatedFields);
    });
  });

  describe('when there are no data received', () => {
    it('table should have initial row', () => {
      const { getAllByTestId } = renderMARCTable(initialFields, initialColumns);

      expect(getAllByTestId('marc-table-row').length).toBe(1);
    });

    it('and re-ordering arrows should not be hidden', () => {
      const { queryByTestId } = renderMARCTable(initialFields, initialColumns);

      expect(queryByTestId('marc-table-arrow-up')).toBeNull();
      expect(queryByTestId('marc-table-arrow-down')).toBeNull();
    });
  });

  describe('when there are received data', () => {
    const fields = [...initialFields,
      {
        order: 1,
        field: { subfields: [{}] },
      }, {
        order: 2,
        action: 'ADD',
        field: { subfields: [{ subaction: 'ADD_SUBFIELD' }, {}] },
      },
    ];

    it('table should have 3 rows', () => {
      const { getAllByTestId } = renderMARCTable(fields, initialColumns);

      expect(getAllByTestId('marc-table-row').length).toBe(3);
    });

    it('re-ordering arrows should be visible', () => {
      const { getAllByTestId } = renderMARCTable(fields, initialColumns);

      expect(getAllByTestId('marc-table-arrow-up')).toBeDefined();
      expect(getAllByTestId('marc-table-arrow-down')).toBeDefined();
    });

    it('subfield should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-subfield-row')).toBeDefined();
    });
  });

  describe('when "Add" action selected', () => {
    const fields = [
      {
        order: 0,
        action: 'ADD',
        field: { subfields: [{}] },
      },
    ];

    it('"Subaction" dropdown should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields, initialColumns);

      expect(getByText('Add subfield')).toBeDefined();
    });

    it('"Data" field should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-data')).toBeDefined();
    });

    it('"Position" dropdown should not be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });
  });

  describe('when "Delete" action selected', () => {
    const fields = [
      {
        order: 0,
        action: 'DELETE',
        field: { subfields: [{}] },
      },
    ];

    it('"Subaction" dropdown should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-subaction')).toBeNull();
    });

    it('"Data" field should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-data')).toBeNull();
    });

    it('"Position" dropdown should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });
  });

  describe('when "Edit" action selected', () => {
    const fields = [
      {
        order: 0,
        action: 'EDIT',
        field: { subfields: [{}] },
      },
    ];

    it('"Subaction" dropdown should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields, initialColumns);

      expect(getByText('Insert')).toBeDefined();
      expect(getByText('Remove')).toBeDefined();
      expect(getByText('Replace')).toBeDefined();
    });

    it('"Data" field should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-data')).toBeDefined();
    });

    it('"Position" dropdown should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });

    describe('when "Insert" subaction selected', () => {
      it('"Position" dropdown should be displayed', () => {
        const { getByTestId } = renderMARCTable(fields, initialColumns);

        fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'INSERT' } });

        expect(getByTestId('marc-table-position')).toBeDefined();
      });

      it('"Position" dropdown contains correct options', () => {
        const {
          getByTestId,
          getByText,
        } = renderMARCTable(fields, initialColumns);

        fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'INSERT' } });

        expect(getByText('before string')).toBeDefined();
        expect(getByText('after string')).toBeDefined();
        expect(getByText('new subfield')).toBeDefined();
      });
    });
  });

  describe('when "Move" action selected', () => {
    const fields = [
      {
        order: 0,
        action: 'MOVE',
        field: { subfields: [{}] },
      },
    ];

    it('"Subaction" dropdown should be displayed', () => {
      const { getByTestId } = renderMARCTable(fields, initialColumns);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields, initialColumns);

      expect(getByText('New field')).toBeDefined();
      expect(getByText('Existing field')).toBeDefined();
    });

    it('"Data" field should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-data')).toBeNull();
    });

    it('"Position" dropdown should be hidden', () => {
      const { queryByTestId } = renderMARCTable(fields, initialColumns);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });

    describe('when subaction', () => {
      describe('"New field" selected', () => {
        it('"Data" field should be displayed', () => {
          const { getByTestId } = renderMARCTable(fields, initialColumns);

          fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'CREATE_NEW_FIELD' } });

          expect(getByTestId('marc-table-data')).toBeDefined();
        });
      });

      describe('"Add to existing" selected', () => {
        it('"Data" field should be displayed', () => {
          const { getByTestId } = renderMARCTable(fields, initialColumns);

          fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'ADD_TO_EXISTING_FIELD' } });

          expect(getByTestId('marc-table-data')).toBeDefined();
        });
      });
    });
  });
});
