import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getBooleanLabelId,
  getFieldValue,
  getValueById,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const ReceivingHistory = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const receivingHistory = getFieldValue(mappingDetails, 'receivingHistory.entries', 'subfields');
  const receivingHistoryRepeatableAction = getFieldValue(mappingDetails,
    'receivingHistory.entries', 'repeatableFieldAction');

  const receivingHistoryVisibleColumns = ['publicDisplay', 'enumeration', 'chronology'];
  const receivingHistoryMapping = {
    publicDisplay: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.publicDisplay`} />
    ),
    enumeration: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />
    ),
    chronology: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />
    ),
  };
  const receivingHistoryFormatter = {
    publicDisplay: x => {
      const publicDisplayLabelId = getBooleanLabelId(x?.publicDisplay);

      return getValueById(publicDisplayLabelId);
    },
    enumeration: x => x?.enumeration || noValueElement,
    chronology: x => x?.chronology || noValueElement,
  };
  const receivingHistoryFieldsMap = [
    {
      field: 'publicDisplay',
      key: 'booleanFieldAction',
    }, {
      field: 'enumeration',
      key: 'value',
    }, {
      field: 'chronology',
      key: 'value',
    },
  ];
  const receivingHistoryData = transformSubfieldsData(receivingHistory, receivingHistoryFieldsMap);

  return (
    <Accordion
      id="view-holdings-receiving-history"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.receivingHistory.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-receiving-history-note
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="receiving-history"
            repeatableAction={receivingHistoryRepeatableAction}
            fieldData={receivingHistoryData}
            visibleColumns={receivingHistoryVisibleColumns}
            columnMapping={receivingHistoryMapping}
            formatter={receivingHistoryFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.receivingHistory.section`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ReceivingHistory.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
