import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingInvoiceDetails } from '../MappingInvoiceDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

jest.mock('.../../../../../components/FieldOrganization/FieldOrganization', () => ({ onSelect }) => (
  <div>
    <span>FieldOrganization</span>
    <button
      type="button"
      onClick={() => onSelect({
        id: 'testVendorId',
        accounts: [{ appSystemNo: 'testNo1' }],
      })}
    >
      Select vendor
    </button>
  </div>
));

global.fetch = jest.fn();

const invoiceLines = {
  fields: [{
    enabled: true,
    name: 'description',
    path: 'invoice.invoiceLines[].description',
    value: '',
  }, {
    enabled: true,
    name: 'poLineId',
    path: 'invoice.invoiceLines[].poLineId',
    value: '',
  }, {
    enabled: false,
    name: 'invoiceLineNumber',
    path: 'invoice.invoiceLines[].invoiceLineNumber',
    value: '',
  }, {
    enabled: false,
    name: 'invoiceLineStatus',
    path: 'invoice.invoiceLines[].invoiceLineStatus',
    value: '',
  }, {
    enabled: true,
    name: 'referenceNumbers',
    path: 'invoice.invoiceLines[].referenceNumbers[]',
    repeatableFieldAction: null,
    subfields: [{
      fields: [{
        enabled: true,
        name: 'refNumber',
        path: 'invoice.invoiceLines[].referenceNumbers[].refNumber',
        value: '',
      }, {
        enabled: true,
        name: 'refNumberType',
        path: 'invoice.invoiceLines[].referenceNumbers[].refNumberType',
        value: '',
      }],
      order: 0,
      path: 'invoice.invoiceLines[].referenceNumbers[]',
    }],
    value: '',
  }, {
    enabled: true,
    name: 'subscriptionInfo',
    path: 'invoice.invoiceLines[].subscriptionInfo',
    value: '',
  }, {
    enabled: true,
    name: 'subscriptionStart',
    path: 'invoice.invoiceLines[].subscriptionStart',
    value: '',
  }, {
    enabled: true,
    name: 'subscriptionEnd',
    path: 'invoice.invoiceLines[].subscriptionEnd',
    value: '',
  }, {
    enabled: true,
    name: 'comment',
    path: 'invoice.invoiceLines[].comment',
    value: '',
  }, {
    enabled: false,
    name: 'lineAccountingCode',
    path: 'invoice.invoiceLines[].accountingCode',
    value: '',
  }, {
    enabled: true,
    name: 'accountNumber',
    path: 'invoice.invoiceLines[].accountNumber',
    value: '',
  }, {
    enabled: true,
    name: 'quantity',
    path: 'invoice.invoiceLines[].quantity',
    value: '',
  }, {
    enabled: true,
    name: 'lineSubTotal',
    path: 'invoice.invoiceLines[].subTotal',
    value: '',
  }, {
    booleanFieldAction: 'ALL_FALSE',
    enabled: true,
    name: 'releaseEncumbrance',
    path: 'invoice.invoiceLines[].releaseEncumbrance',
    value: null,
  }, {
    enabled: true,
    name: 'fundDistributions',
    path: 'invoice.invoiceLines[].fundDistributions[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    subfields: [{
      fields: [],
      order: 0,
      path: 'invoice.invoiceLines[].fundDistributions[]',
    }],
    value: '',
  }, {
    enabled: true,
    name: 'lineAdjustments',
    path: 'invoice.invoiceLines[].adjustments[]',
    repeatableFieldAction: null,
    subfields: [{
      fields: [{
        enabled: true,
        name: 'description',
        path: 'invoice.invoiceLines[].adjustments[].description',
        value: '',
      }, {
        enabled: true,
        name: 'value',
        path: 'invoice.invoiceLines[].adjustments[].value',
        value: '',
      }, {
        enabled: true,
        name: 'type',
        path: 'invoice.invoiceLines[].adjustments[].type',
        value: 'amount',
      }, {
        enabled: true,
        name: 'relationToTotal',
        path: 'invoice.invoiceLines[].adjustments[].relationToTotal',
        value: '',
      }, {
        booleanFieldAction: 'ALL_FALSE',
        enabled: true,
        name: 'exportToAccounting',
        path: 'invoice.invoiceLines[].adjustments[].exportToAccounting',
        value: null,
      }],
      order: 0,
      path: 'invoice.invoiceLines[].adjustments[]',
    }],
    value: '',
  }],
  order: 0,
  path: 'invoice.invoiceLines[]',
};

