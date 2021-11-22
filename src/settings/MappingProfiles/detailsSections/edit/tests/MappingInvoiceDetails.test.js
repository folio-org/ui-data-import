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
  getInitialFields,
  getInitialDetails,
} from '../../../initialDetails';
import { FOLIO_RECORD_TYPES } from '../../../../../components';

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

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INVOICE.type);
const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);
const referenceTablesProp = {
  acqUnitIds: [initialFieldsProp.acqUnitIds],
  adjustments: [initialFieldsProp.adjustments],
  invoiceLines: [initialFieldsProp.invoiceLines],
};
const setReferenceTablesMockProp = jest.fn();
const getMappingSubfieldsFieldValueProp = jest.fn(() => '');
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
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
    setReferenceTablesMockProp.mockClear();
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
      const {
        findAllByRole,
        getAllByText,
        getAllByRole,
      } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add adjustment' });

      fireEvent.click(buttons[0]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getAllByRole('textbox', { name: /description/i })[0]).toBeVisible();
      expect(getAllByRole('textbox', { name: /amount/i })[0]).toBeVisible();
      expect(getAllByText('Type')[0]).toBeVisible();
      expect(getAllByRole('textbox', { name: /pro rate/i })[0]).toBeVisible();
      expect(getAllByRole('textbox', { name: /relation to total/i })[0]).toBeVisible();
      expect(getAllByRole('checkbox', { name: /export to accounting/i })[0]).toBeVisible();
    });

    it('User can delete adjustment', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[0]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
    });

    it('User can add fund distribution', async () => {
      const {
        findAllByRole,
        getAllByText,
        getAllByRole,
      } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add fund distribution' });

      fireEvent.click(buttons[0]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getAllByRole('textbox', { name: /fund id/i })[0]).toBeInTheDocument();
      expect(getAllByRole('textbox', { name: /expense class/i })[0]).toBeInTheDocument();
      expect(getAllByRole('textbox', { name: /value/i })[0]).toBeInTheDocument();
      expect(getAllByText('Type')[1]).toBeVisible();
      expect(getAllByRole('textbox', { name: /amount/i })[1]).toBeInTheDocument();
    });

    it('User can delete fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[1]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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
      const {
        findByRole,
        getByRole,
      } = renderMappingInvoiceDetails();

      const button = await findByRole('button', { name: 'Add vendor reference number' });

      fireEvent.click(button);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByRole('textbox', { name: /vendor reference number/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: /vendor reference type/i })).toBeInTheDocument();
    });

    it('User can remove vendor reference number', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[2]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
    });
  });

  describe('"Invoice line fund distribution"', () => {
    it('User can add invoice line fund distribution', async () => {
      const {
        findAllByRole,
        getAllByRole,
        getAllByText,
      } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add fund distribution' });

      fireEvent.click(buttons[1]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getAllByRole('textbox', { name: /fund id/i })[1]).toBeInTheDocument();
      expect(getAllByRole('textbox', { name: /expense class/i })[1]).toBeInTheDocument();
      expect(getAllByRole('textbox', { name: /value/i })[1]).toBeInTheDocument();
      expect(getAllByText('Type')[2]).toBeVisible();
      expect(getAllByRole('textbox', { name: /amount/i })[2]).toBeInTheDocument();
    });

    it('User can remove invoice line fund distribution', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[4]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
    });
  });

  describe('"Invoice line adjustments"', () => {
    it('User can add invoice line adjustment', async () => {
      const {
        findAllByRole,
        getAllByText,
        getAllByRole,
      } = renderMappingInvoiceDetails();

      const buttons = await findAllByRole('button', { name: 'Add adjustment' });

      fireEvent.click(buttons[1]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getAllByRole('textbox', { name: /description/i })[2]).toBeInTheDocument();
      expect(getAllByRole('textbox', { name: /amount/i })[3]).toBeInTheDocument();
      expect(getAllByText('Type')[3]).toBeVisible();
      expect(getAllByRole('textbox', { name: /relation to total/i })[1]).toBeInTheDocument();
      expect(getAllByRole('checkbox', { name: /export to accounting/i })[2]).toBeInTheDocument();
    });

    it('User can remove invoice line adjustment', async () => {
      const { findAllByRole } = renderMappingInvoiceDetails();

      const deleteButtons = await findAllByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButtons[3]);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
    });
  });
});
