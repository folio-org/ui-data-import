import React from 'react';
import PropTypes from 'prop-types';

import {
  MARCTableView,
  OverrideProtectedFieldsTable,
} from '../../../../components';

import {
  FIELD_MAPPINGS_FOR_MARC,
  marcFieldProtectionSettingsShape,
  mappingMARCFieldShape,
} from '../../../../utils';

export const MappingMARCBibDetails = ({
  marcMappingDetails,
  marcMappingOption,
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
}) => {
  const defaultFieldMappingForMARCColumns = ['action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position'];

  const renderUpdatesDetails = () => {
    const updatesFieldMappingForMARCColumns = ['field', 'indicator1', 'indicator2', 'subfield'];

    return (
      <>
        <MARCTableView
          columns={updatesFieldMappingForMARCColumns}
          fields={marcMappingDetails}
        />
        <OverrideProtectedFieldsTable
          marcFieldProtectionFields={marcFieldProtectionFields}
          mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
        />
      </>
    );
  };

  const renderMappingMARCBibDetails = () => {
    if (marcMappingOption === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
      return renderUpdatesDetails();
    }

    return (
      <MARCTableView
        columns={defaultFieldMappingForMARCColumns}
        fields={marcMappingDetails}
      />
    );
  };

  return renderMappingMARCBibDetails();
};

MappingMARCBibDetails.propTypes = {
  marcMappingDetails: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired,
  marcMappingOption: PropTypes.string.isRequired,
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
};
