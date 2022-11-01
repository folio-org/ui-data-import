import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  TextArea,
  Datepicker,
  RepeatableField,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';

import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  boolAcceptedValuesOptions,
  getFieldName,
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';

export const ItemDetails = ({
  contributors,
  productIdentifiers,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const contributorsFieldIndex = 27;
  const productIdsFieldIndex = 28;

  return (
    <Accordion
      id="item-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.title`} />}
                name={getFieldName(18)}
                validate={[validation]}
                required
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextArea}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.receivingNote`} />}
                name={getFieldName(19)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(20)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.mustAcknowledgeReceivingNote`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={boolAcceptedValuesOptions(formatMessage)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={Datepicker}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionFrom`} />}
                name={getFieldName(21)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={Datepicker}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionTo`} />}
                name={getFieldName(22)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionInterval`} />}
                name={getFieldName(23)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.publicationDate`} />}
                name={getFieldName(24)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.publisher`} />}
                name={getFieldName(25)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.edition`} />}
                name={getFieldName(26)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <RepeatableField
        fields={contributors}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor.addLabel`} />}
        onAdd={() => onAdd(contributors, 'contributors', contributorsFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, contributors, contributorsFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={6}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor`} />}
                      name={getSubfieldName(contributorsFieldIndex, 0, index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={6}>
                <AcceptedValuesField
                  component={TextField}
                  name={getSubfieldName(contributorsFieldIndex, 1, index)}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributorType`} />}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.CONTRIBUTOR_TYPES,
                    wrapperSourcePath: 'contributorTypes'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(contributorsFieldIndex, 1, index)}
                  okapi={okapi}
                />
              </Col>
            </Row>
          );
        }}
      />
      <RepeatableField
        fields={productIdentifiers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdentifiers.addLabel`} />}
        onAdd={() => onAdd(productIdentifiers, 'productIds', productIdsFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, productIdentifiers, productIdsFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={4}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productId`} />}
                      name={getSubfieldName(productIdsFieldIndex, 0, index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={4}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.qualifier`} />}
                      name={getSubfieldName(productIdsFieldIndex, 1, index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={4}>
                <AcceptedValuesField
                  component={TextField}
                  name={getSubfieldName(productIdsFieldIndex, 2, index)}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdType`} />}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.IDENTIFIER_TYPES,
                    wrapperSourcePath: 'identifierTypes'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(productIdsFieldIndex, 2, index)}
                  okapi={okapi}
                />
              </Col>
            </Row>
          );
        }}
      />
      <Row left="xs">
        <Col xs={12}>
          <WithValidation>
            {validation => (
              <Field
                component={TextArea}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.internalNote`} />}
                name={getFieldName(29)}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

ItemDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object),
  productIdentifiers: PropTypes.arrayOf(PropTypes.object),
};

ItemDetails.defaultProps = {
  contributors: [],
  productIdentifiers: [],
};
