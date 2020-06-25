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

import { AcceptedValuesField } from '../../../../../components';

import { getSubfieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const ElectronicAccess = ({
  electronicAccess,
  okapi,
}) => {
  return (
    <Accordion
      id="instance-electronic-access"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-electronic-access
          xs={12}
        >
          <RepeatableField
            fields={electronicAccess}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.EAccess.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col
                  data-test-relationship
                  xs={4}
                >
                  <AcceptedValuesField
                    okapi={okapi}
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.relationship`} />}
                    name={getSubfieldName(27, 0, index)}
                    optionValue="name"
                    optionLabel="name"
                    wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                    wrapperSourceLink="/electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name"
                    wrapperSourcePath="electronicAccessRelationships"
                    disabled
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />}
                    name={getSubfieldName(27, 1, index)}
                    disabled
                  />
                </Col>
                <Col xs={2}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />}
                    name={getSubfieldName(27, 2, index)}
                    disabled
                  />
                </Col>
                <Col xs={2}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />}
                    name={getSubfieldName(27, 3, index)}
                    disabled
                  />
                </Col>
                <Col xs={2}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />}
                    name={getSubfieldName(27, 4, index)}
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

ElectronicAccess.propTypes = {
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  okapi: okapiShape.isRequired,
};
