import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import { OverrideProtectedFieldsTable } from '../../../../components';

import { marcFieldProtectionSettingsShape } from '../../../../utils';

export const MappingMARCAuthorityDetails = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
  folioRecordType,
}) => {
  return (
    <AccordionSet>
      <OverrideProtectedFieldsTable
        marcFieldProtectionFields={marcFieldProtectionFields}
        mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
        setReferenceTables={setReferenceTables}
        folioRecordType={folioRecordType}
        isViewMode={false}
        isEditable={false}
      />
    </AccordionSet>
  );
};

MappingMARCAuthorityDetails.propTypes = {
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape),
  folioRecordType: PropTypes.string,
};

MappingMARCAuthorityDetails.defaultProps = { marcFieldProtectionFields: [{}] };
