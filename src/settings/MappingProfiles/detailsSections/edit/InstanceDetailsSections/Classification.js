import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { noop } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import { getSubfieldName } from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';

export const Classification = ({ classifications }) => {
  return (
    <Accordion
      id="classification"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.classifications.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-classifications
          xs={12}
        >
          <RepeatableField
            fields={classifications}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.classifications.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={6}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.classificationTypeId`} />}
                    name={getSubfieldName(29, 0, index)}
                    disabled
                  />
                </Col>
                <Col xs={6}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.classificationNumber`} />}
                    name={getSubfieldName(29, 0, index)}
                    disabled
                  />
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
    </Accordion>
  );
};
