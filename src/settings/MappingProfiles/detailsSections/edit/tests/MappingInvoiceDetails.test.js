import React from 'react';
import { noop } from 'lodash';
import faker from 'faker';

import '../../../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingInvoiceDetails } from '../MappingInvoiceDetails';
import {
  getInitialFields,
  getInitialDetails,
} from '../../../initialDetails';

import * as utils from '../../utils';

const organizationMock = {
  id: 'orgId',
  name: 'org name',
  erpCode: 'erpCode',
  accounts: [{
    appSystemNo: 'appSystemNo1',
    accountNo: 'accountNo1',
  }],
};

const mockVendorUUID = faker.random.uuid();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useFieldMappingValueFromLookup: () => [mockVendorUUID],
  useOrganizationValue: () => ({
    organization: organizationMock,
    organizationName: organizationMock.name,
    isLoading: false
  }),
}));

const getAccountingCodeOptions = jest.spyOn(utils, 'getAccountingCodeOptions');
const getAccountingNumberOptions = jest.spyOn(utils, 'getAccountingNumberOptions');

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INVOICE.type);
const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);
const getMappingSubfieldsFieldValueProp = jest.fn(() => '');
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingInvoiceDetails = () => {
  const component = () => (
    <MappingInvoiceDetails
      mappingDetails={mappingDetailsProp}
      initialFields={initialFieldsProp}
      setReferenceTables={noop}
      getMappingSubfieldsFieldValue={getMappingSubfieldsFieldValueProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingInvoiceDetails', () => {
  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingInvoiceDetails();

    expect(await findByRole('button', {
      name: /invoice information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice adjustments/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /vendor information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /extended information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line fund distribution/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /invoice line adjustments/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  describe('when vendor is selected', () => {
    it('should get accounting code options', () => {
      renderMappingInvoiceDetails();

      expect(getAccountingCodeOptions).toHaveBeenCalledWith(organizationMock);
    });

    it('should get account number options', () => {
      renderMappingInvoiceDetails();

      expect(getAccountingNumberOptions).toHaveBeenCalledWith(organizationMock);
    });
  });
});
