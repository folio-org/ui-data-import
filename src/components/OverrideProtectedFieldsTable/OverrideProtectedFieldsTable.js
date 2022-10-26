import React, {
  useState,
  useEffect,
} from 'react';
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
  Accordion,
} from '@folio/stripes/components';

import { MappedHeader } from '..';

import {
  MAPPING_DETAILS_HEADLINE,
  marcFieldProtectionSettingsShape,
  MARC_TYPES,
} from '../../utils';

export const OverrideProtectedFieldsTable = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
  folioRecordType,
  isEditable,
  isAccordionOpen,
  isViewMode,
}) => {
  const protectedFields = unionBy(mappingMarcFieldProtectionFields, marcFieldProtectionFields, 'id')
    .sort((a, b) => a.field.localeCompare(b.field));
  const noProtectedFieldsDefined = isEmpty(protectedFields);
  const hasOverrideProtectedFields = protectedFields.some(field => field.override);
  const [isOpen, setIsOpen] = useState(isAccordionOpen || hasOverrideProtectedFields);
  const [isCheckboxesActive] = useState(isEditable);

  useEffect(() => {
    if (isAccordionOpen || hasOverrideProtectedFields) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [hasOverrideProtectedFields, isAccordionOpen]);

  const emptyTableMessage = (
    <div style={{ margin: '-1rem' }}>
      {isAccordionOpen
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
        <FormattedMessage id="ui-data-import.fieldMappingsForMarc.overrideProtected">
          {([ariaLabel]) => (
            <Checkbox
              checked={!!protectedField.override}
              onChange={() => handleOverrideFieldSelect(protectedField.id)}
              disabled={!isCheckboxesActive}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      );
    },
  };
  const editModeIdPrefix = isAccordionOpen ? 'edit-' : '';

  const header = (
    <MappedHeader
      headersToSeparate={[
        'ui-data-import.settings.profiles.select.mappingProfiles',
        MAPPING_DETAILS_HEADLINE[folioRecordType].labelId,
        'ui-data-import.fieldMappingsForMarc.overrideProtected',
      ]}
    />
  );

  return (
    <Accordion
      id={`${editModeIdPrefix}override-protected-section`}
      label={header}
      separator={false}
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <Row
        between="xs"
        style={{ margin: 0 }}
      >
        <Col>
          {isAccordionOpen && !noProtectedFieldsDefined && folioRecordType !== MARC_TYPES.MARC_AUTHORITY && (
            <span>
              <FormattedMessage id="ui-data-import.fieldMappingsForMarc.updatesOverrides.subtext" />
            </span>
          )}
          {!isViewMode && folioRecordType === MARC_TYPES.MARC_AUTHORITY && (
            <div style={{ padding: '10px' }}>
              <FormattedMessage id="ui-data-import.fieldMappingsForMarc.override.subtext" />
            </div>
          )}
        </Col>
      </Row>
      <MultiColumnList
        columnIdPrefix={`${editModeIdPrefix}override-protected`}
        contentData={protectedFields}
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        formatter={formatter}
        isEmptyMessage={emptyTableMessage}
      />
    </Accordion>
  );
};

OverrideProtectedFieldsTable.propTypes = {
  marcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  setReferenceTables: PropTypes.func,
  folioRecordType: PropTypes.string,
  isEditable: PropTypes.bool,
  isAccordionOpen: PropTypes.bool,
  isViewMode: PropTypes.bool,
};

OverrideProtectedFieldsTable.defaultProps = {
  isViewMode: true,
  isEditable: false,
  isAccordionOpen: true,
  setReferenceTables: noop,
};
