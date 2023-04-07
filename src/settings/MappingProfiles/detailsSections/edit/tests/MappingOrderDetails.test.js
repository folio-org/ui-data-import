import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingOrderDetails } from '../MappingOrderDetails';
import { getInitialFields } from '../../../initialDetails';

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ORDER.type);

const setReferenceTablesMockProp = jest.fn();
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingOrderDetails = () => {
  const component = () => (
    <MappingOrderDetails
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMockProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};


describe('MappingOrderDetails edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingOrderDetails();

    await runAxeTest({ rootNode: container });
  });

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
