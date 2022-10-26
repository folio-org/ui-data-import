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

export const Vendor = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const vendorDetails = getFieldValue(mappingDetails, 'vendorDetail', 'subfields');
  const vendorAccount = getFieldValue(mappingDetails, 'accountNo', 'value');
  const instructions = getFieldValue(mappingDetails, 'instructions', 'value');

  const vendorDetailsVisibleColumns = ['refNumber', 'refNumberType'];

  const vendorDetailsMapping = {
    refNumber: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.vendorDetails.refNumber`} />
    ),
    refNumberType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.vendorDetails.refNumberType`} />
    ),
  };

  const vendorDetailsFormatter = {
    refNumber: x => x?.refNumber || noValueElement,
    refNumberType: x => x?.refNumberType || noValueElement,
  };

  const vendorDetailsFieldsMap = [
    {
      field: 'refNumber',
      key: 'value',
    }, {
      field: 'refNumberType',
      key: 'value',
    },
  ];

  const vendorDetailsData = transformSubfieldsData(vendorDetails, vendorDetailsFieldsMap);

  return (
    <Accordion
      id="view-order-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-vendor-details
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="vendor-details"
            fieldData={vendorDetailsData}
            visibleColumns={vendorDetailsVisibleColumns}
            columnMapping={vendorDetailsMapping}
            formatter={vendorDetailsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.order.vendor.vendorDetails.section`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-vendor-account
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.vendorAccount`} />}
            value={vendorAccount}
          />
        </Col>
        <Col
          data-test-instructions
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.instructions`} />}
            value={instructions}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Vendor.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
