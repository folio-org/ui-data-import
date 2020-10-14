import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import { Button } from '@folio/stripes-components';

import {
  MARCTable,
  OverrideProtectedFieldsTable,
} from '../../../../components';

import {
  FIELD_MAPPINGS_FOR_MARC,
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
        {isEmpty(marcMappingDetails) ? addFieldButton : renderMARCUpdatesTable()}
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
  onUpdateFieldAdd: PropTypes.func,
};

MappingMARCBibDetails.defaultProps = { marcFieldProtectionFields: [{}] };
