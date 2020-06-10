import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import {
  BooleanActionField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
  getBoolSubfieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const ReceivingHistory = ({
  receivingHistory,
  initialFields,
  setReferenceTables,
}) => {
  return (
    <Accordion
      id="holdings-receiving-history"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.receivingHistory.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-receiving-history-note
          id="section-receiving-history"
          xs={12}
        >
          <RepeatableActionsField wrapperFieldName={getFieldName(26)}>
            <RepeatableField
              fields={receivingHistory}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.receivingHistory.addLabel`} />}
              onAdd={() => onAdd(receivingHistory, 'receivingHistory.entries', 26, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, receivingHistory, 26, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-public-display
                    xs={4}
                  >
                    <BooleanActionField
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.publicDisplay`} />}
                      name={getBoolSubfieldName(26, 0, index)}
                    />
                  </Col>
                  <Col xs={4}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />}
                      name={getSubfieldName(26, 1, index)}
                    />
                  </Col>
                  <Col
                    data-test-staff-only
                    xs={4}
                  >
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />}
                      name={getSubfieldName(26, 2, index)}
                    />
                  </Col>
                </Row>
              )}
            />
          </RepeatableActionsField>
        </Col>
      </Row>
    </Accordion>
  );
};

ReceivingHistory.propTypes = {
  receivingHistory: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
