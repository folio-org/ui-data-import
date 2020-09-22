import React, {
  useState,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  cloneDeepWith,
  omit,
} from 'lodash';

import {
  Col,
  Row,
  MultiColumnList,
  Checkbox,
} from '@folio/stripes/components';

import { MappedHeader } from '../../../../../components/AccordionHeader';

import { MAPPING_DETAILS_HEADLINE } from '../../../../../utils';

export const OverrideProtectedFieldsTable = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  setReferenceTables,
}) => {
  const [protectedFields, setProtectedFields] = useState([]);

  useEffect(() => {
    const getProtectedFields = () => {
      const customizer = obj => mappingMarcFieldProtectionFields.find(item => item.id === obj.id);

      return cloneDeepWith(marcFieldProtectionFields, customizer);
    };

    setProtectedFields(getProtectedFields());
  }, []);

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

    setProtectedFields(fields => {
      const newState = [...fields];
      const changedField = newState[changedFieldIndex];

      newState[changedFieldIndex] = omit(changedField, ['rowIndex']);
      newState[changedFieldIndex].override = !fields[changedFieldIndex].override;

      updateForm(changedField);

      return newState;
    });
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
        />
      );
    },
  };

  return (
    <>
      <Row
        between="xs"
        style={{ marginTop: '20px' }}
      >
        <Col>
          <MappedHeader
            mappedLabelId="ui-data-import.settings.profiles.select.mappingProfiles"
            mappableLabelId={MAPPING_DETAILS_HEADLINE.MARC_BIBLIOGRAPHIC?.labelId}
            mappingTypeLabelId="ui-data-import.fieldMappingsForMarc.overrideProtected"
            headlineProps={{ margin: 'small' }}
          />
          <span>
            <FormattedMessage id="ui-data-import.fieldMappingsForMarc.updatesOverrides.subtext" />
          </span>
        </Col>
      </Row>
      <MultiColumnList
        contentData={protectedFields}
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        formatter={formatter}
      />
    </>
  );
};