const adjustments = {
  fields: [{
    enabled: true,
    name: 'description',
    path: 'invoice.adjustments[].description',
    value: '',
  }, {
    enabled: true,
    name: 'value',
    path: 'invoice.adjustments[].value',
    value: '',
  }, {
    enabled: true,
    name: 'type',
    path: 'invoice.adjustments[].type',
    value: 'amount',
  }, {
    enabled: true,
    name: 'prorate',
    path: 'invoice.adjustments[].prorate',
    value: '',
  }, {
    enabled: true,
    name: 'relationToTotal',
    path: 'invoice.adjustments[].relationToTotal',
    value: '',
  }, {
    booleanFieldAction: 'ALL_FALSE',
    enabled: true,
    name: 'exportToAccounting',
    path: 'invoice.adjustments[].exportToAccounting',
    value: null,
  }, {
    enabled: true,
    name: 'fundDistributions',
    path: 'invoice.adjustments[].fundDistributions[]',
    repeatableFieldAction: null,
    subfields: [{
      fields: [],
      order: 0,
      path: 'invoice.adjustments[].fundDistributions[]',
    }],
    value: '',
  }],
  order: 0,
  path: 'invoice.adjustments[]',
};

const mappingDetailsProp = {
  mappingFields: [{
    enabled: true,
    name: 'invoiceDate',
    path: 'invoice.invoiceDate',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'status',
    path: 'invoice.status',
    subfields: [],
    value: '"Open"',
  }, {
    enabled: true,
    name: 'paymentDue',
    path: 'invoice.paymentDue',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'paymentTerms',
    path: 'invoice.paymentTerms',
    subfields: [],
    value: '',
  }, {

    enabled: false,
    name: 'approvalDate',
    path: 'invoice.approvalDate',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'approvedBy',
    path: 'invoice.approvedBy',
    subfields: [],
    value: '',
  }, {
    acceptedValues: { testId: 'testValue' },
    enabled: true,
    name: 'acqUnitIds',
    path: 'invoice.acqUnitIds[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    subfields: [{
      fields: [{
        enabled: true,
        name: 'acqUnitIds',
        path: 'invoice.acqUnitIds[]',
        value: '',
      }],
      order: 0,
      path: 'invoice.acqUnitIds[]',
    }],
  }, {
    acceptedValues: {},
    enabled: true,
    name: 'billTo',
    path: 'invoice.billTo',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'billToAddress',
    path: 'invoice.billToAddress',
    subfields: [],
    value: '',
  }, {
    acceptedValues: {},
    enabled: true,
    name: 'batchGroupId',
    path: 'invoice.batchGroupId',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'subTotal',
    path: 'invoice.subTotal',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'adjustmentsTotal',
    path: 'invoice.adjustmentsTotal',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'total',
    path: 'invoice.total',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'lockTotal',
    path: 'invoice.lockTotal',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'invoice.note',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'adjustments',
    path: 'invoice.adjustments[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    subfields: [adjustments],
    value: '',
  }, {
    enabled: true,
    name: 'vendorInvoiceNo',
    path: 'invoice.vendorInvoiceNo',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'vendorId',
    path: 'invoice.vendorId',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'accountingCode',
    path: 'invoice.accountingCode',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'folioInvoiceNo',
    path: 'invoice.folioInvoiceNo',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'paymentMethod',
    path: 'invoice.paymentMethod',
    subfields: [],
    value: '',
  }, {
    booleanFieldAction: 'ALL_FALSE',
    enabled: true,
    name: 'chkSubscriptionOverlap',
    path: 'invoice.chkSubscriptionOverlap',
    subfields: [],
    value: null,
  }, {
    booleanFieldAction: 'ALL_FALSE',
    enabled: true,
    name: 'exportToAccounting',
    path: 'invoice.exportToAccounting',
    subfields: [],
    value: null,
  }, {
    enabled: true,
    name: 'currency',
    path: 'invoice.currency',
    subfields: [],
    value: '',
  }, {
    enabled: false,
    name: 'currentExchangeRate',
    path: 'invoice.currentExchangeRate',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'exchangeRate',
    path: 'invoice.exchangeRate',
    subfields: [],
    value: '',
  }, {
    enabled: true,
    name: 'invoiceLines',
    path: 'invoice.invoiceLines[]',
    repeatableFieldAction: 'EXTEND_EXISTING',
    subfields: [invoiceLines],
    value: '',
  }],
  name: 'invoice',
  recordType: 'INVOICE',
};
const initialFieldsProp = {
  acqUnitIds: {
    fields: [{
      enabled: true,
      name: 'acqUnitIds',
      path: 'invoice.acqUnitIds[]',
      value: '',
    }],
    order: 0,
    path: 'invoice.acqUnitIds[]',
  },
  adjustments,
  invoiceLines,
};
const referenceTablesProp = {
  acqUnitIds: [{
    fields: [{
      enabled: true,
      name: 'acqUnitIds',
      path: 'invoice.acqUnitIds[]',
      value: '',
    }],
    order: 0,
    path: 'invoice.acqUnitIds[]',
  }],
  adjustments: [adjustments],
  invoiceLines: [invoiceLines],
};
const setReferenceTablesMockProp = jest.fn();
const getMappingSubfieldsFieldValueProp = jest.fn(() => '');
const okapiProp = {
  tenant: 'diku',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
  translations: {},
};

