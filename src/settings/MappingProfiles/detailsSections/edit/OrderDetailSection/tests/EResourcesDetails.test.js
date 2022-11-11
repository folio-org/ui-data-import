import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { EResourcesDetails } from '../EResourcesDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderEResourcesDetails = () => {
  const component = () => (
    <EResourcesDetails
      activationStatusCheckbox={BOOLEAN_ACTIONS.ALL_FALSE}
      trialCheckbox={BOOLEAN_ACTIONS.ALL_FALSE}
      accessProviderId={null}
      setReferenceTables={() => {}}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('EResourcesDetails', () => {
  it('should render correct fields', async () => {
    const { getByText } = renderEResourcesDetails();

    expect(getByText('Access provider')).toBeInTheDocument();
    expect(getByText('Activation status')).toBeInTheDocument();
    expect(getByText('Activation due')).toBeInTheDocument();
    expect(getByText('Create inventory')).toBeInTheDocument();
    expect(getByText('Material type')).toBeInTheDocument();
    expect(getByText('Trial')).toBeInTheDocument();
    expect(getByText('Expected activation')).toBeInTheDocument();
    expect(getByText('User limit')).toBeInTheDocument();
    expect(getByText('URL')).toBeInTheDocument();
  });
});
