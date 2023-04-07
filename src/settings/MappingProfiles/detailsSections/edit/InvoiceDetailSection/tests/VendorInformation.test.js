import React from 'react';
import { within } from '@testing-library/react';
import { noop } from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { VendorInformation } from '../VendorInformation';

const okapiProps = {
  tenant: 'test tenant',
  token: 'test token',
  url: 'test url',
};

const renderVendorInformation = () => {
  const component = () => (
    <VendorInformation
      setReferenceTables={noop}
      filledVendorId=""
      accountingCodeOptions={[]}
      onSelectVendor={noop}
      onClearVendor={noop}
      okapi={okapiProps}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('VendorInformation edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderVendorInformation();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const { getByText } = renderVendorInformation();

    expect(getByText('Vendor invoice number')).toBeInTheDocument();
    expect(getByText('Vendor name')).toBeInTheDocument();
    expect(getByText('Accounting code')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderVendorInformation();

    expect(within(queryByText('Vendor invoice number')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Vendor name')).getByText(/\*/i)).toBeDefined();
  });

  it('some fields should be disabled by default', () => {
    const { getByLabelText } = renderVendorInformation();

    expect(getByLabelText(/vendor name/i)).toBeDisabled();
    expect(getByLabelText(/accounting code/i)).toBeDisabled();
  });
});
