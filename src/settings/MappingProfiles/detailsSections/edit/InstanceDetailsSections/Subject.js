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

import { getSubfieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const Subject = ({ subjects }) => {
  return (
    <Accordion
      id="subjects"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.subject.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-subjects
          xs={12}
        >
          <RepeatableField
            fields={subjects}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.subjects.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={12}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.subjects`} />}
                    name={getSubfieldName(28, 0, index)}
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

Subject.propTypes = { subjects: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired };
