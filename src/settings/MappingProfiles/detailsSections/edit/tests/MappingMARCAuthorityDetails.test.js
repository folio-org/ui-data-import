import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingMARCAuthorityDetails } from '../MappingMARCAuthorityDetails';

import { MARC_TYPES } from '../../../../../utils';

expect.extend(toHaveNoViolations);

const mappingMarcFieldProtectionFieldsProp = [];
const setReferenceTables = jest.fn();
const marcFieldProtectionFieldsProp = [];

const renderMappingMARCAuthorityDetails = ({ folioRecordType }) => {
  const component = () => (
    <MappingMARCAuthorityDetails
      marcFieldProtectionFields={marcFieldProtectionFieldsProp}
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFieldsProp}
      setReferenceTables={setReferenceTables}
      folioRecordType={folioRecordType}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingMARCAuthorityDetails', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  describe('when field mappings for MARC is "Updates"', () => {
    it('should have correct fields', async () => {
      const { findByRole } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });

      // eslint-disable-next-line no-irregular-whitespace
      expect(await findByRole('button', { name: /icon field mapping · marc authority · override protected fields/i })).toBeInTheDocument();
    });
  });
});
