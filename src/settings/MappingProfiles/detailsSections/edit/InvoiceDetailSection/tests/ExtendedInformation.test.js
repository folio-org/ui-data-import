import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';
import { noop } from 'lodash';

import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { ExtendedInformation } from '../ExtendedInformation';
import INVOICE from '../../../../initialDetails/INVOICE';

const okapiProps = {
  tenant: 'test tenant',
  token: 'test token',
  url: 'test url',
};

const renderExtendedInformation = () => {
  const component = () => (
    <ExtendedInformation
      mappingFields={INVOICE.mappingFields}
      okapi={okapiProps}
      setReferenceTables={noop}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ExtendedInformation edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderExtendedInformation();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', () => {
    const { getByText } = renderExtendedInformation();

    expect(getByText('FOLIO invoice number')).toBeInTheDocument();
    expect(getByText('Payment method')).toBeInTheDocument();
    expect(getByText('Check subscription overlap')).toBeInTheDocument();
    expect(getByText('Export to accounting')).toBeInTheDocument();
    expect(getByText('Currency')).toBeInTheDocument();
    expect(getByText('Current exchange rate')).toBeInTheDocument();
    expect(getByText('Use set exchange rate')).toBeInTheDocument();
    expect(getByText('Set exchange rate')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderExtendedInformation();

    expect(within(queryByText('Payment method')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Currency')).getByText(/\*/i)).toBeDefined();
  });

  it('some fields should be disabled by default', () => {
    const { getByLabelText } = renderExtendedInformation();

    expect(getByLabelText('FOLIO invoice number')).toBeDisabled();
    expect(getByLabelText('Current exchange rate')).toBeDisabled();
    expect(getByLabelText('Set exchange rate')).toBeDisabled();
  });

  describe('when clicking "Use set exchange rate" checkbox', () => {
    it('"Set exchange rate" field should be enabled', () => {
      const { getByLabelText } = renderExtendedInformation();

      const useSetExchangeRate = getByLabelText('Use set exchange rate');

      fireEvent.click(useSetExchangeRate);

      expect(getByLabelText('Set exchange rate')).not.toBeDisabled();
    });
  });
});
