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

  const refNumbers = getFieldValue(mappingDetails, 'refNumbers', 'subfields');
  const vendorAccount = getFieldValue(mappingDetails, 'vendorAccount', 'value');
  const instructions = getFieldValue(mappingDetails, 'instructions', 'value');

  const refNumbersVisibleColumns = ['refNumber', 'refNumberType'];

  const refNumbersMapping = {
    refNumber: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.refNumbers.refNumber`} />
    ),
    refNumberType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.refNumbers.refNumberType`} />
    ),
  };

  const contributorsFormatter = {
    refNumber: x => x?.refNumber || noValueElement,
    refNumberType: x => x?.refNumberType || noValueElement,
  };

  const refNumberFieldsMap = [
    {
      field: 'refNumber',
      key: 'value',
    }, {
      field: 'refNumberType',
      key: 'value',
    },
  ];

  const refNumbersData = transformSubfieldsData(refNumbers, refNumberFieldsMap);

  return (
    <Accordion
      id="view-order-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-ref-numbers
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="ref-number"
            fieldData={refNumbersData}
            visibleColumns={refNumbersVisibleColumns}
            columnMapping={refNumbersMapping}
            formatter={contributorsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.order.vendor.refNumbers.section`}
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
