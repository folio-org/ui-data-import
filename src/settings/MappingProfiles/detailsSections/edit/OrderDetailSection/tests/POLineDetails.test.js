import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { POLineDetails } from '../POLineDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

jest.mock('../../../hooks', () => ({ useFieldMappingBoolFieldValue: () => ['ALL_FALSE'] }));

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderPOLineDetails = () => {
  const component = () => (
    <POLineDetails
      setReferenceTables={() => {}}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('POLineDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderPOLineDetails();

    const poLineDetailsTitle = await findByText('PO line details');

    expect(poLineDetailsTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderPOLineDetails();

    const poLineDetailsTitle = await findByText('PO line details');

    expect(poLineDetailsTitle).toBeInTheDocument();

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

  it('should render required fields', async () => {
    const { findByText } = renderPOLineDetails();

    const acqMethodField = await findByText('Acquisition method');
    const orderFormatField = await findByText('Order format');
    const receivingWorkflowField = await findByText('Receiving workflow');

    expect(acqMethodField.lastElementChild.innerHTML).toEqual('*');
    expect(orderFormatField.lastElementChild.innerHTML).toEqual('*');
    expect(receivingWorkflowField.lastElementChild.innerHTML).toEqual('*');
  });

  describe('when click on "Automatic export" checkbox', () => {
    it('checkbox should be checked', async () => {
      const { findByLabelText } = renderPOLineDetails();

      const automaticExportCheckbox = await findByLabelText('Automatic export');
      fireEvent.click(automaticExportCheckbox);

      expect(automaticExportCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });

  describe('when select receipt date', () => {
    it('value for receipt date field should be changed', async () => {
      const { findByLabelText } = renderPOLineDetails();

      const receiptDateField = await findByLabelText('Receipt date');
      fireEvent.change(receiptDateField, { target: { value: '###TODAY###' } });

      expect(receiptDateField).toHaveValue('###TODAY###');
    });
  });

  describe('when change "Receiving workflow" field', () => {
    it('value should be changed', async () => {
      const {
        findByLabelText,
        getByText,
      } = renderPOLineDetails();

      const receivingWorkflowField = await findByLabelText('Receiving workflow*');
      fireEvent.change(receivingWorkflowField, { target: { value: 'Synchronized' } });

      const receivingWorkflowValue = getByText('Synchronized');

      expect(receivingWorkflowValue).toBeInTheDocument();
    });
  });
});
