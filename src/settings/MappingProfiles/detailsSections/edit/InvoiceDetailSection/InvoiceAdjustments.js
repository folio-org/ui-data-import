import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';
import {
  isEmpty,
  noop,
} from 'lodash';

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
  getBoolSubfieldName,
  getInnerSubfieldName,
  getInnerRepeatableAcceptedValuesPath,
  getInnerSubfieldsPath,
  updateInitialFields,
  getRepeatableFieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
  getInnerRepeatableFieldPath,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  createOptionsList,
  okapiShape,
  PRORATE_OPTIONS,
  INOVOICE_ADJUSTMENTS_PRORATE_OPTIONS,
  INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS,
  BOOLEAN_ACTIONS,
  RELATION_TO_TOTAL_OPTIONS,
  validateQuotedString,
  ADJUSTMENTS_FIELD,
  CURRENCY_FIELD,
} from '../../../../../utils';

export const InvoiceAdjustments = ({
  initialFields,
  initialFields: { adjustments: { fields: initialFundDistribution } },
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const INVOICE_ADJUSTMENTS_FIELD_INDEX = 15;
  const PRO_RATE_FIELD_INDEX = 3;
  const RELS_TO_TOTAL_FIELD_INDEX = 4;
  const EXPORT_TO_ACCOUNTING_FIELD_INDEX = 5;
  const FUND_DISTRIBUTIONS_FIELD_INDEX = 6;
  const INVOICE_ADJUSTMENTS_FIELDS_MAP = {
    DESCRIPTION: index => getSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, 0, index),
    AMOUNT: index => getSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, 1, index),
    TYPE: index => getSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, 2, index),
    PRO_RATE: index => getSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, PRO_RATE_FIELD_INDEX, index),
    RELS_TO_TOTAL: index => getSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, RELS_TO_TOTAL_FIELD_INDEX, index),
    EXPORT_TO_ACCOUNTING: index => getBoolSubfieldName(INVOICE_ADJUSTMENTS_FIELD_INDEX, EXPORT_TO_ACCOUNTING_FIELD_INDEX, index),
  };

  const { formatMessage } = useIntl();

  const [adjustments] = useFieldMappingRefValues([ADJUSTMENTS_FIELD]);
  const [currency] = useFieldMappingFieldValue([CURRENCY_FIELD]);

  const onAdjustmentAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onAdjustmentsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  const renderFundDistributionFields = (mappingFieldIndex, mappingSubfieldFieldIndex, mappingSubfieldIndex, isFundDistribution) => {
    const FUND_DISTRIBUTION_FIELDS_MAP = {
      FUND: index => getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 0, index),
      FUND_ACCEPTED_VALUES: index => getInnerRepeatableAcceptedValuesPath(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 0, index),
      EXPENSE_CLASS: index => getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 1, index),
      EXPENSE_CLASS_ACCEPTED_VALUES: index => getInnerRepeatableAcceptedValuesPath(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 1, index),
      VALUE: index => getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 2, index),
      TYPE: index => getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 3, index),
      AMOUNT: index => getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 4, index),
    };

    const currentInitialFundDistribution = initialFundDistribution[mappingSubfieldFieldIndex];

    const fundDistributions = adjustments[mappingSubfieldIndex].fields[mappingSubfieldFieldIndex].subfields;
    const fundDistributionInitialFields = { [currentInitialFundDistribution.name]: currentInitialFundDistribution.subfields[0] };

    const getActualPath = currentIndex => getInnerSubfieldsPath(mappingFieldIndex, mappingSubfieldIndex, currentIndex);
    const onFundDistributionAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
      const repeatableFieldActionPath = getInnerRepeatableFieldPath(mappingFieldIndex, mappingSubfieldIndex, fieldIndex);

      handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
    };
    const onFundDistributionsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
      const repeatableFieldActionPath = getInnerRepeatableFieldPath(mappingFieldIndex, mappingSubfieldIndex, fieldIndex);

      handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
    };

    return (
      <RepeatableField
        fields={fundDistributions}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.addLabel`} />}
        onAdd={() => onAdd(fundDistributions, 'fundDistributions', mappingSubfieldFieldIndex, fundDistributionInitialFields, onFundDistributionAdd, 'order', getActualPath)}
        onRemove={index => onRemove(index, fundDistributions, mappingSubfieldFieldIndex, onFundDistributionsClean, 'order', getActualPath)}
        canAdd={isFundDistribution || !isEmpty(fundDistributions)}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={3}>
              <AcceptedValuesField
                component={TextField}
                name={FUND_DISTRIBUTION_FIELDS_MAP.FUND(index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.fundId`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: WRAPPER_SOURCE_LINKS.FUNDS,
                  wrapperSourcePath: 'funds',
                }]}
                optionTemplate="**name** (**code**)"
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={FUND_DISTRIBUTION_FIELDS_MAP.FUND_ACCEPTED_VALUES(index)}
                validation={noop}
                okapi={okapi}
              />
            </Col>
            <Col xs={3}>
              <AcceptedValuesField
                component={TextField}
                name={FUND_DISTRIBUTION_FIELDS_MAP.EXPENSE_CLASS(index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: WRAPPER_SOURCE_LINKS.EXPENSE_CLASSES,
                  wrapperSourcePath: 'expenseClasses',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={FUND_DISTRIBUTION_FIELDS_MAP.EXPENSE_CLASS_ACCEPTED_VALUES(index)}
                validation={noop}
                okapi={okapi}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />}
                name={FUND_DISTRIBUTION_FIELDS_MAP.VALUE(index)}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TypeToggle}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.type`} />}
                name={FUND_DISTRIBUTION_FIELDS_MAP.TYPE(index)}
                currency={currency}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />}
                name={FUND_DISTRIBUTION_FIELDS_MAP.AMOUNT(index)}
                disabled
              />
            </Col>
          </Row>
        )}
      />
    );
  };

  const renderAdjustment = (field, index) => {
    const prorateField = field.fields[PRO_RATE_FIELD_INDEX];
    const relationToTotalField = field.fields[RELS_TO_TOTAL_FIELD_INDEX];

    const isFundDistribution = prorateField.value === `"${PRORATE_OPTIONS.NOT_PRORATED}"`;

    const prorateList =
      createOptionsList(INOVOICE_ADJUSTMENTS_PRORATE_OPTIONS, formatMessage).filter(({ value }) => (
        value !== PRORATE_OPTIONS.NOT_PRORATED || relationToTotalField.value !== `"${RELATION_TO_TOTAL_OPTIONS.SEPARATE_FROM}"`
      ));

    const relationToTotalList =
      createOptionsList(INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS, formatMessage).filter(({ value }) => (
        value !== RELATION_TO_TOTAL_OPTIONS.SEPARATE_FROM || prorateField.value !== `"${PRORATE_OPTIONS.NOT_PRORATED}"`
      ));

    const handleProRateChange = value => {
      if (value !== `"${PRORATE_OPTIONS.NOT_PRORATED}"`) {
        const fundDistributionFieldPath = getInnerSubfieldsPath(
          INVOICE_ADJUSTMENTS_FIELD_INDEX,
          index,
          FUND_DISTRIBUTIONS_FIELD_INDEX
        );

        setReferenceTables(fundDistributionFieldPath, []);
      }
    };

    const trashButton = (
      <IconButton
        data-test-repeatable-field-remove-item-button
        icon="trash"
        onClick={() => onRemove(index, adjustments, INVOICE_ADJUSTMENTS_FIELD_INDEX, onAdjustmentsClean, 'order')}
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

    const exportToAccountingCheckboxValue = mappingFields?.[INVOICE_ADJUSTMENTS_FIELD_INDEX]
      .subfields[index].fields[EXPORT_TO_ACCOUNTING_FIELD_INDEX]?.booleanFieldAction;

    return (
      <Card
        headerEnd={trashButton}
        headerStart={headerTitle}
      >
        <Row left="xs">
          <Col xs={2}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.description`} />}
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.DESCRIPTION(index)}
            />
          </Col>
          <Col xs={1}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />}
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.AMOUNT(index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TypeToggle}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.type`} />}
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.TYPE(index)}
              currency={currency}
            />
          </Col>
          <Col xs={2}>
            <AcceptedValuesField
              component={TextField}
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.PRO_RATE(index)}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.prorate`} />}
              optionValue="value"
              optionLabel="label"
              isRemoveValueAllowed
              wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
              acceptedValuesList={prorateList}
              onChange={handleProRateChange}
              validation={validateQuotedString}
              okapi={okapi}
            />
          </Col>
          <Col xs={3}>
            <AcceptedValuesField
              component={TextField}
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.RELS_TO_TOTAL(index)}
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
              name={INVOICE_ADJUSTMENTS_FIELDS_MAP.EXPORT_TO_ACCOUNTING(index)}
              parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
              checked={exportToAccountingCheckboxValue === BOOLEAN_ACTIONS.ALL_TRUE}
            />
          </Col>
        </Row>
        <Row left="xs">
          <Col xs={12}>
            <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.fundDistribution.infoText`} />
          </Col>
        </Row>
        <Row left="xs">
          <Col xs={12}>
            {renderFundDistributionFields(INVOICE_ADJUSTMENTS_FIELD_INDEX, FUND_DISTRIBUTIONS_FIELD_INDEX, index, isFundDistribution)}
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Accordion
      id="invoice-adjustments"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <RepeatableField
            fields={adjustments}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.addLabel`} />}
            onAdd={() => {
              const updatedInitialFields = updateInitialFields(initialFields);

              onAdd(adjustments, ADJUSTMENTS_FIELD, INVOICE_ADJUSTMENTS_FIELD_INDEX, updatedInitialFields, onAdjustmentAdd, 'order');
            }}
            onRemove={null}
            renderField={renderAdjustment}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceAdjustments.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
};
