import React from 'react';
import PropTypes from 'prop-types';

import { MARCTable } from '../../../../components/MARCTable';
import { OverrideProtectedFieldsTable } from './MARCDetailsSection';

import {
  FIELD_MAPPINGS_FOR_MARC,
  marcFieldProtectionSettingsShape,
} from '../../../../utils';

export const MappingMARCBibDetails = ({
  marcMappingDetails,
  fieldMappingsForMARCField,
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
}) => {
  const defaultFieldMappingForMARCColumns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];

  const renderUpdatesDetails = () => {
    const updatesFieldMappingForMARCColumns = ['arrows', 'field', 'indicator1', 'indicator2', 'subfield', 'addRemove'];

    return (
      <>
        <MARCTable
          columns={updatesFieldMappingForMARCColumns}
          fields={marcMappingDetails}
          onChange={setReferenceTables}
        />
        <OverrideProtectedFieldsTable
          marcFieldProtectionFields={marcFieldProtectionFields}
          mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
          setReferenceTables={setReferenceTables}
        />
      </>
    );
  };

  const renderMappingMARCBibDetails = () => {
    if (fieldMappingsForMARCField === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
      return renderUpdatesDetails();
    }

    return (
      <MARCTable
        columns={defaultFieldMappingForMARCColumns}
        fields={marcMappingDetails}
        onChange={setReferenceTables}
      />
    );
  };

  return fieldMappingsForMARCField && renderMappingMARCBibDetails();
};

MappingMARCBibDetails.propTypes = {
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  fieldMappingsForMARCField: PropTypes.string.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  marcMappingDetails: PropTypes.arrayOf(PropTypes.object.isRequired),
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape),
};

MappingMARCBibDetails.defaultProps = {
  marcMappingDetails: [{
    order: 0,
    field: { subfields: [{}] },
  }],
  marcFieldProtectionFields: [{}],
};
