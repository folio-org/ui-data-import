import React from 'react';
import { fireEvent } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import INVOICE from '../../../../initialDetails/INVOICE';
import { InvoiceAdjustments } from '../InvoiceAdjustments';
import { getFieldValue } from '../../../utils';

const mockAdjustmentsFields = getFieldValue(INVOICE.mappingFields, 'adjustments', 'subfields')[0];

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['USD'],
  useFieldMappingRefValues: () => [[mockAdjustmentsFields]],
}));

const initialFieldsMock = { adjustments: mockAdjustmentsFields };
const setReferenceTablesMock = jest.fn();

const renderInvoiceAdjustments = () => {
  const component = () => (
    <InvoiceAdjustments
      setReferenceTables={setReferenceTablesMock}
      initialFields={initialFieldsMock}
      mappingFields={INVOICE.mappingFields}
      okapi={{}}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('InvoiceAdjustments', () => {
  afterAll(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderInvoiceAdjustments();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const { getByText } = renderInvoiceAdjustments();

    expect(getByText('Add adjustment')).toBeInTheDocument();
  });

  describe('when clicking "Add adjustment" button', () => {
    it('new Adjustment card should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderInvoiceAdjustments();

      const addButton = getByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      expect(getByText('Adjustment 1')).toBeInTheDocument();
    });

    it('with correct fields', () => {
      const {
        getByRole,
        getByText,
        getAllByText,
      } = renderInvoiceAdjustments();

      const addButton = getByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      expect(getByText('Description')).toBeInTheDocument();
      expect(getAllByText('Amount')[0]).toBeInTheDocument();
      expect(getAllByText('Type')[0]).toBeInTheDocument();
      expect(getByText('Pro rate')).toBeInTheDocument();
      expect(getByText('Relation to total')).toBeInTheDocument();
      expect(getByText('Export to accounting')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Add fund distribution' })).toBeInTheDocument();
    });
  });

  describe('when clicking on trash icon button for an adjustment', () => {
    it('function for changing form should be called', () => {
      const {
        getByRole,
        getAllByRole,
      } = renderInvoiceAdjustments();

      const addButton = getByRole('button', { name: 'Add adjustment' });
      fireEvent.click(addButton);

      const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
      fireEvent.click(deleteButton);

      expect(setReferenceTablesMock).toHaveBeenCalled();
    });
  });
});
