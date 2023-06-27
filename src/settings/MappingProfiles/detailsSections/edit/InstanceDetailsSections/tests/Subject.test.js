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
import { Subject } from '../Subject';

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

global.fetch = jest.fn();

const { subjects } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const renderSubject = () => {
  const component = () => <Subject subjects={subjects} />;

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Subject" edit component', () => {
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
    } = renderSubject();
    const subjectTitle = await findByRole('button', { name: /subject/i, expanded: true });

    expect(subjectTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderSubject();
    const subjectTitle = await findByRole('button', { name: /subject/i, expanded: true });

    expect(subjectTitle).toBeInTheDocument();
  });
});
