import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField, NoValue, KeyValue,
} from '@folio/stripes/components';

import { AcceptedValuesField } from '../../../../../components';

import { getFieldName, getFieldValue } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape, okapiShape } from '../../../../../utils';
import PropTypes from 'prop-types';

export const ItemData = ({ mappingDetails }) => {
  const materialType = getFieldValue(mappingDetails, 'materialType.id', 'value');
  const copyNumber = getFieldValue(mappingDetails, 'copyNumber', 'value');
  const callNumberType = getFieldValue(mappingDetails, 'itemLevelCallNumberTypeId', 'value');
  const callNumberPrefix = getFieldValue(mappingDetails, 'itemLevelCallNumberPrefix', 'value');
  const callNumber = getFieldValue(mappingDetails, 'itemLevelCallNumber', 'value');
  const callNumberSuffix = getFieldValue(mappingDetails, 'itemLevelCallNumberSuffix', 'value');
  const numberOfPieces = getFieldValue(mappingDetails, 'numberOfPieces', 'value');
  const descriptionOfPieces = getFieldValue(mappingDetails, 'descriptionOfPieces', 'value');

  return (
    <Accordion
      id="item-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-material-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.materialType`} />}
            value={materialType || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-copy-number
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.copyNumber`} />}
            value={copyNumber || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-call-number-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            value={callNumberType || <NoValue />}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
            value={callNumberPrefix || <NoValue />}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
            value={callNumber || <NoValue />}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
            value={callNumberSuffix || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-number-of-pieces
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.numberOfPieces`} />}
            value={numberOfPieces || <NoValue />}
          />
        </Col>
        <Col
          data-test-description-of-pieces
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.descriptionOfPieces`} />}
            value={descriptionOfPieces || <NoValue />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
