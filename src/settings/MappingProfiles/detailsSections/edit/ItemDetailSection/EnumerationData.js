import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';

import { RepeatableActionsField } from '../../../../../components';

import {
  getFieldName,
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import { mappingProfileSubfieldShape } from '../../../../../utils';

export const EnumerationData = ({
  yearCaption,
  initialFields,
  setReferenceTables,
}) => {
  return (
    <Accordion
      id="enumeration-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-enumeration
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(15)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.enumeration`} />}
          />
        </Col>
        <Col
          data-test-chronology
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(16)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.chronology`} />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-volume
          xs={6}
        >
          <Field
            component={TextField}
            name={getFieldName(17)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.volume`} />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-years-and-captions
          id="section-year-caption"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(18)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`} />}
          >
            <RepeatableField
              fields={yearCaption}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption.addLabel`} />}
              onAdd={() => onAdd(yearCaption, 'yearCaption', 18, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, yearCaption, 18, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.enumerationData.field.yearCaption`} />}
                      name={getSubfieldName(18, 0, index)}
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

EnumerationData.propTypes = {
  yearCaption: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
