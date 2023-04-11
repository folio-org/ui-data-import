import React from 'react';
import { waitFor } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildStripes,
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import ExistingSectionFolio from './ExistingSectionFolio';

global.fetch = jest.fn();

const stripes = buildStripes();
const existingSectionFolio = {
  existingRecordFields: [{ value: 'field' }],
  existingRecordType: 'INSTANCE',
  existingRecordFieldLabel: <span>Test label</span>,
};

const renderExistingSectionFolio = ({
  existingRecordFields,
  existingRecordType,
  existingRecordFieldLabel,
}) => {
  const component = (
    <ExistingSectionFolio
      existingRecordFields={existingRecordFields}
      existingRecordType={existingRecordType}
      existingRecordFieldLabel={existingRecordFieldLabel}
      stripes={stripes}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ExistingRecordSections view component', () => {
  beforeEach(() => {
    global.fetch.mockReturnValue({
      ok: true,
      json: async () => ({
        identifierTypes: [{
          id: '1',
          name: 'ASIN',
          source: 'folio',
        }],
      }),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderExistingSectionFolio(existingSectionFolio);

    await waitFor(() => expect(findByText('Test label')).toBeDefined());

    await runAxeTest({ rootNode: container });
  });

  it('should render a correct label', async () => {
    const { findByText } = renderExistingSectionFolio(existingSectionFolio);

    await waitFor(() => expect(findByText('Test label')).toBeDefined());
  });
});
