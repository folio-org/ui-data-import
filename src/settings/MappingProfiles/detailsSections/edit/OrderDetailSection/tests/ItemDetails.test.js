import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';
import '../../../../../../../test/jest/__mock__';

import { STATUS_CODES } from '../../../../../../utils';
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

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderItemDetails = () => {
  const component = () => (
    <ItemDetails
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ItemDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderItemDetails();

    const itemDetailsTitle = await findByText('Item details');

    expect(itemDetailsTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const {
      getByText,
      findByText,
    } = renderItemDetails();

    const itemDetailsTitle = await findByText('Item details');

    expect(itemDetailsTitle).toBeInTheDocument();

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

  it('should render required fields', async () => {
    const { findByText } = renderItemDetails();

    const titleField = await findByText('Title');

    expect(titleField.lastElementChild.innerHTML).toEqual('*');
  });

  describe('when click Add contributor button', () => {
    it('fields for new contributor should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderItemDetails();

      const addContributorButton = await findByRole('button', { name: /Add contributor/i });
      fireEvent.click(addContributorButton);

      expect(getByText('Contributor')).toBeInTheDocument();
      expect(getByText('Contributor type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderItemDetails();

        const addContributorButton = await findByRole('button', { name: /Add contributor/i });
        fireEvent.click(addContributorButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });

  describe('when click "Add product ID and product ID type" button', () => {
    it('fields for new contributor type should be rendered', async () => {
      const {
        findByRole,
        getByText,
      } = renderItemDetails();

      const addContributorTypeButton = await findByRole('button', { name: /Add product ID and product ID type/i });
      fireEvent.click(addContributorTypeButton);

      expect(getByText('Product ID')).toBeInTheDocument();
      expect(getByText('Qualifier')).toBeInTheDocument();
      expect(getByText('Product ID type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', async () => {
        const {
          findByRole,
          getAllByRole,
        } = renderItemDetails();

        const addContributorTypeButton = await findByRole('button', { name: /Add product ID and product ID type/i });
        fireEvent.click(addContributorTypeButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[1];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
