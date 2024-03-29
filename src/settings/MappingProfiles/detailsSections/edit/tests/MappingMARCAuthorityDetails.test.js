import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';
import '../../../../../../test/jest/__mock__';

import { MappingMARCAuthorityDetails } from '../MappingMARCAuthorityDetails';

import { MARC_TYPES } from '../../../../../utils';

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

describe('MappingMARCAuthorityDetails edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });

    await runAxeTest({ rootNode: container });
  });

  describe('when field mappings for MARC is "Updates"', () => {
    it('should have correct fields', async () => {
      const { findByRole } = renderMappingMARCAuthorityDetails({ folioRecordType: MARC_TYPES.MARC_AUTHORITY });

      // eslint-disable-next-line no-irregular-whitespace
      expect(await findByRole('button', { name: /icon field mapping · marc authority · override protected fields/i })).toBeInTheDocument();
    });
  });
});
