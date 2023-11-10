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
  WithValidation,
} from '../../../../../components';

import {
  getAcceptedValuesPath,
  getFieldName,
  renderFieldLabelWithInfo,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  okapiShape,
} from '../../../../../utils';

export const ItemData = ({
  setReferenceTables,
  okapi,
  requestLimit,
}) => {
  const materialTypeLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.item.itemData.field.materialType`,
    `${TRANSLATION_ID_PREFIX}.item.requiredWhenCreatingItem.info`,
  );

  return (
    <Accordion
      id="item-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-material-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(8)}
            label={materialTypeLabel}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('MATERIAL_TYPES', requestLimit),
              wrapperSourcePath: 'mtypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(8)}
            okapi={okapi}
          />
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
                name={getFieldName(9)}
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
            name={getFieldName(10)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('CALL_NUMBER_TYPES', requestLimit),
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
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(11)}
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
                name={getFieldName(12)}
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
                name={getFieldName(13)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-number-of-pieces
          xs={4}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(14)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.numberOfPieces`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col
          data-test-description-of-pieces
          xs={4}
        >
          <WithValidation isRemoveValueAllowed>
            {validation => (
              <Field
                component={TextField}
                name={getFieldName(15)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.descriptionOfPieces`} />}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

ItemData.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
