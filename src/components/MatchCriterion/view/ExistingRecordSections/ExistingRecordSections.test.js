import React from 'react';
import { waitFor } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import ExistingSectionFolio from './ExistingSectionFolio';

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
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ExistingRecordSections view component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderExistingSectionFolio(existingSectionFolio);

    await runAxeTest({ rootNode: container });
  });

  it('should render a correct label', async () => {
    const { findByText } = renderExistingSectionFolio(existingSectionFolio);

    await waitFor(() => expect(findByText('Test label')).toBeDefined());
  });
});
