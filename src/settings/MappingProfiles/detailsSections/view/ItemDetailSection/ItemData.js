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

import { getFieldValue } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const ItemData = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

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
            value={materialType || noValueElement}
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
            value={copyNumber || noValueElement}
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
            value={callNumberType || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
            value={callNumberPrefix || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
            value={callNumber || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
            value={callNumberSuffix || noValueElement}
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
            value={numberOfPieces || noValueElement}
          />
        </Col>
        <Col
          data-test-description-of-pieces
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.descriptionOfPieces`} />}
            value={descriptionOfPieces || noValueElement}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
