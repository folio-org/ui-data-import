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
  KeyValue,
  TextField,
  TextArea,
  Checkbox,
  Datepicker,
} from '@folio/stripes/components';

import { AcceptedValuesField } from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  boolAcceptedValuesOptions,
  getAcceptedValuesPath,
  getFieldName,
  getBoolFieldName,
} from '../../utils';
import { BOOLEAN_ACTIONS } from '../../../../../utils';

export const POLineDetails = ({
  automaticExportCheckbox,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const orderFormatOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.electronicResource` }),
      value: 'Electronic Resource',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.pEMix` }),
      value: 'P/E Mix',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.physicalResource` }),
      value: 'Physical Resource',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.other` }),
      value: 'Other',
    },
  ];
  const receiptStatusOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.pending` }),
      value: 'Pending',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receiptNotRequired` }),
      value: 'Receipt not required',
    },
  ];
  const receivingWorkflowOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.synchronized` }),
      value: 'false',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.independent` }),
      value: 'true',
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
            name={getFieldName(31)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.acquisitionMethod`} />}
            optionValue="value"
            optionLabel="value"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/orders/acquisition-methods?limit=2000&query=cql.allRecords=1 sortby value',
              wrapperSourcePath: 'acquisitionMethods',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(31)}
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.automaticExport`} />}
            name={getBoolFieldName(32)}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={automaticExportCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(33)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.orderFormat`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={orderFormatOptions}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.createdOn`} />} />
        </Col>
        <Col xs={3}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receiptDate`} />}
            name={getFieldName(35)}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(36)}
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
            name={getFieldName(37)}
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
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.donor`} />}
            name={getFieldName(39)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.selector`} />}
            name={getFieldName(40)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.requester`} />}
            name={getFieldName(41)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(42)}
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
            name={getFieldName(43)}
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
            name={getFieldName(44)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.receivingWorkflow`} />}
            optionValue="label"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={receivingWorkflowOptions}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={6}>
          <Field
            component={TextArea}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.cancellationDescription`} />}
            name={getFieldName(45)}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextArea}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.lineDescription`} />}
            name={getFieldName(46)}
          />
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
