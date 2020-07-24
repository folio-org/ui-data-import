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
  AcceptedValuesField,
  DatePickerDecorator,
} from '../../../../../components';

import {
  getAcceptedValuesPath,
  getFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  validateTextFieldRemoveValue,
  validateMARCWithDate,
  okapiShape,
} from '../../../../../utils';

export const Condition = ({
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="item-condition"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-missing-pieces-number
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(19)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.numberOfMissingPieces`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-missing-pieces
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(20)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.missingPieces`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-date
          xs={4}
        >
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.missingPiecesDate`} />}
            name={getFieldName(21)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateMARCWithDate]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-item-damaged-status
          xs={4}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(22)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.itemDamagedStatus`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/item-damaged-statuses?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'itemDamageStatuses',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(22)}
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-date2
          xs={4}
        >
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.itemDamagedStatusDate`} />}
            name={getFieldName(23)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateMARCWithDate]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Condition.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
