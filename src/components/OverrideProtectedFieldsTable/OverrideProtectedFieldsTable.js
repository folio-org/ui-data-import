import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  omit,
  unionBy,
  noop,
  isEmpty,
} from 'lodash';

import {
  Col,
  Row,
  MultiColumnList,
  Checkbox,
  NoValue,
} from '@folio/stripes/components';

import { MappedHeader } from '..';

import {
  MAPPING_DETAILS_HEADLINE,
  marcFieldProtectionSettingsShape,
} from '../../utils';

export const OverrideProtectedFieldsTable = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
  isEditable,
}) => {
  const protectedFields = unionBy(mappingMarcFieldProtectionFields, marcFieldProtectionFields, 'id')
    .sort((a, b) => a.field.localeCompare(b.field));
  const noProtectedFieldsDefined = isEmpty(protectedFields);
  const emptyTableMessage = (
    <div style={{ margin: '-1rem' }}>
      {isEditable
        ? <FormattedMessage id="ui-data-import.fieldMappingsForMarc.updatesOverrides.noFields" />
        : <NoValue />
      }
    </div>
  );

  const updateForm = changedField => {
    if (changedField.override) {
      setReferenceTables('profile.marcFieldProtectionSettings',
        [...mappingMarcFieldProtectionFields, changedField]);
    } else {
      const newFields = mappingMarcFieldProtectionFields.filter(field => field.id !== changedField.id);

      setReferenceTables('profile.marcFieldProtectionSettings', [...newFields]);
    }
  };

  const handleOverrideFieldSelect = fieldId => {
    const changedFieldIndex = protectedFields.findIndex(field => field.id === fieldId);
    const changedField = omit(protectedFields[changedFieldIndex], ['rowIndex']);

    changedField.override = !protectedFields[changedFieldIndex].override;

    updateForm(changedField);
  };

  const columnMapping = {
    field: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.field" />,
    indicator1: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator1" />,
    indicator2: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.indicator2" />,
    subfield: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.subfield" />,
    data: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.data" />,
    override: <FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.header.override" />,
  };
  const visibleColumns = ['field', 'indicator1', 'indicator2', 'subfield', 'data', 'override'];
  const formatter = {
    override: protectedField => {
      return (
        <Checkbox
          checked={!!protectedField.override}
          onChange={() => handleOverrideFieldSelect(protectedField.id)}
          disabled={!isEditable}
        />
      );
    },
  };

  return (
    <>
      <Row
        between="xs"
        style={{
          marginTop: '20px',
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <Col>
          <MappedHeader
            mappedLabelId="ui-data-import.settings.profiles.select.mappingProfiles"
            mappableLabelId={MAPPING_DETAILS_HEADLINE.MARC_BIBLIOGRAPHIC?.labelId}
            mappingTypeLabelId="ui-data-import.fieldMappingsForMarc.overrideProtected"
            headlineProps={{ margin: 'small' }}
          />
          {isEditable && !noProtectedFieldsDefined && (
            <span>
              <FormattedMessage id="ui-data-import.fieldMappingsForMarc.updatesOverrides.subtext" />
            </span>
          )}
        </Col>
      </Row>
      <MultiColumnList
        contentData={protectedFields}
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        formatter={formatter}
        isEmptyMessage={emptyTableMessage}
      />
    </>
  );
};

OverrideProtectedFieldsTable.propTypes = {
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  setReferenceTables: PropTypes.func,
  isEditable: PropTypes.bool,
};

OverrideProtectedFieldsTable.defaultProps = {
  isEditable: false,
  setReferenceTables: noop,
};
