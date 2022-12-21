import React, {
  useCallback,
  useState,
} from 'react';
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

import {
  TRANSLATION_ID_PREFIX,
  ORDER_FORMATS,
  RECEIPT_STATUS,
  WRAPPER_SOURCE_LINKS,
  RECEIVING_WORKFLOW,
} from '../../constants';
import {
  boolAcceptedValuesOptions,
  getAcceptedValuesPath,
  getFieldName,
  getBoolFieldName,
} from '../../utils';
import {
  BOOLEAN_ACTIONS,
  BOOLEAN_STRING_VALUES,
  validateMARCWithDate,
  validateMARCWithElse,
} from '../../../../../utils';

export const POLineDetails = ({
  automaticExportCheckbox,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const [receivingWorkflow, setReceivingWorkflow] = useState();

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
  const receivingWorkflowOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.synchronized` }),
      value: BOOLEAN_STRING_VALUES.FALSE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.independent` }),
      value: BOOLEAN_STRING_VALUES.TRUE,
    },
  ];

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
            name={getFieldName(29)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.acquisitionMethod`} />}
            optionValue="value"
            optionLabel="value"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ACQUISITION_METHODS,
              wrapperSourcePath: 'acquisitionMethods',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(29)}
            okapi={okapi}
            required
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.automaticExport`} />}
            name={getBoolFieldName(30)}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={automaticExportCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(31)}
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
            name={getFieldName(32)}
            wrappedComponent={TextField}
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            validate={[validateDatepickerFieldValue]}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(33)}
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
            name={getFieldName(34)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.paymentStatus`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={receiptStatusOptions}
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
                name={getFieldName(36)}
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
                name={getFieldName(37)}
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
                name={getFieldName(38)}
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
            name={getFieldName(39)}
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
            name={getFieldName(40)}
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
            name={getFieldName(41)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receivingWorkflow`} />}
            optionValue="label"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={receivingWorkflowOptions}
            parse={value => {
              setReceivingWorkflow(value);
              if (value === `"${RECEIVING_WORKFLOW.INDEPENDENT}"`) return BOOLEAN_STRING_VALUES.TRUE;
              if (value === `"${RECEIVING_WORKFLOW.SYNCHRONIZED}"`) return BOOLEAN_STRING_VALUES.FALSE;

              return value;
            }}
            format={() => receivingWorkflow}
            validation={value => {
              const valueToValidate = (value === BOOLEAN_STRING_VALUES.TRUE || value === BOOLEAN_STRING_VALUES.FALSE)
                ? `"${value}"`
                : value;

              return validateMARCWithElse(valueToValidate);
            }}
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
                name={getFieldName(42)}
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
                name={getFieldName(43)}
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
  automaticExportCheckbox: PropTypes.string,
};

POLineDetails.defaultProps = { automaticExportCheckbox: null };
