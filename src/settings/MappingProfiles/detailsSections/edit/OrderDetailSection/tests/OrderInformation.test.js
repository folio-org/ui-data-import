import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { OrderInformation } from '../OrderInformation';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

<<<<<<< HEAD
jest.mock('../../../hooks', () => ({
  useFieldMappingBoolFieldValue: () => ['ALL_TRUE', 'ALL_TRUE'],
  useFieldMappingFieldValue: () => ['testId1', '', ''],
  useFieldMappingValueFromLookup: () => ['testUUID', 'testMapping'],
  useFieldMappingRefValues: () => [[{
    order: 0,
    path: 'order.po.notes[]',
    fields: [
      {
        name: 'notes',
        enabled: true,
        path: 'order.po.notes[]',
        value: '"test note"'
      }
    ]
  }]],
=======
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
>>>>>>> 2a0cc7b1a81b98281187240cd4ea0b9da76d4a83
}));

const setReferenceTablesMock = jest.fn();

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};
const resourcesProp = {
  ...buildResources({
    resourceName: 'purchaseOrderLinesLimitSetting',
    records: [{
      configs: [{ value: 'test purchaseOrderLinesLimitSetting' }]
    }],
  }),
  ...buildResources({
    resourceName: 'isApprovalRequired',
    records: [{
      configs: [{ value: '{ "isApprovalRequired": true }' }]
    }],
  }),
  ...buildResources({
    resourceName: 'userCanEditPONumber',
    records: [{
      configs: [{ value: '{ "canUserEditOrderNumber": true }' }]
    }],
  }),
  ...buildResources({
    resourceName: 'addresses',
    records: [{
      configs: [
        { value: '{ "name": "test address name","address": "test address" }' },
        { value: '{ "name": "test address name2","address": "test address2" }' },
      ]
    }],
  }),
};
const poLinesLimitMock = {
  configs: [{ value: 'test purchaseOrderLinesLimitSetting' }]
};
const mutatorProp = {
  purchaseOrderLinesLimitSetting: {
    GET: jest.fn().mockResolvedValue(poLinesLimitMock),
    reset: jest.fn(),
  },
};

const renderOrderInformation = () => {
  const component = () => (
    <OrderInformation
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      onOrganizationSelect={() => {}}
      okapi={okapiProp}
      resources={resourcesProp}
      mutator={mutatorProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('OrderInformation', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderOrderInformation();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderOrderInformation();

    expect(getByText('Purchase order status')).toBeInTheDocument();
    expect(getByText('Approved')).toBeInTheDocument();
    expect(getByText('Purchase order lines limit setting')).toBeInTheDocument();
    expect(getByText('Override purchase order lines limit setting')).toBeInTheDocument();
    expect(getByText('Prefix')).toBeInTheDocument();
    expect(getByText('PO number')).toBeInTheDocument();
    expect(getByText('Suffix')).toBeInTheDocument();
    expect(getByText('Vendor')).toBeInTheDocument();
    expect(getByText('Order type')).toBeInTheDocument();
    expect(getByText('Acquisition units')).toBeInTheDocument();
    expect(getByText('Assigned to')).toBeInTheDocument();
    expect(getByText('Bill to name')).toBeInTheDocument();
    expect(getByText('Bill to address')).toBeInTheDocument();
    expect(getByText('Ship to name')).toBeInTheDocument();
    expect(getByText('Ship to address')).toBeInTheDocument();
    expect(getByText('Manual')).toBeInTheDocument();
    expect(getByText('Re-encumber')).toBeInTheDocument();
    expect(getByText('Add note')).toBeInTheDocument();
    expect(getByText('Note')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderOrderInformation();

    expect(within(queryByText('Purchase order status')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Vendor')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Order type')).getByText(/\*/i)).toBeDefined();
  });

  it('should render info icons for the particular fields', () => {
    const { queryByText } = renderOrderInformation();

    expect(within(queryByText('Purchase order status')).getByText(/InfoPopover/i)).toBeDefined();
  });

  describe('should render validation error message when "Override purchase order lines limit setting" field value', () => {
    it('is not wrapped into quotation marks', () => {
      const {
        getByText,
        getByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = getByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '25' } });
      fireEvent.blur(overrideLimitField);

      expect(getByText('Non-MARC value must use quotation marks')).toBeInTheDocument();
    });

    it('is less than 1', () => {
      const {
        getByText,
        getByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = getByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"0"' } });
      fireEvent.blur(overrideLimitField);

      expect(getByText('Please enter a whole number greater than 0 and less than 1000 to continue')).toBeInTheDocument();
    });

    it('is greater than 999', () => {
      const {
        getByText,
        getByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = getByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"1000"' } });
      fireEvent.blur(overrideLimitField);

      expect(getByText('Please enter a whole number greater than 0 and less than 1000 to continue')).toBeInTheDocument();
    });

    it('is fractional', () => {
      const {
        getByText,
        getByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = getByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"2.5"' } });
      fireEvent.blur(overrideLimitField);

      expect(getByText('Please enter a whole number greater than 0 and less than 1000 to continue')).toBeInTheDocument();
    });
  });

  describe('when click on "Approved" checkbox', () => {
    it('checkbox should be unchecked', () => {
      const { getByLabelText } = renderOrderInformation();

      const approvedCheckbox = getByLabelText('Approved');
      fireEvent.click(approvedCheckbox);

      expect(approvedCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_FALSE);
    });
  });

  describe('when click "Add note" button', () => {
    it('field for new note should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderOrderInformation();

      const addNoteButton = getByRole('button', { name: /Add note/i });
      fireEvent.click(addNoteButton);

      expect(getByText('Note')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderOrderInformation();

        const addNoteButton = getByRole('button', { name: /Add note/i });
        fireEvent.click(addNoteButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('when change "Bill to name" field', () => {
    it('"Bill to address" value should be changed', () => {
      const {
        getByLabelText,
        getByText,
      } = renderOrderInformation();

      const billToNameField = getByLabelText('Bill to name');
      fireEvent.change(billToNameField, { target: { value: 'test address name2' } });

      const billToAddressField = getByText('"test address2"');

      expect(billToAddressField).toBeInTheDocument();
    });
  });

  describe('when change "Ship to name" field', () => {
    it('"Ship to address" value should be changed', () => {
      const {
        getByLabelText,
        getByText,
      } = renderOrderInformation();

      const shipToNameField = getByLabelText('Ship to name');
      fireEvent.change(shipToNameField, { target: { value: 'test address name2' } });

      const shipToAddressField = getByText('"test address2"');

      expect(shipToAddressField).toBeInTheDocument();
    });
  });
});
