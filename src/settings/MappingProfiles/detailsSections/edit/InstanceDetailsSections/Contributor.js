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

export const Contributor = ({
  contributors,
  setReferenceTables,
}) => {
  return (
    <Accordion
      id="contributors"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-contributors
          xs={12}
        >
          <RepeatableField
            fields={contributors}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.addLabel`} />}
            canAdd={false}
            canRemove={false}
            onAdd={noop}
            renderField={(field, index) => (
              <Row left="xs">
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorName`} />}
                    name={getSubfieldName(17, 0, index)}
                    disabled
                  />
                </Col>
                <Col xs={2}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorNameTypeId`} />}
                    name={getSubfieldName(17, 1, index)}
                    disabled
                  />
                </Col>
                <Col xs={2}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorTypeId`} />}
                    name={getSubfieldName(17, 2, index)}
                    disabled
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorTypeText`} />}
                    name={getSubfieldName(17, 3, index)}
                    disabled
                  />
                </Col>
                <Col
                  data-test-primary
                  xs={2}
                >
                  <BooleanActionField
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.primary`} />}
                    name={getBoolSubfieldName(17, 4, index)}
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

Contributor.propTypes = {
  contributors: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
