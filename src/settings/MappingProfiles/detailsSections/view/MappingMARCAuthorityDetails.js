import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';

import { OverrideProtectedFieldsTable } from '../../../../components';

import { marcFieldProtectionSettingsShape } from '../../../../utils';

export const MappingMARCAuthorityDetails = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  folioRecordType,
}) => {
  return (
    <AccordionSet>
      <OverrideProtectedFieldsTable
        marcFieldProtectionFields={marcFieldProtectionFields}
        mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
        folioRecordType={folioRecordType}
      />
    </AccordionSet>
  );
};

MappingMARCAuthorityDetails.propTypes = {
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  folioRecordType: PropTypes.string,
};
