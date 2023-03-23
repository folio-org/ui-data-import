import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { noop } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';
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
  getInnerRepeatableAcceptedValuesPath,
  getInnerRepeatableFieldPath,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES,
  FUND_DISTRIBUTION_SOURCE,
  okapiShape,
  CURRENCY_FIELD,
} from '../../../../../utils';

export const InvoiceLineFundDistribution = ({
  invoiceLinesFieldIndex,
  initialFields,
  getMappingSubfieldsFieldValue,
  setReferenceTables,
  okapi,
}) => {
  const FUND_DISTRIBUTIONS_FIELD_INDEX = 14;
  const INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP = {
    SUBFIELDS_ACTION_PATH: index => getInnerRepeatableFieldPath(index, 0, FUND_DISTRIBUTIONS_FIELD_INDEX),
    SOURCE: getSubfieldName(invoiceLinesFieldIndex, FUND_DISTRIBUTIONS_FIELD_INDEX, 0),
    SOURCE_VALUE: getMappingSubfieldsFieldValue(invoiceLinesFieldIndex, FUND_DISTRIBUTIONS_FIELD_INDEX, 0),
    SOURCE_SUBFIELDS: getInnerSubfieldsPath(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX),
    FUND_ID: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 0, index),
    FUND_ID_ACCEPTED_VALUES: index => getInnerRepeatableAcceptedValuesPath(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 0, index),
    EXPENSE_CLASS: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 1, index),
    EXPENSE_CLASS_ACCEPTED_VALUES: index => getInnerRepeatableAcceptedValuesPath(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 1, index),
    VALUE: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 2, index),
    TYPE: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 3, index),
    AMOUNT: index => getInnerSubfieldName(invoiceLinesFieldIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX, 4, index),
  };

  const [fundDistributions] = useFieldMappingRefValues(['invoiceLines.[0].fields[14].subfields']);
  const [currency] = useFieldMappingFieldValue([CURRENCY_FIELD]);

  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, FUND_DISTRIBUTIONS_FIELD_INDEX);
  const getPathToClearRepeatableAction = currentIndex => getSubfieldName(currentIndex, FUND_DISTRIBUTIONS_FIELD_INDEX, 0);

  const onFundDistributionAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.SUBFIELDS_ACTION_PATH(fieldIndex);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onFundDistributionsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.SUBFIELDS_ACTION_PATH(fieldIndex);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  return (
    <Accordion
      id="invoice-line-fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <RepeatableActionsField
            wrapperFieldName={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.SOURCE}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.field.fundDistributionSource.legend`} />}
            repeatableFieldAction={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.SOURCE_VALUE}
            repeatableFieldIndex={invoiceLinesFieldIndex}
            hasRepeatableFields={!!fundDistributions.length}
            onRepeatableActionChange={setReferenceTables}
            wrapperPlaceholder="ui-data-import.settings.mappingProfiles.map.wrapper.fundDistributionSource"
            actions={MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES}
            actionToClearFields={FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FROM_POL}
            subfieldsToClearPath={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.SOURCE_SUBFIELDS}
            recordType={FOLIO_RECORD_TYPES.INVOICE.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={fundDistributions}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.addLabel`} />}
                onAdd={() => onAdd(fundDistributions, `invoiceLines.fields[${FUND_DISTRIBUTIONS_FIELD_INDEX}].subfields[0]`, invoiceLinesFieldIndex, initialFields, onFundDistributionAdd, 'order', getPathToAddField)}
                onRemove={index => onRemove(index, fundDistributions, invoiceLinesFieldIndex, onFundDistributionsClean, 'order', getPathToAddField, getPathToClearRepeatableAction)}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.FUND_ID(index)}
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
                        acceptedValuesPath={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.FUND_ID_ACCEPTED_VALUES(index)}
                        validation={noop}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.EXPENSE_CLASS(index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.EXPENSE_CLASSES,
                          wrapperSourcePath: 'expenseClasses',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.EXPENSE_CLASS_ACCEPTED_VALUES(index)}
                        validation={noop}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />}
                        name={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.VALUE(index)}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TypeToggle}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.type`} />}
                        name={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.TYPE(index)}
                        currency={currency}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />}
                        name={INVOICE_LINE_FUND_DISTRIBUTION_FIELDS_MAP.AMOUNT(index)}
                        disabled
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineFundDistribution.propTypes = {
  invoiceLinesFieldIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  initialFields: PropTypes.object.isRequired,
  getMappingSubfieldsFieldValue: PropTypes.func.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
