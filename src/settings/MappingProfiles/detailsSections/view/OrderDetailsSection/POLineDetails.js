import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import {
  getFieldValue,
  renderCheckbox,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const POLineDetails = ({ mappingDetails }) => {
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const poLineNumber = getFieldValue(mappingDetails, 'poLineNumber', 'value');
  const acquisitionMethod = getFieldValue(mappingDetails, 'acquisitionMethod', 'value');
  const automaticExport = getFieldValue(mappingDetails, 'automaticExport', 'booleanFieldAction');
  const orderFormat = getFieldValue(mappingDetails, 'orderFormat', 'value');
  const createdOn = getFieldValue(mappingDetails, 'createdOn', 'value');
  const receiptDate = getFieldValue(mappingDetails, 'receiptDate', 'value');
  const receiptStatus = getFieldValue(mappingDetails, 'receiptStatus', 'value');
  const paymentStatus = getFieldValue(mappingDetails, 'paymentStatus', 'value');
  const source = getFieldValue(mappingDetails, 'source', 'value');
  const donor = getFieldValue(mappingDetails, 'donor', 'value');
  const selector = getFieldValue(mappingDetails, 'selector', 'value');
  const requester = getFieldValue(mappingDetails, 'requester', 'value');
  const cancellationRestriction = getFieldValue(mappingDetails, 'cancellationRestriction', 'value');
  const rush = getFieldValue(mappingDetails, 'rush', 'value');
  const receivingWorkflow = getFieldValue(mappingDetails, 'checkinItems', 'value');
  const cancellationDescription = getFieldValue(mappingDetails, 'cancellationDescription', 'value');
  const poLineDescription = getFieldValue(mappingDetails, 'poLineDescription', 'value');

  const automaticExportCheckbox = renderCheckbox('order.poLineDetails.automaticExport', automaticExport);

  return (
    <Accordion
      id="view-po-line-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-po-line-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.poLineNumber`} />}
            value={poLineNumber || prohibitionIconElement('po-line-number')}
          />
        </Col>
        <Col
          data-test-acquisition-method
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.acquisitionMethod`} />}
            value={acquisitionMethod}
          />
        </Col>
        <Col
          data-test-automatic-export
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.automaticExport`} />}
            value={automaticExportCheckbox}
          />
        </Col>
        <Col
          data-test-order-format
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.orderFormat`} />}
            value={orderFormat}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-created-on
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.createdOn`} />}
            value={createdOn || prohibitionIconElement('created-on')}
          />
        </Col>
        <Col
          data-test-receipt-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.receiptDate`} />}
            value={receiptDate}
          />
        </Col>
        <Col
          data-test-receipt-status
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.receiptStatus`} />}
            value={receiptStatus}
          />
        </Col>
        <Col
          data-test-payment-status
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.paymentStatus`} />}
            value={paymentStatus}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-source
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.source`} />}
            value={source || prohibitionIconElement('source')}
          />
        </Col>
        <Col
          data-test-donor
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.donor`} />}
            value={donor}
          />
        </Col>
        <Col
          data-test-selector
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.selector`} />}
            value={selector}
          />
        </Col>
        <Col
          data-test-requester
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.requester`} />}
            value={requester}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-cancellation-restriction
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.cancellationRestriction`} />}
            value={cancellationRestriction}
          />
        </Col>
        <Col
          data-test-rush
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.rush`} />}
            value={rush}
          />
        </Col>
        <Col
          data-test-receiving-workflow
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.receivingWorkflow`} />}
            value={receivingWorkflow}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-cancellation-description
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.cancellationDescription`} />}
            value={cancellationDescription}
          />
        </Col>
        <Col
          data-test-po-line-description
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.poLineDescription`} />}
            value={poLineDescription}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

POLineDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
