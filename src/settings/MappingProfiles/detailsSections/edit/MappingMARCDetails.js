import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { isEmpty } from 'lodash';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  MARCTable,
  MappedHeader,
} from '../../../../components';

import {
  FIELD_MAPPINGS_FOR_MARC,
  MAPPING_DETAILS_HEADLINE,
  marcFieldProtectionSettingsShape,
} from '../../../../utils';

export const MappingMARCDetails = ({
  mappingDetails,
  marcFieldProtectionSettings,
  mappingMarcFieldProtectionSettings,
  fieldMappingsForMARC,
  setReferenceTables,
}) => {
  const marcTableFields = mappingDetails?.marcMappingDetails ||
    [{
      order: 0,
      field: { subfields: [{}] },
    }];

  const getActualMarcFieldProtectionSettings = (incoming, existing) => {
    let newIncomingSettings = [...incoming];
    const newExisting = [...existing];

    incoming.forEach((init, indexInit) => {
      newExisting.forEach((exist, indexExist) => {
        if (init.id === exist.id) {
          newIncomingSettings = [
            ...newIncomingSettings.slice(0, indexInit),
            exist,
            ...newIncomingSettings.slice(indexInit + 1),
          ];

          newExisting.splice(indexExist, 1);
        }
      });
    });

    return [
      ...newIncomingSettings,
      ...newExisting,
    ];
  };

  const defaultFieldMappingForMARCColumns = ['arrows', 'action', 'field', 'indicator1', 'indicator2',
    'subfield', 'subaction', 'data', 'position', 'addRemove'];
  const updatesFieldMappingForMARCColumns = ['arrows', 'field', 'indicator1', 'indicator2', 'subfield', 'addRemove'];
  const overrideFieldMappingForMARCColumns = ['field', 'indicator1', 'indicator2', 'subfield', 'data', 'override'];

  const actualMarcFieldProtectionSettings = getActualMarcFieldProtectionSettings(marcFieldProtectionSettings, mappingMarcFieldProtectionSettings);

  const renderMappingMARCDetails = () => {
    if (fieldMappingsForMARC === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
      return (
        <>
          <MARCTable
            columns={updatesFieldMappingForMARCColumns}
            fields={marcTableFields}
            onChange={setReferenceTables}
          />
          {!isEmpty(actualMarcFieldProtectionSettings) && (
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
              <MARCTable
                columns={overrideFieldMappingForMARCColumns}
                fields={actualMarcFieldProtectionSettings}
                customColumnWidth={{ data: '100px' }}
                isMarcFieldProtectionSettings
                onChange={setReferenceTables}
              />
            </>
          )}
        </>
      );
    }

    return (
      <MARCTable
        columns={defaultFieldMappingForMARCColumns}
        fields={marcTableFields}
        onChange={setReferenceTables}
      />
    );
  };

  return fieldMappingsForMARC && renderMappingMARCDetails();
};

MappingMARCDetails.propTypes = {
  mappingDetails: PropTypes.object.isRequired,
  marcFieldProtectionSettings: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  mappingMarcFieldProtectionSettings: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  fieldMappingsForMARC: PropTypes.string.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
