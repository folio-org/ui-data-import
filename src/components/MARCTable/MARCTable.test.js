import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import '../../../test/jest/__mock__';
import { Intl } from '../../../test/jest/__mock__/intl.mock';
import { reduxFormMock } from '../../../test/jest/__mock__/reduxForm.mock';

import { MARCTable } from './MARCTable';

const onChange = jest.fn();
const initialFields = [
  {
    order: 0,
    field: { subfields: [{}] },
  },
];

const renderMARCTable = fields => {
  const component = () => (
    <Intl>
      <MARCTable
        fields={fields}
        onChange={onChange}
      />
    </Intl>
  );

  return render(reduxFormMock(component));
};

describe('MARC modifications table', () => {
  afterEach(() => {
    cleanup();
    onChange.mockClear();
  });

  describe('when "Add new row" button clicked', () => {
    it('one more row should be added', () => {
      const updatedRows = [...initialFields, {
        order: 1,
        field: { subfields: [{}] },
      }];
      const { getByLabelText } = renderMARCTable(initialFields);

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
      const { getAllByLabelText } = renderMARCTable(fields);

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
      const { getByLabelText } = renderMARCTable(fields);

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
      const { getByTestId } = renderMARCTable(fields);

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
      const { getAllByLabelText } = renderMARCTable(fields);

      fireEvent.click(getAllByLabelText('Delete this field')[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1]).toEqual(updatedFields);
    });
  });

  describe('when there are no data received', () => {
    it('should have initial row', () => {
      const { getAllByTestId } = renderMARCTable(initialFields);

      expect(getAllByTestId('marc-table-row').length).toBe(1);
    });

    it('there should not be re-ordering arrows', () => {
      const { queryByTestId } = renderMARCTable(initialFields);

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

    it('should have 3 rows', () => {
      const { getAllByTestId } = renderMARCTable(fields);

      expect(getAllByTestId('marc-table-row').length).toBe(3);
    });

    it('there should be re-ordering arrows', () => {
      const { getAllByTestId } = renderMARCTable(fields);

      expect(getAllByTestId('marc-table-arrow-up')).toBeDefined();
      expect(getAllByTestId('marc-table-arrow-down')).toBeDefined();
    });

    it('subfield should be rendered', () => {
      const { getByTestId } = renderMARCTable(fields);

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

    it('there should be "Subaction" dropdown', () => {
      const { getByTestId } = renderMARCTable(fields);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields);

      expect(getByText('Add subfield')).toBeDefined();
    });

    it('there should be "Data" field', () => {
      const { getByTestId } = renderMARCTable(fields);

      expect(getByTestId('marc-table-data')).toBeDefined();
    });

    it('there should not be "Position" dropdown', () => {
      const { queryByTestId } = renderMARCTable(fields);

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

    it('there should not be "Subaction" dropdown', () => {
      const { queryByTestId } = renderMARCTable(fields);

      expect(queryByTestId('marc-table-subaction')).toBeNull();
    });

    it('there should not be "Data" field', () => {
      const { queryByTestId } = renderMARCTable(fields);

      expect(queryByTestId('marc-table-data')).toBeNull();
    });

    it('there should not be "Position" dropdown', () => {
      const { queryByTestId } = renderMARCTable(fields);

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

    it('there should be "Subaction" dropdown', () => {
      const { getByTestId } = renderMARCTable(fields);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields);

      expect(getByText('Insert')).toBeDefined();
      expect(getByText('Remove')).toBeDefined();
      expect(getByText('Replace')).toBeDefined();
    });

    it('there should be "Data" field', () => {
      const { getByTestId } = renderMARCTable(fields);

      expect(getByTestId('marc-table-data')).toBeDefined();
    });

    it('there should not be "Position" dropdown', () => {
      const { queryByTestId } = renderMARCTable(fields);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });

    describe('when "Insert" subaction selected', () => {
      it('there should be "Position" dropdown', () => {
        const { getByTestId } = renderMARCTable(fields);

        fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'INSERT' } });

        expect(getByTestId('marc-table-position')).toBeDefined();
      });

      it('"Position" dropdown contains correct options', () => {
        const {
          getByTestId,
          getByText,
        } = renderMARCTable(fields);

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

    it('there should be "Subaction" dropdown', () => {
      const { getByTestId } = renderMARCTable(fields);

      expect(getByTestId('marc-table-subaction')).toBeDefined();
    });

    it('"Subaction" dropdown contains correct options', () => {
      const { getByText } = renderMARCTable(fields);

      expect(getByText('New field')).toBeDefined();
      expect(getByText('Existing field')).toBeDefined();
    });

    it('there should not be "Data" field', () => {
      const { queryByTestId } = renderMARCTable(fields);

      expect(queryByTestId('marc-table-data')).toBeNull();
    });

    it('there should not be "Position" dropdown', () => {
      const { queryByTestId } = renderMARCTable(fields);

      expect(queryByTestId('marc-table-position')).toBeNull();
    });

    describe('when subaction selected', () => {
      it('there should be "Data" field', () => {
        const { getByTestId } = renderMARCTable(fields);

        fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'CREATE_NEW_FIELD' } });

        expect(getByTestId('marc-table-data')).toBeDefined();
      });

      it('there should be "Data" field', () => {
        const { getByTestId } = renderMARCTable(fields);

        fireEvent.change(getByTestId('marc-table-subaction'), { target: { value: 'ADD_TO_EXISTING_FIELD' } });

        expect(getByTestId('marc-table-data')).toBeDefined();
      });
    });
  });
});
