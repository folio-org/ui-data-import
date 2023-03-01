import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../test/jest/helpers';

import ExistingSectionFolio from './ExistingSectionFolio';

expect.extend(toHaveNoViolations);

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

describe('ExistingRecordSections view', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderExistingSectionFolio(existingSectionFolio);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });


  it('should render a correct label', () => {
    const { getByText } = renderExistingSectionFolio(existingSectionFolio);

    expect(getByText('Test label')).toBeDefined();
  });
});
