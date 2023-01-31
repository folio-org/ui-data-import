import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { EResourcesDetails } from '../EResourcesDetails';

import { BOOLEAN_ACTIONS } from '../../../../../../utils';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderEResourcesDetails = (
  activationStatusCheckbox = BOOLEAN_ACTIONS.ALL_FALSE,
  trialCheckbox = BOOLEAN_ACTIONS.ALL_FALSE,
) => {
  const component = () => (
    <EResourcesDetails
      activationStatusCheckbox={activationStatusCheckbox}
      trialCheckbox={trialCheckbox}
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

  it('should render info icons for sometimes required fields', () => {
    const { queryByText } = renderEResourcesDetails();

    expect(within(queryByText('Create inventory')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Material type')).getByText(/InfoPopover/i)).toBeDefined();
  });

  describe('when click on unchecked "Activation status" checkbox', () => {
    it('checkbox should be checked', () => {
      const { getByLabelText } = renderEResourcesDetails();

      const activationStatusCheckbox = getByLabelText('Activation status');
      fireEvent.click(activationStatusCheckbox);

      expect(activationStatusCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });

  describe('when click on checked "Activation status" checkbox', () => {
    it('checkbox should be unchecked', () => {
      const { getByLabelText } = renderEResourcesDetails(BOOLEAN_ACTIONS.ALL_TRUE, BOOLEAN_ACTIONS.ALL_TRUE);

      const activationStatusCheckbox = getByLabelText('Activation status');
      fireEvent.click(activationStatusCheckbox);

      expect(activationStatusCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_FALSE);
    });
  });

  describe('when click on unchecked "Trial" checkbox', () => {
    it('checkbox should be checked', () => {
      const { getByLabelText } = renderEResourcesDetails();

      const trialCheckbox = getByLabelText('Trial');
      fireEvent.click(trialCheckbox);

      expect(trialCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });

  describe('when click on checked "Trial" checkbox', () => {
    it('checkbox should be unchecked', () => {
      const { getByLabelText } = renderEResourcesDetails(BOOLEAN_ACTIONS.ALL_TRUE, BOOLEAN_ACTIONS.ALL_TRUE);

      const trialCheckbox = getByLabelText('Trial');
      fireEvent.click(trialCheckbox);

      expect(trialCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_FALSE);
    });
  });
});
