import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  AccordionSet,
  Accordion,
  NoValue,
} from '@folio/stripes/components';

import {
  MARCTableView,
  OverrideProtectedFieldsTable,
  MappedHeader,
} from '../../../../components';

import {
  FIELD_MAPPINGS_FOR_MARC,
  MAPPING_DETAILS_HEADLINE,
  FIELD_MAPPINGS_FOR_MARC_OPTIONS,
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

  const header = (
    <MappedHeader
      headersToSeparate={[
        'ui-data-import.settings.profiles.select.mappingProfiles',
        MAPPING_DETAILS_HEADLINE.MARC_BIBLIOGRAPHIC.labelId,
        FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === marcMappingOption)?.label,
      ]}
    />
  );

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
        <Accordion
          id="view-field-mappings-for-marc-updates"
          label={header}
          separator={false}
        >
          {!isEmpty(marcMappingDetails) ? renderMARCUpdatesTable() : <NoValue />}
        </Accordion>
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
      <Accordion
        id="view-field-mappings-for-marc-modifications"
        label={header}
        separator={false}
      >
        <MARCTableView
          columns={defaultFieldMappingForMARCColumns}
          fields={marcMappingDetails}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderMappingMARCBibDetails()}
    </AccordionSet>
  );
};

MappingMARCBibDetails.propTypes = {
  marcMappingDetails: PropTypes.arrayOf(mappingMARCFieldShape.isRequired).isRequired,
  marcMappingOption: PropTypes.string.isRequired,
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
};
