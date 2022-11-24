import React from 'react';
import { within } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { POLineDetails } from '../POLineDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderPOLineDetails = () => {
  const component = () => (
    <POLineDetails
      automaticExportCheckbox={BOOLEAN_ACTIONS.ALL_FALSE}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('POLineDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderPOLineDetails();

    expect(getByText('POL number')).toBeInTheDocument();
    expect(getByText('Acquisition method')).toBeInTheDocument();
    expect(getByText('Automatic export')).toBeInTheDocument();
    expect(getByText('Order format')).toBeInTheDocument();
    expect(getByText('Created on')).toBeInTheDocument();
    expect(getByText('Receipt date')).toBeInTheDocument();
    expect(getByText('Receipt status')).toBeInTheDocument();
    expect(getByText('Source')).toBeInTheDocument();
    expect(getByText('Donor')).toBeInTheDocument();
    expect(getByText('Selector')).toBeInTheDocument();
    expect(getByText('Requester')).toBeInTheDocument();
    expect(getByText('Cancellation restriction')).toBeInTheDocument();
    expect(getByText('Rush')).toBeInTheDocument();
    expect(getByText('Receiving workflow')).toBeInTheDocument();
    expect(getByText('Cancellation description')).toBeInTheDocument();
    expect(getByText('Line description')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderPOLineDetails();

    expect(within(queryByText('Acquisition method')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Order format')).getByText(/\*/i)).toBeDefined();
    expect(within(queryByText('Receiving workflow')).getByText(/\*/i)).toBeDefined();
  });
});
