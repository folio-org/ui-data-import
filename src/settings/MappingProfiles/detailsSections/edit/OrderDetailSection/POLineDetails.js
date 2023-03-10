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
  KeyValue,
  TextField,
  TextArea,
  Checkbox,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  WithValidation,
  DatePickerDecorator,
} from '../../../../../components';
import { useFieldMappingBoolFieldValue } from '../../hooks';

import {
  TRANSLATION_ID_PREFIX,
  ORDER_FORMATS,
  RECEIPT_STATUS,
  WRAPPER_SOURCE_LINKS,
  RECEIVING_WORKFLOW,
  PAYMENT_STATUS,
} from '../../constants';
import {
  boolAcceptedValuesOptions,
  getAcceptedValuesPath,
  getFieldName,
  getBoolFieldName,
} from '../../utils';
import {
  AUTOMATIC_EXPORT_FIELD,
  BOOLEAN_ACTIONS,
  BOOLEAN_STRING_VALUES,
  validateMARCWithDate,
} from '../../../../../utils';

export const POLineDetails = ({
  setReferenceTables,
  okapi,
}) => {
  const PO_LINE_DETAILS_FIELDS_MAP = {
    ACQ_METHOD: 29,
    AUTOMATIC_EXPORT: getBoolFieldName(30),
    ORDER_FORMAT: getFieldName(31),
    RECEIPT_DATE: getFieldName(32),
    RECEIPT_STATUS: getFieldName(33),
    PAYMENT_STATUS: getFieldName(34),
    DONOR: getFieldName(36),
    SELECTOR: getFieldName(37),
    REQUESTER: getFieldName(38),
    CANCELLATION_RESTRICTION: getFieldName(39),
    RUSH: getFieldName(40),
    RECEIVING_WORKFLOW: getFieldName(41),
    CANCELLATION_DESCRIPTION: getFieldName(42),
    LINE_DESCRIPTION: getFieldName(43),
  };

  const { formatMessage } = useIntl();

  const [automaticExportCheckbox] = useFieldMappingBoolFieldValue([AUTOMATIC_EXPORT_FIELD]);

  const validateDatepickerFieldValue = useCallback(
    value => validateMARCWithDate(value, false),
    [],
  );

  const orderFormatOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.electronicResource` }),
      value: ORDER_FORMATS.ELECTRONIC_RESOURCE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.pEMix` }),
      value: ORDER_FORMATS.PE_MIX,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.physicalResource` }),
      value: ORDER_FORMATS.PHYSICAL_RESOURCE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.other` }),
      value: ORDER_FORMATS.OTHER,
    },
  ];
  const receiptStatusOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.pending` }),
      value: RECEIPT_STATUS.PENDING,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receiptNotRequired` }),
      value: RECEIPT_STATUS.NOT_REQUIRED,
    },
  ];
  const paymentStatusOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.pending` }),
      value: PAYMENT_STATUS.PENDING,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.paymentNotRequired` }),
      value: PAYMENT_STATUS.NOT_REQUIRED,
    },
  ];
  const receivingWorkflowOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.synchronized` }),
      value: BOOLEAN_STRING_VALUES.FALSE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.independent` }),
      value: BOOLEAN_STRING_VALUES.TRUE,
    },
  ];

  const onReceivingWorkflowParse = useCallback(
    value => {
      if (value === `"${RECEIVING_WORKFLOW.INDEPENDENT}"`) return `"${BOOLEAN_STRING_VALUES.TRUE}"`;
      if (value === `"${RECEIVING_WORKFLOW.SYNCHRONIZED}"`) return `"${BOOLEAN_STRING_VALUES.FALSE}"`;

      return value;
    },
    [],
  );

  const onReceivingWorkflowFormat = useCallback(
    value => {
      if (value === `"${BOOLEAN_STRING_VALUES.TRUE}"`) return `"${RECEIVING_WORKFLOW.INDEPENDENT}"`;
      if (value === `"${BOOLEAN_STRING_VALUES.FALSE}"`) return `"${RECEIVING_WORKFLOW.SYNCHRONIZED}"`;

      return value;
    },
    [],
  );

  return (
    <Accordion
      id="po-line-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.polNumber`} />} />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(PO_LINE_DETAILS_FIELDS_MAP.ACQ_METHOD)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.acquisitionMethod`} />}
            optionValue="value"
            optionLabel="value"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ACQUISITION_METHODS,
              wrapperSourcePath: 'acquisitionMethods',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(PO_LINE_DETAILS_FIELDS_MAP.ACQ_METHOD)}
            okapi={okapi}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.automaticExport`} />}
            name={PO_LINE_DETAILS_FIELDS_MAP.AUTOMATIC_EXPORT}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={automaticExportCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.ORDER_FORMAT}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.orderFormat`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={orderFormatOptions}
            required
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.createdOn`} />} />
        </Col>
        <Col xs={3}>
          <Field
            component={DatePickerDecorator}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receiptDate`} />}
            name={PO_LINE_DETAILS_FIELDS_MAP.RECEIPT_DATE}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.RECEIPT_STATUS}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receiptStatus`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={receiptStatusOptions}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.PAYMENT_STATUS}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.paymentStatus`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={paymentStatusOptions}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.source`} />}>
            <FormattedMessage id="ui-data-import.marc" />
          </KeyValue>
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.donor`} />}
                name={PO_LINE_DETAILS_FIELDS_MAP.DONOR}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.selector`} />}
                name={PO_LINE_DETAILS_FIELDS_MAP.SELECTOR}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.requester`} />}
                name={PO_LINE_DETAILS_FIELDS_MAP.REQUESTER}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.CANCELLATION_RESTRICTION}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.cancellationRestriction`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={boolAcceptedValuesOptions(formatMessage)}
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.RUSH}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.rush`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={boolAcceptedValuesOptions(formatMessage)}
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={PO_LINE_DETAILS_FIELDS_MAP.RECEIVING_WORKFLOW}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receivingWorkflow`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={receivingWorkflowOptions}
            parse={onReceivingWorkflowParse}
            format={onReceivingWorkflowFormat}
            required
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={6}>
          <WithValidation>
            {validation => (
              <Field
                component={TextArea}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.cancellationDescription`} />}
                name={PO_LINE_DETAILS_FIELDS_MAP.CANCELLATION_DESCRIPTION}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={6}>
          <WithValidation>
            {validation => (
              <Field
                component={TextArea}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.lineDescription`} />}
                name={PO_LINE_DETAILS_FIELDS_MAP.LINE_DESCRIPTION}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

POLineDetails.propTypes = {
  setReferenceTables: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
};
