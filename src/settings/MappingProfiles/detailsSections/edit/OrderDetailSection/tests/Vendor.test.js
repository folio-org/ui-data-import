import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Vendor } from '../Vendor';

const setReferenceTablesMock = jest.fn();

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const vendorRefNumbers = [{
  order: 0,
  path: 'order.poLine.vendorDetail.referenceNumbers[]',
  fields: [{
    name: 'refNumber',
    enabled: true,
    path: 'order.poLine.vendorDetail.referenceNumbers[].refNumber',
    value: '',
  }, {
    name: 'refNumberType',
    enabled: true,
    path: 'order.poLine.vendorDetail.referenceNumbers[].refNumberType',
    value: '',
  }],
}];

const renderVendor = () => {
  const component = () => (
    <Vendor
      vendorRefNumbers={vendorRefNumbers}
      accountNumbers={[]}
      initialFields={{}}
      setReferenceTables={setReferenceTablesMock}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Vendor', () => {
  afterEach(() => {
    setReferenceTablesMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderVendor();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should render correct fields', async () => {
    const { getByText } = renderVendor();

    expect(getByText('Add vendor reference number')).toBeInTheDocument();
    expect(getByText('Vendor reference number')).toBeInTheDocument();
    expect(getByText('Vendor reference type')).toBeInTheDocument();
    expect(getByText('Account number')).toBeInTheDocument();
    expect(getByText('Instructions to vendor')).toBeInTheDocument();
  });

  describe('when click "Add vendor reference number" button', () => {
    it('fields for new vendor reference number should be rendered', () => {
      const {
        getByRole,
        getByText,
      } = renderVendor();

      const addVendorReferenceNumberButton = getByRole('button', { name: /Add vendor reference number/i });
      fireEvent.click(addVendorReferenceNumberButton);

      expect(getByText('Vendor reference number')).toBeInTheDocument();
      expect(getByText('Vendor reference type')).toBeInTheDocument();
    });

    describe('when click on trash icon button', () => {
      it('function for changing form should be called', () => {
        const {
          getByRole,
          getAllByRole,
        } = renderVendor();

        const addVendorReferenceNumberButton = getByRole('button', { name: /Add vendor reference number/i });
        fireEvent.click(addVendorReferenceNumberButton);

        const deleteButton = getAllByRole('button', { name: /delete this item/i })[0];
        fireEvent.click(deleteButton);

        expect(setReferenceTablesMock).toHaveBeenCalled();
      });
    });
  });
});
