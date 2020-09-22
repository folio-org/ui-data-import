import React from 'react';

import { MARCTable } from '../../../../components/MARCTable';
import { OverrideProtectedFieldsTable } from './MARCDetailsSection';

import { FIELD_MAPPINGS_FOR_MARC } from '../../../../utils';

export const MappingMARCBibDetails = ({
  marcMappingDetails,
  fieldMappingsForMARCField,
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
}) => {
  const marcTableFields = marcMappingDetails ||
    [{
      order: 0,
      field: { subfields: [{}] },
    }];
  const defaultFieldMappingForMARCColumns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];

  const renderUpdatesDetails = () => {
    const updatesFieldMappingForMARCColumns = ['arrows', 'field', 'indicator1', 'indicator2', 'subfield', 'addRemove'];

    return (
      <>
        <MARCTable
          columns={updatesFieldMappingForMARCColumns}
          fields={marcTableFields}
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
        fields={marcTableFields}
        onChange={setReferenceTables}
      />
    );
  };

  return fieldMappingsForMARCField && renderMappingMARCBibDetails();
};
