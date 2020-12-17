import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';

export const VendorInformation = () => {
  return (
    <Accordion
      id="vendor-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorInvoiceNumber`} />}
            name={getFieldName(16)}
          />
        </Col>
        <Col xs={4}>
          <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorName`} />
        </Col>
        <Col xs={4}>
          <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.accountingCode`} />
        </Col>
      </Row>
    </Accordion>
  );
};
