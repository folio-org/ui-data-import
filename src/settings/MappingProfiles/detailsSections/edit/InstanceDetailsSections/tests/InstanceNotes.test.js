import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { noop } from 'lodash';
import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { InstanceNotes } from '../InstanceNotes';

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

global.fetch = jest.fn();

const { notes } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const renderInstanceNotes = () => {
  const component = () => (
    <InstanceNotes
      notes={notes}
      setReferenceTables={noop}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Instance notes" edit component', () => {
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
    } = renderInstanceNotes();
    const instanceNotesTitle = await findByRole('button', { name: /instance notes/i, expanded: true });

    expect(instanceNotesTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderInstanceNotes();
    const instanceNotesTitle = await findByRole('button', { name: /instance notes/i, expanded: true });

    expect(instanceNotesTitle).toBeInTheDocument();
  });
});
