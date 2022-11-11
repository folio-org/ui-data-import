import React from 'react';
import { within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { OrderInformation } from '../OrderInformation';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};
const resourcesProp = {
  purchaseOrderLinesLimitSetting: {},
  isApprovalRequired: {},
  userCanEditPONumber: {},
  addresses: {},
};

const notes = [{
  order: 0,
  path: 'order.po.notes[]',
  fields: [{
    name: 'notes',
    enabled: true,
    path: 'order.po.notes[]',
    value: '',
  }],
}];

const renderOrderInformation = () => {
  const component = () => (
    <OrderInformation
      notes={notes}
      approvedCheckbox={BOOLEAN_ACTIONS.ALL_FALSE}
      manualPOCheckbox={BOOLEAN_ACTIONS.ALL_FALSE}
      filledVendorId={null}
      assignedToId={null}
      initialFields={{}}
      setReferenceTables={() => {}}
      onOrganizationSelect={() => {}}
      okapi={okapiProp}
      resources={resourcesProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('OrderInformation', () => {
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

    expect(within(queryByText('Vendor')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Order type')).getByText(/\*/i)).toBeDefined();
  });
});
