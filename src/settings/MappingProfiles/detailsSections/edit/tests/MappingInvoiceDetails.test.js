import React from 'react';
import faker from 'faker';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { Pluggable } from '@folio/stripes/core';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingInvoiceDetails } from '../MappingInvoiceDetails';
import {
  getInitialFields,
  getInitialDetails,
} from '../../../initialDetails';

const organizationMock = [{
  id: 'orgId',
  name: 'org name',
  erpCode: 'erpCode',
  accounts: [{
    appSystemNo: 'appSystemNo1',
    accountNo: 'accountNo1',
  }],
}];

const mockVendorUUID = faker.random.uuid();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useFieldMappingValueFromLookup: () => [mockVendorUUID],
  useOrganizationValue: () => ({
    organization: organizationMock,
    organizationName: organizationMock.name,
    isLoading: false
  }),
}));

global.fetch = jest.fn();

const vendor = {
  id: 'd0fb5aa0-cdf1-11e8-a8d5-f2801f1b9fd1',
  name: 'GOBI Library Solutions',
  accounts: [{
    name: 'Monographic ordering unit account',
    accountNo: '1234',
    description: 'Monographic ordering unit account',
    appSystemNo: 'test',
    paymentMethod: 'Credit Card',
    accountStatus: 'Active',
    contactInfo: 'cust.service03@amazon.com',
    libraryCode: 'COB',
    libraryEdiCode: '765987610',
    notes: '',
    acqUnitIds: [],
  }],
};

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INVOICE.type);
const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);
const getMappingSubfieldsFieldValueProp = jest.fn(() => '');
const okapi = buildOkapi();
const setReferenceTablesMock = jest.fn();

const renderMappingInvoiceDetails = () => {
  const component = () => (
    <MappingInvoiceDetails
      mappingDetails={mappingDetailsProp}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getMappingSubfieldsFieldValue={getMappingSubfieldsFieldValueProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingInvoiceDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    Pluggable.mockClear();
    setReferenceTablesMock.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it.skip('should be rendered with no axe errors', async () => {
    const {
      container,
      findByRole,
    } = renderMappingInvoiceDetails();

    const invoiceInformationSection = await findByRole('button', { name: /invoice information/i });

    expect(invoiceInformationSection).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
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

  describe('when vendor is selected', () => {
    it('function to select vandor should be called', async () => {
      renderMappingInvoiceDetails();

      await waitFor(() => Pluggable.mock.calls[0][0].selectVendor(vendor));

      expect(setReferenceTablesMock).toHaveBeenCalled();
    });

    describe('when clean the field', () => {
      it('it should be empty', async () => {
        const { findByLabelText } = renderMappingInvoiceDetails();

        await waitFor(() => Pluggable.mock.calls[0][0].selectVendor(vendor));

        const clearButton = await findByLabelText('times-circle-solid');

        fireEvent.click(clearButton);

        const vendorNameField = await findByLabelText(/Vendor name/);

        expect(vendorNameField.value).toEqual('');
      });
    });
  });
});
