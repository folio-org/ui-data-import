import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Classification } from '../Classification';

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

import { STATUS_CODES } from '../../../../../../utils';

global.fetch = jest.fn();

const { classifications } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const renderClassification = () => {
  const component = () => <Classification classifications={classifications} />;

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Classification" edit component', () => {
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
    } = renderClassification();
    const classificationTitle = await findByRole('button', { name: /classification/i, expanded: true });

    expect(classificationTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderClassification();
    const classificationTitle = await findByRole('button', { name: /classification/i, expanded: true });

    expect(classificationTitle).toBeInTheDocument();
  });
});
