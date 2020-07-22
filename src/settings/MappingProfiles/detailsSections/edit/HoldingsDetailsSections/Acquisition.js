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
import { validateTextFieldRemoveValue } from '../../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';

export const Acquisition = () => {
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
          <Field
            component={TextField}
            name={getFieldName(23)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.acquisitionMethod`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-order-format
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(24)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.orderFormat`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-receipt-status
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(25)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.receiptStatus`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};
