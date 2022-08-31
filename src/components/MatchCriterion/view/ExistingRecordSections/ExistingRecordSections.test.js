import React from 'react';

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

describe('ExistingRecordSections view', () => {
  it('should render a correct label', () => {
    const { getByText } = renderExistingSectionFolio(existingSectionFolio);

    expect(getByText('Test label')).toBeDefined();
  });
});
