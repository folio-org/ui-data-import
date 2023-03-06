import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../../../test/jest/helpers';

import { MappingMARCAuthorityDetails } from '../MappingMARCAuthorityDetails';
import { MARC_TYPES } from '../../../../../utils';

expect.extend(toHaveNoViolations);

const mappingMarcFieldProtectionFieldsProp = [];
const marcFieldProtectionFieldsProp = [];

const renderMappingMARCAuthorityDetails = ({ folioRecordType }) => {
  const component = (
    <MappingMARCAuthorityDetails
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFieldsProp}
      marcFieldProtectionFields={marcFieldProtectionFieldsProp}
      folioRecordType={folioRecordType}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MappingMARCAuthorityDetails', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should have correct section', () => {
    const { getByRole } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });

    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /icon field mapping · marc authority · override protected fields/i })).toBeInTheDocument();
  });

  it('"Override protected fields" section is expanded by default', () => {
    const { getByRole } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });

    // eslint-disable-next-line no-irregular-whitespace
    expect(getByRole('button', { name: /field mapping · marc authority · override protected fields/i }))
      .toHaveAttribute('aria-expanded', 'true');
  });
});
