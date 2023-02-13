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

import { BooleanActionField } from '../../../../../components';

import {
  getSubfieldName,
  getBoolSubfieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const InstanceNotes = ({
  notes,
  setReferenceTables,
}) => {
  return (
    <Accordion
      id="instance-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.instanceNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          xs={12}
        >
          <RepeatableField
            fields={notes}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.field.notes.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={4}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />}
                    name={getSubfieldName(27, 0, index)}
                    disabled
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />}
                    name={getSubfieldName(27, 1, index)}
                    disabled
                  />
                </Col>
                <Col
                  data-test-staff-only
                  xs={4}
                >
                  <BooleanActionField
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />}
                    name={getBoolSubfieldName(27, 2, index)}
                    onBooleanFieldChange={setReferenceTables}
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

InstanceNotes.propTypes = {
  notes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
