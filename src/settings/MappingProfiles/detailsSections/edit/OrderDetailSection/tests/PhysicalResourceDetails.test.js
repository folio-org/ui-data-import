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

import { PhysicalResourceDetails } from '../PhysicalResourceDetails';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  InfoPopover: () => <span>InfoPopover</span>,
}));

jest.mock('../../../hooks', () => ({
  useFieldMappingFieldValue: () => ['Open'],
  useFieldMappingValueFromLookup: () => ['', ''],
  useFieldMappingFieldValueByPath: () => ['"None"'],
  useFieldMappingRefValues: () => [[{
    order: 0,
    path: 'order.poLine.physical.volumes[]',
    fields: [{
      name: 'volumes',
      enabled: true,
      path: 'order.poLine.physical.volumes[]',
      value: '',
    }],
  }]],
}));

const setReferenceTablesMock = jest.fn();

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderPhysicalResourceDetails = () => {
  const component = () => (
    <PhysicalResourceDetails
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('PhysicalResourceDetails', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should render correct fields', async () => {
    const { getByText } = renderPhysicalResourceDetails();

    expect(getByText('Material supplier')).toBeInTheDocument();
    expect(getByText('Receipt due')).toBeInTheDocument();
    expect(getByText('Expected receipt date')).toBeInTheDocument();
    expect(getByText('Create inventory')).toBeInTheDocument();
    expect(getByText('Material type')).toBeInTheDocument();
    expect(getByText('Add volume')).toBeInTheDocument();
    expect(getByText('Volume')).toBeInTheDocument();
  });

  it('should render info icons for sometimes required fields', () => {
    const { queryByText } = renderPhysicalResourceDetails();

    expect(within(queryByText('Create inventory')).getByText(/InfoPopover/i)).toBeDefined();
    expect(within(queryByText('Material type')).getByText(/InfoPopover/i)).toBeDefined();
  });

  describe('when click "Add volume" button', () => {
    it('fields for new volume should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderPhysicalResourceDetails();

      const addVolumeButton = getByRole('button', { name: /Add volume/i });
      fireEvent.click(addVolumeButton);

      expect(getByText('Volume')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderPhysicalResourceDetails();

        const addVolumeButton = getByRole('button', { name: /Add volume/i });
        fireEvent.click(addVolumeButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
