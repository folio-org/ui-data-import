import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';
import { STATUS_CODES } from '../../../../../utils';

import { MappingOrderDetails } from '../MappingOrderDetails';
import { getInitialFields } from '../../../initialDetails';

jest.mock('../OrderDetailSection', () => ({
  OrderInformation: () => <span>OrderInformation</span>,
  ItemDetails: () => <span>ItemDetails</span>,
  POLineDetails: () => <span>POLineDetails</span>,
  DonorInformation: () => <span>DonorInformation</span>,
  Vendor: () => <span>Vendor</span>,
  CostDetails: () => <span>CostDetails</span>,
  FundDistribution: () => <span>FundDistribution</span>,
  Location: () => <span>Location</span>,
  PhysicalResourceDetails: () => <span>PhysicalResourceDetails</span>,
  EResourcesDetails: () => <span>EResourcesDetails</span>,
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ORDER.type);

const setReferenceTablesMockProp = jest.fn();
const okapi = buildOkapi();

const renderMappingOrderDetails = () => {
  const component = () => (
    <MappingOrderDetails
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMockProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};


describe('MappingOrderDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingOrderDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const { getByText } = renderMappingOrderDetails();

    expect(getByText('OrderInformation')).toBeInTheDocument();
    expect(getByText('ItemDetails')).toBeInTheDocument();
    expect(getByText('POLineDetails')).toBeInTheDocument();
    expect(getByText('DonorInformation')).toBeInTheDocument();
    expect(getByText('Vendor')).toBeInTheDocument();
    expect(getByText('CostDetails')).toBeInTheDocument();
    expect(getByText('FundDistribution')).toBeInTheDocument();
    expect(getByText('Location')).toBeInTheDocument();
    expect(getByText('PhysicalResourceDetails')).toBeInTheDocument();
    expect(getByText('EResourcesDetails')).toBeInTheDocument();
  });
});
