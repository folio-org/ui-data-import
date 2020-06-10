import React from 'react';
import PropTypes from 'prop-types';
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
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const Identifier = ({ identifiers }) => {
  return (
    <Accordion
      id="identifiers"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.identifiers.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-identifiers
          xs={12}
        >
          <RepeatableField
            fields={identifiers}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.identifiers.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={6}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.identifiers.field.identifierTypeId`} />}
                    name={getSubfieldName(15, 0, index)}
                    disabled
                  />
                </Col>
                <Col xs={6}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.identifiers.field.value`} />}
                    name={getSubfieldName(15, 1, index)}
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

Identifier.propTypes = { identifiers: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired };
