import React, { useCallback } from 'react';
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
  RepeatableField,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  WithValidation,
  DatePickerDecorator,
} from '../../../../../components';

import {
  CONTRIBUTOR_TYPES,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  boolAcceptedValuesOptions,
  getFieldName,
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
  getSubfieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
  onAdd,
  onRemove,
} from '../../utils';
import {
  validateMARCWithDate,
  validateRequiredField,
} from '../../../../../utils';

export const ItemDetails = ({
  contributors,
  productIdentifiers,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const ITEM_DETAILS_FIELDS_MAP = {
    TITLE: getFieldName(16),
    RECEIVING_NOTE: getFieldName(17),
    MUST_ACKNOWLEDGE_RECEIVING_NOTE: getFieldName(18),
    SUBSCRIPTION_FROM: getFieldName(19),
    SUBSCRIPTION_TO: getFieldName(20),
    SUBSCRIPTION_INTERVAL: getFieldName(21),
    PUBLICATION_DATE: getFieldName(22),
    PUBLISHER: getFieldName(23),
    EDITION: getFieldName(24),
    CONTRIBUTORS: 25,
    CONTRIBUTOR: index => getSubfieldName(ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, 0, index),
    CONTRIBUTOR_TYPE: index => getSubfieldName(ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, 1, index),
    PRODUCT_IDS: 26,
    PRODUCT_ID: index => getSubfieldName(ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, 0, index),
    QUALIFIER: index => getSubfieldName(ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, 1, index),
    PRODUCT_ID_TYPE: index => getSubfieldName(ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, 2, index),
    INTERNAL_NOTE: getFieldName(27),
  };

  const validateDatepickerFieldValue = useCallback(
    value => validateMARCWithDate(value, false),
    [],
  );

  const contributorTypeOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.itemDetails.field.personalName` }),
      value: CONTRIBUTOR_TYPES.PERSONAL_NAME,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.itemDetails.field.corporateName` }),
      value: CONTRIBUTOR_TYPES.CORPORATE_NAME,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.itemDetails.field.meetingName` }),
      value: CONTRIBUTOR_TYPES.MEETING_NAME,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.itemDetails.field.innReachAuthor` }),
      value: CONTRIBUTOR_TYPES.INN_REACH_AUTHOR,
    },
  ];

  const handleProductIdAdd = useCallback(
    () => {
      const onProductIdAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
      };

      return onAdd(productIdentifiers, 'productIds', ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, initialFields, onProductIdAdd, 'order');
    },
    [ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, initialFields, productIdentifiers, setReferenceTables],
  );

  const handleProductIdClean = useCallback(
    index => {
      const onProductIdClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
      };

      return onRemove(index, productIdentifiers, ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, onProductIdClean, 'order');
    },
    [ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, productIdentifiers, setReferenceTables],
  );

  const handleContributorsAdd = useCallback(
    () => onAdd(contributors, 'contributors', ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, initialFields, setReferenceTables, 'order'),
    [ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, contributors, initialFields, setReferenceTables],
  );

  const handleContributorsClean = useCallback(
    index => onRemove(index, contributors, ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, setReferenceTables, 'order'),
    [ITEM_DETAILS_FIELDS_MAP.CONTRIBUTORS, contributors, setReferenceTables],
  );

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
                name={ITEM_DETAILS_FIELDS_MAP.TITLE}
                validate={[validateRequiredField, validation]}
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
                name={ITEM_DETAILS_FIELDS_MAP.RECEIVING_NOTE}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={ITEM_DETAILS_FIELDS_MAP.MUST_ACKNOWLEDGE_RECEIVING_NOTE}
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
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionFrom`} />}
            name={ITEM_DETAILS_FIELDS_MAP.SUBSCRIPTION_FROM}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionTo`} />}
            name={ITEM_DETAILS_FIELDS_MAP.SUBSCRIPTION_TO}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
          />
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionInterval`} />}
                name={ITEM_DETAILS_FIELDS_MAP.SUBSCRIPTION_INTERVAL}
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
                name={ITEM_DETAILS_FIELDS_MAP.PUBLICATION_DATE}
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
                name={ITEM_DETAILS_FIELDS_MAP.PUBLISHER}
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
                name={ITEM_DETAILS_FIELDS_MAP.EDITION}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <RepeatableField
        fields={contributors}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor.addLabel`} />}
        onAdd={handleContributorsAdd}
        onRemove={handleContributorsClean}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={6}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor`} />}
                      name={ITEM_DETAILS_FIELDS_MAP.CONTRIBUTOR(index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={6}>
                <AcceptedValuesField
                  component={TextField}
                  name={ITEM_DETAILS_FIELDS_MAP.CONTRIBUTOR_TYPE(index)}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributorType`} />}
                  optionValue="value"
                  optionLabel="label"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  acceptedValuesList={contributorTypeOptions}
                />
              </Col>
            </Row>
          );
        }}
      />
      <RepeatableField
        fields={productIdentifiers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdentifiers.addLabel`} />}
        onAdd={handleProductIdAdd}
        onRemove={handleProductIdClean}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={4}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productId`} />}
                      name={ITEM_DETAILS_FIELDS_MAP.PRODUCT_ID(index)}
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
                      name={ITEM_DETAILS_FIELDS_MAP.QUALIFIER(index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={4}>
                <AcceptedValuesField
                  component={TextField}
                  name={ITEM_DETAILS_FIELDS_MAP.PRODUCT_ID_TYPE(index)}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdType`} />}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.IDENTIFIER_TYPES,
                    wrapperSourcePath: 'identifierTypes'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(ITEM_DETAILS_FIELDS_MAP.PRODUCT_IDS, 2, index)}
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
                name={ITEM_DETAILS_FIELDS_MAP.INTERNAL_NOTE}
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
