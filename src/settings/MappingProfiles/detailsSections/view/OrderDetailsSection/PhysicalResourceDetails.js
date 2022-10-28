import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  TRANSLATION_ID_PREFIX,
  PHYSICAL_RESOURCE_VISIBLE_COLUMNS,
} from '../../constants';
import {
  getFieldValue,
  getFieldValueByPath,
  transformSubfieldsData,
} from '../../utils';
import {
  DATE_TYPES,
  mappingProfileFieldShape,
} from '../../../../../utils';

export const PhysicalResourceDetails = ({ mappingDetails }) => {
  const { VOLUMES } = PHYSICAL_RESOURCE_VISIBLE_COLUMNS;
  const {
    TWO_DIGIT,
    NUMERIC,
  } = DATE_TYPES;

  const noValueElement = <NoValue />;

  const materialSupplier = getFieldValue(mappingDetails, 'materialSupplier', 'value');
  const receiptDue = getFieldValue(mappingDetails, 'receiptDue', 'value');
  const expectedReceiptDate = getFieldValue(mappingDetails, 'expectedReceiptDate', 'value');
  const createInventory = getFieldValueByPath(mappingDetails, 'order.poLine.physical.createInventory', 'value');
  const materialType = getFieldValueByPath(mappingDetails, 'order.poLine.physical.materialType', 'value');
  const volumes = getFieldValue(mappingDetails, 'volumes', 'subfields');

  const volumesVisibleColumns = [VOLUMES];

  const volumesMapping = {
    volumes: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.volume`} />
    ),
  };

  const volumesFieldsMap = [
    {
      field: 'volumes',
      key: 'value',
    }
  ];

  const volumesFormatter = { volumes: volume => volume?.volumes || noValueElement };

  const volumesData = transformSubfieldsData(volumes, volumesFieldsMap);

  const formattedReceiptDue = (
    <FormattedDate
      value={receiptDue}
      day={TWO_DIGIT}
      month={TWO_DIGIT}
      year={NUMERIC}
    />
  );
  const formattedExpectedReceiptDate = (
    <FormattedDate
      value={expectedReceiptDate}
      day={TWO_DIGIT}
      month={TWO_DIGIT}
      year={NUMERIC}
    />
  );

  return (
    <Accordion
      id="view-physical-order-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-material-supplier
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.materialSupplier`} />}
            value={materialSupplier}
          />
        </Col>
        <Col
          data-test-receipt-due
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.receiptDue`} />}
            value={formattedReceiptDue}
          />
        </Col>
        <Col
          data-test-expected-receipt-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.expectedReceiptDate`} />}
            value={formattedExpectedReceiptDate}
          />
        </Col>
        <Col
          data-test-create-inventory
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.createInventory`} />}
            value={createInventory}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-material-type
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalOrderDetails.materialType`} />}
            value={materialType}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-volumes
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="volumes"
            fieldData={volumesData}
            visibleColumns={volumesVisibleColumns}
            columnMapping={volumesMapping}
            formatter={volumesFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

PhysicalResourceDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
