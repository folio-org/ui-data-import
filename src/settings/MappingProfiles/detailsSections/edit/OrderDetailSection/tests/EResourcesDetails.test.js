import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { EResourcesDetails } from '../EResourcesDetails';

import {
  BOOLEAN_ACTIONS,
  STATUS_CODES,
} from '../../../../../../utils';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingBoolFieldValue: () => ['ALL_FALSE', 'ALL_FALSE'],
  useFieldMappingFieldValue: () => ['Open'],
  useFieldMappingValueFromLookup: () => ['testUUID', 'testMapping'],
  useDisabledOrderFields: () => ({
    dismissCreateInventory: false,
    dismissElectronicDetails: false,
  }),
}));

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderEResourcesDetails = () => {
  const component = () => (
    <EResourcesDetails
      setReferenceTables={() => {}}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('EResourcesDetails edit component', () => {
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
    const {
      container,
      findByText,
    } = renderEResourcesDetails();

    const eResourceTitle = await findByText('E-resources details');

    expect(eResourceTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderEResourcesDetails();

    const eResourceTitle = await findByText('E-resources details');

    expect(eResourceTitle).toBeInTheDocument();

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

  it('should render info icons for sometimes required fields', async () => {
    const { findByText } = renderEResourcesDetails();

    const createInventoryField = await findByText('Create inventory');
    const materialTypeField = await findByText('Material type');

    expect(createInventoryField.lastElementChild.innerHTML).toEqual('InfoPopover');
    expect(materialTypeField.lastElementChild.innerHTML).toEqual('InfoPopover');
  });

  describe('when click on unchecked "Activation status" checkbox', () => {
    it('checkbox should be checked', async () => {
      const { findByLabelText } = renderEResourcesDetails();

      const activationStatusCheckbox = await findByLabelText('Activation status');
      fireEvent.click(activationStatusCheckbox);

      expect(activationStatusCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });

  describe('when click on unchecked "Trial" checkbox', () => {
    it('checkbox should be checked', async () => {
      const { findByLabelText } = renderEResourcesDetails();

      const trialCheckbox = await findByLabelText('Trial');
      fireEvent.click(trialCheckbox);

      expect(trialCheckbox.value).toBe(BOOLEAN_ACTIONS.ALL_TRUE);
    });
  });
});
