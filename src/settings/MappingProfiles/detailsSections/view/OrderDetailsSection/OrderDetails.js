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

export const OrderDetails = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const title = getFieldValue(mappingDetails, 'title', 'value');
  const receivingNote = getFieldValue(mappingDetails, 'receivingNote', 'value');
  const isAcknowledged = getFieldValue(mappingDetails, 'isAcknowledged', 'value');
  const subscriptionFrom = getFieldValue(mappingDetails, 'subscriptionFrom', 'value');
  const subscriptionTo = getFieldValue(mappingDetails, 'subscriptionTo', 'value');
  const subscriptionInterval = getFieldValue(mappingDetails, 'subscriptionInterval', 'value');
  const publicationDate = getFieldValue(mappingDetails, 'publicationDate', 'value');
  const publisher = getFieldValue(mappingDetails, 'publisher', 'value');
  const edition = getFieldValue(mappingDetails, 'edition', 'value');
  const contributors = getFieldValue(mappingDetails, 'contributors', 'subfields');
  const productIds = getFieldValue(mappingDetails, 'productIds', 'subfields');
  const internalNote = getFieldValue(mappingDetails, 'internalNote', 'value');

  const contributorsVisibleColumns = ['contributor', 'contributorNameTypeId'];
  const productIdsVisibleColumns = ['productId', 'qualifier', 'productIdType'];

  const contributorsMapping = {
    contributor: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.contributors.contributor`} />
    ),
    contributorNameTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.contributors.contributorType`} />
    ),
  };
  const productIdsMapping = {
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
    contributorNameTypeId: x => x?.contributorNameTypeId || noValueElement,
  };
  const productIdsFormatter = {
    productId: x => x?.productId || noValueElement,
    qualifier: x => x?.qualifier || noValueElement,
    productIdType: x => x?.productIdType || noValueElement,
  };

  const contributorsFieldsMap = [
    {
      field: 'contributor',
      key: 'value',
    }, {
      field: 'contributorNameTypeId',
      key: 'value',
    }
  ];
  const productIdsFieldsMap = [
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
  const productIdsData = transformSubfieldsData(productIds, productIdsFieldsMap);

  return (
    <Accordion
      id="view-order-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-title
          xs={12}
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
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.receivingNote`} />}
            value={receivingNote}
          />
        </Col>
        <Col
          data-test-is-acknowledged
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderDetails.isAcknowledged`} />}
            value={isAcknowledged}
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
            fieldData={productIdsData}
            visibleColumns={productIdsVisibleColumns}
            columnMapping={productIdsMapping}
            formatter={productIdsFormatter}
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
