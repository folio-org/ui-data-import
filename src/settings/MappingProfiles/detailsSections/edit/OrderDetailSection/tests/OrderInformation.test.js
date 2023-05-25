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

import { OrderInformation } from '../OrderInformation';

import {
  BOOLEAN_ACTIONS,
  STATUS_CODES,
} from '../../../../../../utils';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

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
}));

global.fetch = jest.fn();
const setReferenceTablesMock = jest.fn();

const okapi = buildOkapi();
const resourcesProp = {
  purchaseOrderLinesLimitSetting: {
    records: [{
      configs: [{ value: 'test purchaseOrderLinesLimitSetting' }]
    }],
    hasLoaded: true,
  },
  isApprovalRequired: {
    records: [{
      configs: [{ value: '{ "isApprovalRequired": true }' }]
    }],
    hasLoaded: true,
  },
  userCanEditPONumber: {
    records: [{
      configs: [{ value: '{ "canUserEditOrderNumber": true }' }]
    }],
    hasLoaded: true,
  },
  addresses: {
    records: [{
      configs: [
        { value: '{ "name": "test address name","address": "test address" }' },
        { value: '{ "name": "test address name2","address": "test address2" }' },
      ]
    }],
    hasLoaded: true,
  },
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
      okapi={okapi}
      resources={resourcesProp}
      mutator={mutatorProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('OrderInformation edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderOrderInformation();

    const orderInformationTitle = await findByText('Order information');

    expect(orderInformationTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderOrderInformation();

    const orderInformationTitle = await findByText('Order information');

    expect(orderInformationTitle).toBeInTheDocument();

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

  it('should render required fields', async () => {
    const { findByText } = renderOrderInformation();

    const poStatusField = await findByText('Purchase order status');
    const vendorField = await findByText('Vendor');
    const orderTypeField = await findByText('Order type');

    expect(poStatusField.lastElementChild.innerHTML).toEqual('*');
    expect(vendorField.lastElementChild.innerHTML).toEqual('*');
    expect(orderTypeField.lastElementChild.innerHTML).toEqual('*');
  });

  it('should render info icons for the particular fields', async () => {
    const { findByText } = renderOrderInformation();

    const poStatusField = await findByText('Purchase order status');

    expect(poStatusField.firstElementChild.innerHTML).toEqual('InfoPopover');
  });

  describe('should render validation error message when "Override purchase order lines limit setting" field value', () => {
    it('is not wrapped into quotation marks', async () => {
      const {
        getByText,
        findByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = await findByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '25' } });
      fireEvent.blur(overrideLimitField);

      const validationMessage = getByText('Non-MARC value must use quotation marks');

      expect(validationMessage).toBeInTheDocument();
    });

    it('is less than 1', async () => {
      const {
        getByText,
        findByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = await findByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"0"' } });
      fireEvent.blur(overrideLimitField);

      const validationMessage = getByText('Please enter a whole number greater than 0 and less than 1000 to continue');

      expect(validationMessage).toBeInTheDocument();
    });

    it('is greater than 999', async () => {
      const {
        getByText,
        findByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = await findByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"1000"' } });
      fireEvent.blur(overrideLimitField);

      const validationMessage = getByText('Please enter a whole number greater than 0 and less than 1000 to continue');

      expect(validationMessage).toBeInTheDocument();
    });

    it('is fractional', async () => {
      const {
        getByText,
        findByLabelText,
      } = renderOrderInformation();

      const overrideLimitField = await findByLabelText('Override purchase order lines limit setting');
      fireEvent.change(overrideLimitField, { target: { value: '"2.5"' } });
      fireEvent.blur(overrideLimitField);

      const validationMessage = getByText('Please enter a whole number greater than 0 and less than 1000 to continue');

      expect(validationMessage).toBeInTheDocument();
    });
  });

  describe('when click on "Approved" checkbox', () => {
    it('checkbox should be unchecked', async () => {
      const { findByLabelText } = renderOrderInformation();

      const approvedCheckbox = await findByLabelText('Approved');
      fireEvent.click(approvedCheckbox);

      expect(approvedCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_FALSE);
    });
  });

  describe('when click "Add note" button', () => {
    it('field for new note should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderOrderInformation();

      const addNoteButton = await findByRole('button', { name: /Add note/i });
      fireEvent.click(addNoteButton);

      const noteField = getByText('Note');

      expect(noteField).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderOrderInformation();

        const addNoteButton = await findByRole('button', { name: /Add note/i });
        fireEvent.click(addNoteButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('when change "Bill to name" field', () => {
    it('"Bill to address" value should be changed', async () => {
      const {
        findByLabelText,
        getByText,
      } = renderOrderInformation();

      const billToNameField = await findByLabelText('Bill to name');
      fireEvent.change(billToNameField, { target: { value: 'test address name2' } });

      const billToAddressField = getByText('"test address2"');

      expect(billToAddressField).toBeInTheDocument();
    });
  });

  describe('when change "Ship to name" field', () => {
    it('"Ship to address" value should be changed', async () => {
      const {
        findByLabelText,
        getByText,
      } = renderOrderInformation();

      const shipToNameField = await findByLabelText('Ship to name');
      fireEvent.change(shipToNameField, { target: { value: 'test address name2' } });

      const shipToAddressField = getByText('"test address2"');

      expect(shipToAddressField).toBeInTheDocument();
    });
  });
});