const renderMappingInvoiceDetails = () => {
  const component = () => (
    <MappingInvoiceDetails
      mappingDetails={mappingDetailsProp}
      initialFields={initialFieldsProp}
      referenceTables={referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      getMappingSubfieldsFieldValue={getMappingSubfieldsFieldValueProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<MappingInvoiceDetails>', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch.mockClear();
    onAdd.mockClear();
    onRemove.mockClear();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    delete global.fetch;
    consoleErrorSpy = null;
  });

  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingInvoiceDetails();

    expect(await findByRole('button', {
      name: /invoice information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice adjustments/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /vendor information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /extended information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line fund distribution/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line adjustments/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  it('User can select vendor', async () => {
    const { findByRole } = renderMappingInvoiceDetails();

    fireEvent.click(await findByRole('button', { name: /select vendor/i }));

    expect(setReferenceTablesMockProp).toHaveBeenCalled();
  });

  describe('"Invoice adjustments" field', () => {
    it('User can add adjustments', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add adjustment' });

      fireEvent.click(buttons[0]);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('adjustments');
    });

    it('User can delete adjustment', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[0]);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('User can add fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add fund distribution' });

      fireEvent.click(buttons[0]);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('fundDistributions');
    });

    it('User can delete fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[1]);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('User can change pro rate', async () => {
      const {
        getByRole,
        findAllByRole,
        getByText,
      } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: /accepted values/i });

      fireEvent.click(buttons[5]);
      fireEvent.click(getByText('By line'));

      expect(getByRole('textbox', { name: /pro rate/i }).value).toBe('"By line"');
    });
  });

  describe('"Extended information" section', () => {
    describe('when "Use set exchange rate" is checked', () => {
      it('set exchange rate input is enabled', async () => {
        const {
          findByRole,
          getByRole,
        } = renderMappingInvoiceDetails();

        fireEvent.click(await findByRole('checkbox', { name: /use set exchange rate/i }));

        expect(getByRole('textbox', { name: /set exchange rate/i })).toBeEnabled();
      });

      it('otherwise, set exchange input is disabled', async () => {
        const {
          findByRole,
          getByRole,
        } = renderMappingInvoiceDetails();

        fireEvent.click(await findByRole('checkbox', { name: /use set exchange rate/i }));
        fireEvent.click(await findByRole('checkbox', { name: /use set exchange rate/i }));

        expect(getByRole('textbox', { name: /set exchange rate/i })).toBeDisabled();
      });
    });
  });

  describe('"Invoice information" field', () => {
    describe('when "Lock total" is checked', () => {
      it('"Lock total amount" input is enabled', async () => {
        const {
          findByRole,
          getByRole,
        } = renderMappingInvoiceDetails();

        fireEvent.click(await findByRole('checkbox', { name: /lock total/i }));

        expect(getByRole('textbox', { name: /lock total amount/i })).toBeEnabled();
      });

      it('otherwise, "Lock total amount" input is disabled', async () => {
        const {
          findByRole,
          getByRole,
        } = renderMappingInvoiceDetails();

        fireEvent.click(await findByRole('checkbox', { name: /lock total/i }));
        fireEvent.click(await findByRole('checkbox', { name: /lock total/i }));

        expect(getByRole('textbox', { name: /lock total amount/i })).toBeDisabled();
      });
    });
  });

  describe('"Invoice line information"', () => {
    it('User can add vendor reference number', async () => {
      const { findByRole } = renderMappingInvoiceDetails();

      const buttons = await findByRole('button', { name: 'Add vendor reference number' });

      fireEvent.click(buttons);

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('User can remove vendor reference number', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[2]);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Invoice line fund distribution"', () => {
    it('User can add invoice line fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add fund distribution' });

      fireEvent.click(buttons[1]);

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('User can remove invoice line fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[4]);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Invoice line adjustments"', () => {
    it('User can add invoice line adjustment', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add adjustment' });

      fireEvent.click(buttons[1]);

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('User can remove invoice line adjustment', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails({});

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[3]);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });
});
