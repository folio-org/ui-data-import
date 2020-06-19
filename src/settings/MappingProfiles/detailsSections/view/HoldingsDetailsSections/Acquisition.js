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

export const Acquisition = ({ mappingDetails }) => {
  const acquisitionMethod = getFieldValue(mappingDetails, 'acquisitionMethod', 'value');
  const orderFormat = getFieldValue(mappingDetails, 'acquisitionFormat', 'value');
  const receiptStatus = getFieldValue(mappingDetails, 'receiptStatus', 'value');

  return (
    <Accordion
      id="holdings-acquisition"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.acquisition.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-acquisition-method
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.acquisitionMethod`} />}
            value={acquisitionMethod || <NoValue />}
          />
        </Col>
        <Col
          data-test-order-format
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.orderFormat`} />}
            value={orderFormat || <NoValue />}
          />
        </Col>
        <Col
          data-test-receipt-status
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.receiptStatus`} />}
            value={receiptStatus || <NoValue />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Acquisition.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
