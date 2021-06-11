import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  AccordionSet,
  Accordion,
  Button,
} from '@folio/stripes/components';

import {
  MARCTable,
  OverrideProtectedFieldsTable,
  MappedHeader,
} from '../../../../components';

import {
  FIELD_MAPPINGS_FOR_MARC,
  MAPPING_DETAILS_HEADLINE,
  FIELD_MAPPINGS_FOR_MARC_OPTIONS,
  marcFieldProtectionSettingsShape,
} from '../../../../utils';

import css from '../../MappingProfiles.css';

export const MappingMARCBibDetails = ({
  marcMappingDetails,
  fieldMappingsForMARCField,
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  onUpdateFieldAdd,
  setReferenceTables,
}) => {
  const defaultFieldMappingForMARCColumns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];

  const header = (
    <MappedHeader
      headersToSeparate={[
        'ui-data-import.settings.profiles.select.mappingProfiles',
        MAPPING_DETAILS_HEADLINE.MARC_BIBLIOGRAPHIC.labelId,
        FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARCField)?.label,
      ]}
    />
  );

  const renderUpdatesDetails = () => {
    const updatesFieldMappingForMARCColumns = ['arrows', 'field', 'indicator1', 'indicator2', 'subfield', 'addRemove'];

    const addFieldButton = (
      <Button
        onClick={onUpdateFieldAdd}
        buttonClass={css.addFieldButton}
        bottomMargin0
      >
        <FormattedMessage id="ui-data-import.fieldMappingsForMarc.addField" />
      </Button>
    );

    const renderMARCUpdatesTable = () => (
      <MARCTable
        columns={updatesFieldMappingForMARCColumns}
        fields={marcMappingDetails}
        onChange={setReferenceTables}
        isFirstRowRemovable
        fillNewRowFieldsWithDefaultValue
      />
    );

    return (
      <>
        <Accordion
          id="edit-field-mappings-for-marc-updates"
          label={header}
          separator={false}
        >
          <div style={{ paddingTop: '10px' }}>
            <FormattedMessage id="ui-data-import.fieldMappingsForMarc.updates.subtext" />
          </div>
          {isEmpty(marcMappingDetails) ? addFieldButton : renderMARCUpdatesTable()}
        </Accordion>
        <OverrideProtectedFieldsTable
          marcFieldProtectionFields={marcFieldProtectionFields}
          mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
          setReferenceTables={setReferenceTables}
          isEditable
        />
      </>
    );
  };

  const renderMappingMARCBibDetails = () => {
    if (fieldMappingsForMARCField === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
      return renderUpdatesDetails();
    }

    return (
      <Accordion
        id="edit-field-mappings-for-marc-modifications"
        label={header}
        separator={false}
      >
        <MARCTable
          columns={defaultFieldMappingForMARCColumns}
          fields={marcMappingDetails}
          onChange={setReferenceTables}
        />
      </Accordion>
    );
  };

  return fieldMappingsForMARCField && (
    <AccordionSet>
      {renderMappingMARCBibDetails()}
    </AccordionSet>
  );
};

MappingMARCBibDetails.propTypes = {
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  fieldMappingsForMARCField: PropTypes.string.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  marcMappingDetails: PropTypes.arrayOf(PropTypes.object.isRequired),
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape),
  onUpdateFieldAdd: PropTypes.func,
};

MappingMARCBibDetails.defaultProps = { marcFieldProtectionFields: [{}] };
