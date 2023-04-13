import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingOrderDetails } from '../MappingOrderDetails';
import { getInitialFields } from '../../../initialDetails';

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ORDER.type);

const setReferenceTablesMockProp = jest.fn();
const okapi = buildOkapi();

const renderMappingOrderDetails = () => {
  const component = () => (
    <MappingOrderDetails
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMockProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};


describe('MappingOrderDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
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
      findByRole,
    } = renderMappingOrderDetails();

    const orderInformationSection = await findByRole('button', { name: /order information/i });

    expect(orderInformationSection).toBeInTheDocument();

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
