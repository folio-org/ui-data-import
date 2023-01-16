import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingOrderDetails } from '../MappingOrderDetails';
import {
  getInitialDetails,
  getInitialFields,
} from '../../../initialDetails';

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ORDER.type);
const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.ORDER.type);
const referenceTablesProp = {
  notes: [initialFieldsProp.notes],
  contributors: [initialFieldsProp.contributors],
  productIds: [initialFieldsProp.productIds],
  vendorDetail: [initialFieldsProp.vendorDetail],
  fundDistribution: [initialFieldsProp.fundDistribution],
  locations: [initialFieldsProp.locations],
  volumes: [initialFieldsProp.volumes],
};
const setReferenceTablesMockProp = jest.fn();
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingOrderDetails = () => {
  const component = () => (
    <MappingOrderDetails
      mappingDetails={mappingDetailsProp}
      initialFields={initialFieldsProp}
      referenceTables={referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};


describe('MappingOrderDetails', () => {
  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingOrderDetails();

    expect(await findByRole('button', {
      name: /order information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /order line information/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /item details/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /po line details/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /vendor/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /cost details/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /fund distribution/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /location/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /physical resource details/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /e-resources details/i,
      expanded: true,
    })).toBeInTheDocument();
  });
});