import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { POLineDetails } from '../POLineDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

jest.mock('../../../hooks', () => ({ useFieldMappingBoolFieldValue: () => ['ALL_FALSE'] }));

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderPOLineDetails = () => {
  const component = () => (
    <POLineDetails
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('POLineDetails edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderPOLineDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderPOLineDetails();

    expect(getByText('POL number')).toBeInTheDocument();
    expect(getByText('Acquisition method')).toBeInTheDocument();
    expect(getByText('Automatic export')).toBeInTheDocument();
    expect(getByText('Order format')).toBeInTheDocument();
    expect(getByText('Created on')).toBeInTheDocument();
    expect(getByText('Receipt date')).toBeInTheDocument();
    expect(getByText('Receipt status')).toBeInTheDocument();
    expect(getByText('Source')).toBeInTheDocument();
    expect(getByText('Donor')).toBeInTheDocument();
    expect(getByText('Selector')).toBeInTheDocument();
    expect(getByText('Requester')).toBeInTheDocument();
    expect(getByText('Cancellation restriction')).toBeInTheDocument();
    expect(getByText('Rush')).toBeInTheDocument();
    expect(getByText('Receiving workflow')).toBeInTheDocument();
    expect(getByText('Cancellation description')).toBeInTheDocument();
    expect(getByText('Line description')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderPOLineDetails();

    expect(within(queryByText('Acquisition method')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Order format')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Receiving workflow')).getByText(/\*/i)).toBeDefined();
  });

  describe('when click on "Automatic export" checkbox', () => {
    it('checkbox should be checked', () => {
      const { getByLabelText } = renderPOLineDetails();

      const automaticExportCheckbox = getByLabelText('Automatic export');
      fireEvent.click(automaticExportCheckbox);

      expect(automaticExportCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });

  describe('when select receipt date', () => {
    it('value for receipt date field should be changed', () => {
      const {
        getByLabelText,
      } = renderPOLineDetails();

      const receiptDateField = getByLabelText('Receipt date');
      fireEvent.change(receiptDateField, { target: { value: '###TODAY###' } });

      expect(receiptDateField).toHaveValue('###TODAY###');
    });
  });

  describe('when change "Receiving workflow" field', () => {
    it('value should be changed', () => {
      const {
        getByLabelText,
        getByText,
      } = renderPOLineDetails();

      const receivingWorkflowField = getByLabelText('Receiving workflow*');
      fireEvent.change(receivingWorkflowField, { target: { value: 'Synchronized' } });

      const receivingWorkflowValue = getByText('Synchronized');

      expect(receivingWorkflowValue).toBeInTheDocument();
    });
  });
});
