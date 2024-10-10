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
  WithValidation,
} from '../../../../../components';

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  validateMARCWithDate,
  okapiShape,
} from '../../../../../utils';

export const Condition = ({
  okapi,
  requestLimit,
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
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(20)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.numberOfMissingPieces`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col
          data-test-missing-pieces
          xs={4}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(21)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.missingPieces`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col
          data-test-date
          xs={4}
        >
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.missingPiecesDate`} />}
            name={getFieldName(22)}
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
            name={getFieldName(23)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemCondition.field.itemDamagedStatus`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('ITEM_DAMAGE_STATUS', requestLimit),
              wrapperSourcePath: 'itemDamageStatuses',
            }]}
            isRemoveValueAllowed
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
            name={getFieldName(24)}
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
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
