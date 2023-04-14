import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';
import { okapiShape } from '../../../../../utils';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';

import {
  getAcceptedValuesPath,
  getFieldName,
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';

export const Location = ({
  setReferenceTables,
  okapi,
}) => {
  const LOCATION_FIELDS_MAP = {
    PERMANENT: getSubfieldName(6, 0, 0),
    PERMANENT_ACCEPTED_VALUES: getRepeatableAcceptedValuesPath(6, 0, 0),
    TEMPORARY: getFieldName(7),
    TEMPORARY_ACCEPTED_VALUES: getAcceptedValuesPath(7),
    SHELVING_ORDER: getFieldName(8),
    SHELVING_TITLE: getFieldName(9),
    COPY_NUMBER: getFieldName(10),
    CALL_NUMBER_TYPE: getFieldName(11),
    CALL_NUMBER_TYPE_ACCEPTED_VALUES: getAcceptedValuesPath(11),
    CALL_NUMBER_PREFIX: getFieldName(12),
    CALL_NUMBER: getFieldName(13),
    CALL_NUMBER_SUFFIX: getFieldName(14),
  };

  const permanentLocationLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.location.field.permanent`,
    `${TRANSLATION_ID_PREFIX}.item.requiredWhenCreatingHoldings.info`,
  );

  return (
    <Accordion
      id="holdings-location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-permanent
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={LOCATION_FIELDS_MAP.PERMANENT}
            label={permanentLocationLabel}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
              wrapperSourcePath: 'locations',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={LOCATION_FIELDS_MAP.PERMANENT_ACCEPTED_VALUES}
            optionTemplate="**name** (**code**)"
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-temporary
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={LOCATION_FIELDS_MAP.TEMPORARY}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.temporary`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={LOCATION_FIELDS_MAP.TEMPORARY_ACCEPTED_VALUES}
            optionTemplate="**name** (**code**)"
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-shelving-order
          xs={6}
        >
          <Field
            component={TextField}
            name={LOCATION_FIELDS_MAP.SHELVING_ORDER}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingOrder`} />}
            disabled
          />
        </Col>
        <Col
          data-test-shelving-title
          xs={6}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={LOCATION_FIELDS_MAP.SHELVING_TITLE}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingTitle`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-copy-number
          xs={6}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={LOCATION_FIELDS_MAP.COPY_NUMBER}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.copyNumber`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-call-number-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={LOCATION_FIELDS_MAP.CALL_NUMBER_TYPE}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.CALL_NUMBER_TYPES,
              wrapperSourcePath: 'callNumberTypes',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={LOCATION_FIELDS_MAP.CALL_NUMBER_TYPE_ACCEPTED_VALUES}
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={LOCATION_FIELDS_MAP.CALL_NUMBER_PREFIX}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={LOCATION_FIELDS_MAP.CALL_NUMBER}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>

        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={LOCATION_FIELDS_MAP.CALL_NUMBER_SUFFIX}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
