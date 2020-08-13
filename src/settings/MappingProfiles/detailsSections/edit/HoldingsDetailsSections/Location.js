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
import {
  validateTextFieldRemoveValue,
  okapiShape,
} from '../../../../../utils';

import { AcceptedValuesField } from '../../../../../components';

import {
  getAcceptedValuesPath,
  getFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';

export const Location = ({
  setReferenceTables,
  okapi,
}) => {
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
            name={getFieldName(5)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.permanent`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/locations?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'locations',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(5)}
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
            name={getFieldName(6)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.temporary`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/locations?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(6)}
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
            name={getFieldName(7)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingOrder`} />}
            validate={[validateTextFieldRemoveValue]}
            disabled
          />
        </Col>
        <Col
          data-test-shelving-title
          xs={6}
        >
          <Field
            component={TextField}
            name={getFieldName(8)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingTitle`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-copy-number
          xs={6}
        >
          <Field
            component={TextField}
            name={getFieldName(9)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.copyNumber`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-call-number-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(10)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/call-number-types?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'callNumberTypes',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(10)}
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(11)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(12)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(13)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
