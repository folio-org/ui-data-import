import React from 'react';
import {
  fireEvent,
  within,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { ItemDetails } from '../ItemDetails';

const setReferenceTablesMock = jest.fn();
jest.mock('../../../hooks', () => ({
  useFieldMappingRefValues: () => [[{
    order: 0,
    path: 'order.poLine.contributors[]',
    fields: [{
      name: 'contributor',
      enabled: true,
      path: 'order.poLine.contributors[].contributor',
      value: '',
    }, {
      name: 'contributorNameTypeId',
      enabled: true,
      path: 'order.poLine.contributors[].contributorNameTypeId',
      value: '',
    }],
  }], [{
    order: 0,
    path: 'order.poLine.details.productIds[]',
    fields: [{
      name: 'productId',
      enabled: true,
      path: 'order.poLine.details.productIds[].productId',
      value: '',
    }, {
      name: 'qualifier',
      enabled: true,
      path: 'order.poLine.details.productIds[].qualifier',
      value: '',
    }, {
      name: 'productIdType',
      enabled: true,
      path: 'order.poLine.details.productIds[].productIdType',
      value: '',
    }],
  }]],
}));

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderItemDetails = () => {
  const component = () => (
    <ItemDetails
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ItemDetails', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderItemDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderItemDetails();

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Receiving note')).toBeInTheDocument();
    expect(getByText('Must acknowledge receiving note')).toBeInTheDocument();
    expect(getByText('Subscription from')).toBeInTheDocument();
    expect(getByText('Subscription to')).toBeInTheDocument();
    expect(getByText('Subscription interval')).toBeInTheDocument();
    expect(getByText('Publication date')).toBeInTheDocument();
    expect(getByText('Publisher')).toBeInTheDocument();
    expect(getByText('Edition')).toBeInTheDocument();
    expect(getByText('Add contributor')).toBeInTheDocument();
    expect(getByText('Contributor')).toBeInTheDocument();
    expect(getByText('Contributor type')).toBeInTheDocument();
    expect(getByText('Add product ID and product ID type')).toBeInTheDocument();
    expect(getByText('Product ID')).toBeInTheDocument();
    expect(getByText('Qualifier')).toBeInTheDocument();
    expect(getByText('Product ID type')).toBeInTheDocument();
    expect(getByText('Internal note')).toBeInTheDocument();
  });

  it('should render required fields', () => {
    const { queryByText } = renderItemDetails();

    expect(within(queryByText('Title')).getByText(/\*/i)).toBeDefined();
  });

  describe('when click "Add contributor" button', () => {
    it('fields for new contributor should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderItemDetails();

      const addContributorButton = getByRole('button', { name: /Add contributor/i });
      fireEvent.click(addContributorButton);

      expect(getByText('Contributor')).toBeInTheDocument();
      expect(getByText('Contributor type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderItemDetails();

        const addContributorButton = getByRole('button', { name: /Add contributor/i });
        fireEvent.click(addContributorButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('when click "Add product ID and product ID type" button', () => {
    it('fields for new contributor type should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderItemDetails();

      const addContributorTypeButton = getByRole('button', { name: /Add product ID and product ID type/i });
      fireEvent.click(addContributorTypeButton);

      expect(getByText('Product ID')).toBeInTheDocument();
      expect(getByText('Qualifier')).toBeInTheDocument();
      expect(getByText('Product ID type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderItemDetails();

        const addContributorTypeButton = getByRole('button', { name: /Add product ID and product ID type/i });
        fireEvent.click(addContributorTypeButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[1];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
