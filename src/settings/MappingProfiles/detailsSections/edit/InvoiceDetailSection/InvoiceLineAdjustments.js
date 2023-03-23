import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  Card,
  IconButton,
  RepeatableField,
  TextField,
  Checkbox,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import { AcceptedValuesField } from '../../../../../components';
import {
  useFieldMappingFieldValue,
  useFieldMappingRefValues,
} from '../../hooks';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getInnerSubfieldsPath,
  getInnerSubfieldName,
  getInnerRepeatableFieldPath,
  getInnerBooleanFieldPath,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  createOptionsList,
  okapiShape,
  INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS,
  BOOLEAN_ACTIONS,
  validateQuotedString,
  CURRENCY_FIELD,
} from '../../../../../utils';

export const InvoiceLineAdjustments = ({
  invoiceLinesFieldIndex,
  initialFields,
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const INVOICE_LINE_ADJUSTMENTS_INDEX = 15;
  const INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP = {
    SUBFIELDS_PATH: index => getInnerRepeatableFieldPath(index, 0, INVOICE_LINE_ADJUSTMENTS_INDEX),
    DESCRIPTION: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX, 0, index),
    AMOUNT: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX, 1, index),
    TYPE: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX, 2, index),
    RELATION_TO_TOTAL: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX, 3, index),
    EXPORT_TO_ACCOUNTING: index => getInnerBooleanFieldPath(invoiceLinesFieldIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX, 4, index),
  };

  const { formatMessage } = useIntl();

  const [lineAdjustments] = useFieldMappingRefValues([`invoiceLines.[0].fields[${INVOICE_LINE_ADJUSTMENTS_INDEX}].subfields`]);
  const [currency] = useFieldMappingFieldValue([CURRENCY_FIELD]);

  const relationToTotalList = createOptionsList(INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS, formatMessage);

  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, INVOICE_LINE_ADJUSTMENTS_INDEX);
  const getPathToClearRepeatableAction = currentIndex => getSubfieldName(currentIndex, INVOICE_LINE_ADJUSTMENTS_INDEX, 0);

  const onAdjustmentAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.SUBFIELDS_PATH(fieldIndex);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onAdjustmentsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.SUBFIELDS_PATH(fieldIndex);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  const renderLineAdjustment = (field, index) => {
    const trashButton = (
      <IconButton
        data-test-repeatable-field-remove-item-button
        icon="trash"
        onClick={() => onRemove(index, lineAdjustments, invoiceLinesFieldIndex, onAdjustmentsClean, 'order', getPathToAddField, getPathToClearRepeatableAction)}
        size="medium"
        ariaLabel={formatMessage({ id: 'stripes-components.deleteThisItem' })}
      />
    );

    const headerTitle = (
      <FormattedMessage
        id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.sectionTitle`}
        values={{ index: index + 1 }}
      />
    );

    const exportToAccountingCheckboxValue = mappingFields
      ?.[invoiceLinesFieldIndex]
      .subfields[0]
      .fields[INVOICE_LINE_ADJUSTMENTS_INDEX]
      .subfields[index].fields[4]?.booleanFieldAction;

    return (
      <Card
        headerEnd={trashButton}
        headerStart={headerTitle}
      >
        <Row left="xs">
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.description`} />}
              name={INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.DESCRIPTION(index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />}
              name={INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.AMOUNT(index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TypeToggle}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.type`} />}
              name={INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.TYPE(index)}
              currency={currency}
            />
          </Col>
          <Col xs={3}>
            <AcceptedValuesField
              component={TextField}
              name={INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.RELATION_TO_TOTAL(index)}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.relationToTotal`} />}
              optionValue="value"
              optionLabel="label"
              isRemoveValueAllowed
              wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
              acceptedValuesList={relationToTotalList}
              validation={validateQuotedString}
              okapi={okapi}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={Checkbox}
              vertical
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.exportToAccounting`} />}
              name={INVOICE_LINE_ADJUSTMENTS_FIELDS_MAP.EXPORT_TO_ACCOUNTING(index)}
              parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
              checked={exportToAccountingCheckboxValue === BOOLEAN_ACTIONS.ALL_TRUE}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Accordion
      id="invoice-line-adjustments"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineAdjustments.section`} />}
    >
      <Row left="xs">
        <Col
          xs={12}
        >
          <RepeatableField
            fields={lineAdjustments}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.addLabel`} />}
            onAdd={() => onAdd(lineAdjustments, `invoiceLines.fields[${INVOICE_LINE_ADJUSTMENTS_INDEX}].subfields[0]`, invoiceLinesFieldIndex, initialFields, onAdjustmentAdd, 'order', getPathToAddField)}
            onRemove={null}
            renderField={renderLineAdjustment}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineAdjustments.propTypes = {
  invoiceLinesFieldIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
};
