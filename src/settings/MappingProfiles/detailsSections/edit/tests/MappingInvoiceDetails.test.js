import React from 'react';
import faker from 'faker';
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

jest.mock('../InvoiceDetailSection', () => ({
  InvoiceInformation: () => <span>InvoiceInformation</span>,
  InvoiceAdjustments: () => <span>InvoiceAdjustments</span>,
  VendorInformation: () => <span>VendorInformation</span>,
  ExtendedInformation: () => <span>ExtendedInformation</span>,
  InvoiceLineInformation: () => <span>InvoiceLineInformation</span>,
  InvoiceLineFundDistribution: () => <span>InvoiceLineFundDistribution</span>,
  InvoiceLineAdjustments: () => <span>InvoiceLineAdjustments</span>,
}));

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

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingInvoiceDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const { getByText } = renderMappingInvoiceDetails();

    expect(getByText('InvoiceInformation')).toBeInTheDocument();
    expect(getByText('InvoiceAdjustments')).toBeInTheDocument();
    expect(getByText('VendorInformation')).toBeInTheDocument();
    expect(getByText('ExtendedInformation')).toBeInTheDocument();
    expect(getByText('InvoiceLineInformation')).toBeInTheDocument();
    expect(getByText('InvoiceLineFundDistribution')).toBeInTheDocument();
    expect(getByText('InvoiceLineAdjustments')).toBeInTheDocument();
  });
});
