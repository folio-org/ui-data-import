import React from 'react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Contributor } from '../Contributor';

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

global.fetch = jest.fn();

const { contributors } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const renderContributor = () => {
  const component = () => (
    <Contributor
      contributors={contributors}
      setReferenceTables={noop}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Contributor" edit component', () => {
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
    } = renderContributor();
    const contributorTitle = await findByRole('button', { name: /contributor/i, expanded: true });

    expect(contributorTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderContributor();
    const contributorTitle = await findByRole('button', { name: /contributor/i, expanded: true });

    expect(contributorTitle).toBeInTheDocument();
  });
});
