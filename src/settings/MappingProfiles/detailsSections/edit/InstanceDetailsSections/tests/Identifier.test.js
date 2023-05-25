import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { STATUS_CODES } from '../../../../../../utils';
import { Identifier } from '../Identifier';

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

global.fetch = jest.fn();

const { identifiers } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const renderIdentifier = () => {
  const component = () => <Identifier identifiers={identifiers} />;

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Identifier" edit component', () => {
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
      findByRole,
    } = renderIdentifier();
    const identifierTitle = await findByRole('button', { name: /identifier/i, expanded: true });

    expect(identifierTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderIdentifier();
    const identifierTitle = await findByRole('button', { name: /identifier/i, expanded: true });

    expect(identifierTitle).toBeInTheDocument();
  });
});
