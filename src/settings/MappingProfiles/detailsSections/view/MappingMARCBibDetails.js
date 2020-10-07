import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { NoValue } from '@folio/stripes/components';

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

    const renderMARCUpdatesTable = () => (
      <MARCTableView
        columns={updatesFieldMappingForMARCColumns}
        fields={marcMappingDetails}
      />
    );

    return (
      <>
        {!isEmpty(marcMappingDetails) ? renderMARCUpdatesTable() : <NoValue />}
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
