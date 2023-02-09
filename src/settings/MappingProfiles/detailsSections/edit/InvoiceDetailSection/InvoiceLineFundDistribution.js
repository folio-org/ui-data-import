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
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const InvoiceLineFundDistribution = ({
  fundDistributions,
  currency,
  initialFields,
  getMappingSubfieldsFieldValue,
  setReferenceTables,
  okapi,
}) => {
  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, 14);
  const getPathToClearRepeatableAction = currentIndex => getSubfieldName(currentIndex, 14, 0);

  const onFundDistributionAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 14);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onFundDistributionsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 14);

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
            wrapperFieldName={getSubfieldName(26, 14, 0)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.field.fundDistributionSource.legend`} />}
            repeatableFieldAction={getMappingSubfieldsFieldValue(26, 0, 14)}
            repeatableFieldIndex={26}
            hasRepeatableFields={!!fundDistributions.length}
            onRepeatableActionChange={setReferenceTables}
            wrapperPlaceholder="ui-data-import.settings.mappingProfiles.map.wrapper.fundDistributionSource"
            actions={MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES}
            actionToClearFields={FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FROM_POL}
            subfieldsToClearPath={getInnerSubfieldsPath(26, 0, 14)}
            recordType={FOLIO_RECORD_TYPES.INVOICE.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={fundDistributions}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.addLabel`} />}
                onAdd={() => onAdd(fundDistributions, 'invoiceLines.fields[14].subfields[0]', 26, initialFields, onFundDistributionAdd, 'order', getPathToAddField)}
                onRemove={index => onRemove(index, fundDistributions, 26, onFundDistributionsClean, 'order', getPathToAddField, getPathToClearRepeatableAction)}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={getInnerSubfieldName(26, 0, 14, 0, index)}
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
                        acceptedValuesPath={getInnerRepeatableAcceptedValuesPath(26, 0, 14, 0, index)}
                        validation={noop}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={getInnerSubfieldName(26, 0, 14, 1, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: WRAPPER_SOURCE_LINKS.EXPENSE_CLASSES,
                          wrapperSourcePath: 'expenseClasses',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getInnerRepeatableAcceptedValuesPath(26, 0, 14, 1, index)}
                        validation={noop}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />}
                        name={getInnerSubfieldName(26, 0, 14, 2, index)}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TypeToggle}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.type`} />}
                        name={getInnerSubfieldName(26, 0, 14, 3, index)}
                        currency={currency}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />}
                        name={getInnerSubfieldName(26, 0, 14, 4, index)}
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
  fundDistributions: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  getMappingSubfieldsFieldValue: PropTypes.func.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  currency: PropTypes.string,
};

InvoiceLineFundDistribution.defaultProps = { currency: '' };
