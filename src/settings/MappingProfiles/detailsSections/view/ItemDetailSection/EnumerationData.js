import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const EnumerationData = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const enumeration = getFieldValue(mappingDetails, 'enumeration', 'value');
  const chronology = getFieldValue(mappingDetails, 'chronology', 'value');
  const volume = getFieldValue(mappingDetails, 'volume', 'value');
  const yearsAndCaptions = getFieldValue(mappingDetails, 'yearCaption', 'subfields');
  const yearsAndCaptionsRepeatableAction = getFieldValue(mappingDetails,
    'yearCaption', 'repeatableFieldAction');

  const yearsAndCaptionsVisibleColumns = ['yearCaption'];
  const yearsAndCaptionsMapping = {
    yearCaption: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`} />
    ),
  };
  const yearsAndCaptionsFormatter = { yearCaption: x => x?.yearCaption || noValueElement };
  const yearsAndCaptionsFieldsMap = [
    {
      field: 'yearCaption',
      key: 'value',
    },
  ];
  const yearsAndCaptionsData = transformSubfieldsData(yearsAndCaptions, yearsAndCaptionsFieldsMap);

  return (
    <Accordion
      id="enumeration-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-enumeration
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />}
            value={enumeration || noValueElement}
          />
        </Col>
        <Col
          data-test-chronology
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />}
            value={chronology || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-volume
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.volume`} />}
            value={volume || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-years-and-captions
          id="section-year-caption"
          xs={12}
        >
          <ViewRepeatableField
            repeatableAction={yearsAndCaptionsRepeatableAction}
            fieldData={yearsAndCaptionsData}
            visibleColumns={yearsAndCaptionsVisibleColumns}
            columnMapping={yearsAndCaptionsMapping}
            formatter={yearsAndCaptionsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

EnumerationData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
