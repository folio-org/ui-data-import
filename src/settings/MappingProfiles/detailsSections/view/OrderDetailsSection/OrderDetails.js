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
  renderCheckbox,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const OrderDetails = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const title = getFieldValue(mappingDetails, 'title', 'value');
  const receivingNote = getFieldValue(mappingDetails, 'receivingNote', 'value');
  const mustAcknowledgeReceivingNote = getFieldValue(mappingDetails, 'mustAcknowledgeReceivingNote', 'booleanFieldAction');
  const subscriptionFrom = getFieldValue(mappingDetails, 'subscriptionFrom', 'value');
  const subscriptionTo = getFieldValue(mappingDetails, 'subscriptionTo', 'value');
  const subscriptionInterval = getFieldValue(mappingDetails, 'subscriptionInterval', 'value');
  const publicationDate = getFieldValue(mappingDetails, 'publicationDate', 'value');
  const publisher = getFieldValue(mappingDetails, 'publisher', 'value');
  const edition = getFieldValue(mappingDetails, 'edition', 'value');
  const contributors = getFieldValue(mappingDetails, 'contributors', 'subfields');
  const productIdentifiers = getFieldValue(mappingDetails, 'productIdentifiers', 'subfields');
  const internalNote = getFieldValue(mappingDetails, 'internalNote', 'value');

  const mustAcknowledgeReceivingNoteCheckbox = renderCheckbox('order.orderDetails.mustAcknowledgeReceivingNote', mustAcknowledgeReceivingNote);

  const contributorsVisibleColumns = ['contributor', 'contributorType'];
  const productIdentifiersVisibleColumns = ['productId', 'qualifier', 'productIdType'];

  const contributorsMapping = {
    contributor: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.contributors.contributor`} />
    ),
    contributorType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.contributors.contributorType`} />
    ),
  };
  const productIdentifiersMapping = {
    productId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.productIdentifiers.productId`} />
    ),
    qualifier: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.productIdentifiers.qualifier`} />
    ),
    productIdType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.productIdentifiers.productIdType`} />
    ),
  };

  const contributorsFormatter = {
    contributor: x => x?.contributor || noValueElement,
    contributorType: x => x?.contributorType || noValueElement,
  };
  const productIdentifiersFormatter = {
    productId: x => x?.productId || noValueElement,
    qualifier: x => x?.qualifier || noValueElement,
    productIdType: x => x?.productIdType || noValueElement,
  };

  const contributorsFieldsMap = [
    {
      field: 'contributor',
      key: 'value',
    }, {
      field: 'contributorType',
      key: 'value',
    }
  ];
  const productIdentifiersFieldsMap = [
    {
      field: 'productId',
      key: 'value',
    }, {
      field: 'qualifier',
      key: 'value',
    }, {
      field: 'productIdType',
      key: 'value',
    }
  ];

  const contributorsData = transformSubfieldsData(contributors, contributorsFieldsMap);
  const productIdentifiersData = transformSubfieldsData(productIdentifiers, productIdentifiersFieldsMap);

  return (
    <Accordion
      id="view-order-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-title
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.title`} />}
            value={title}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-receiving-note
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.receivingNote`} />}
            value={receivingNote}
          />
        </Col>
        <Col
          data-test-must-acknowledge-receiving-note
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.mustAcknowledgeReceivingNote`} />}
            value={mustAcknowledgeReceivingNoteCheckbox}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-subscription-from
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.subscriptionFrom`} />}
            value={subscriptionFrom}
          />
        </Col>
        <Col
          data-test-subscription-to
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.subscriptionTo`} />}
            value={subscriptionTo}
          />
        </Col>
        <Col
          data-test-subscription-interval
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.subscriptionInterval`} />}
            value={subscriptionInterval}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-publication-date
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.publicationDate`} />}
            value={publicationDate}
          />
        </Col>
        <Col
          data-test-publisher
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.publisher`} />}
            value={publisher}
          />
        </Col>
        <Col
          data-test-edition
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.edition`} />}
            value={edition}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-contributors
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="contributors"
            fieldData={contributorsData}
            visibleColumns={contributorsVisibleColumns}
            columnMapping={contributorsMapping}
            formatter={contributorsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.order.orderDetails.contributors.section`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-product-identifiers
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="product-identifiers"
            fieldData={productIdentifiersData}
            visibleColumns={productIdentifiersVisibleColumns}
            columnMapping={productIdentifiersMapping}
            formatter={productIdentifiersFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.order.orderDetails.productIdentifiers.section`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-internal-note
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.internalNote`} />}
            value={internalNote}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

OrderDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
