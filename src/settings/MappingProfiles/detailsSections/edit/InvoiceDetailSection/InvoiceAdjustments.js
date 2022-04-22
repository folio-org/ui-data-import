import React, { useState } from 'react';
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
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  createOptionsList,
  mappingProfileSubfieldShape,
  okapiShape,
  PRORATE_OPTIONS,
  INOVOICE_ADJUSTMENTS_PRORATE_OPTIONS,
  INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS,
  BOOLEAN_ACTIONS,
  validateQuotedString,
} from '../../../../../utils';

export const InvoiceAdjustments = ({
  adjustments,
  currency,
  initialFields,
  initialFields: { adjustments: { fields: initialFundDistribution } },
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const [isFundDistribution, setIsFundDistribution] = useState(false);

  const prorateList = createOptionsList(INOVOICE_ADJUSTMENTS_PRORATE_OPTIONS, formatMessage);
  const relationToTotalList = createOptionsList(INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS, formatMessage);

  const handleProRateChange = index => value => {
    if (value === `"${PRORATE_OPTIONS.NOT_PRORATED}"`) {
      setIsFundDistribution(true);
    } else {
      setIsFundDistribution(false);
      setReferenceTables(getInnerSubfieldsPath(15, index, 6), []);
    }
  };

  const onAdjustmentAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onAdjustmentsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  const renderFundDistributionFields = (mappingFieldIndex, mappingSubfieldFieldIndex, mappingSubfieldIndex) => {
    const currentInitialFundDistribution = initialFundDistribution[mappingSubfieldFieldIndex];

    const fundDistributions = adjustments[mappingSubfieldIndex].fields[mappingSubfieldFieldIndex].subfields;
    const fundDistributionInitialFields = { [currentInitialFundDistribution.name]: currentInitialFundDistribution.subfields[0] };

    const getActualPath = currentIndex => getInnerSubfieldsPath(mappingFieldIndex, mappingSubfieldIndex, currentIndex);
    const onFundDistributionAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
      const repeatableFieldActionPath = `profile.mappingDetails.mappingFields[${mappingFieldIndex}].subfields[${mappingSubfieldIndex}].fields[${fieldIndex}].repeatableFieldAction`;

      handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
    };
    const onFundDistributionsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
      const repeatableFieldActionPath = `profile.mappingDetails.mappingFields[${mappingFieldIndex}].subfields[${mappingSubfieldIndex}].fields[${fieldIndex}].repeatableFieldAction`;

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
                name={getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 0, index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.fundId`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/finance/funds?limit=1000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'funds',
                }]}
                optionTemplate="**name** (**code**)"
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getInnerRepeatableAcceptedValuesPath(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 0, index)}
                validation={noop}
                okapi={okapi}
              />
            </Col>
            <Col xs={3}>
              <AcceptedValuesField
                component={TextField}
                name={getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 1, index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/finance/expense-classes',
                  wrapperSourcePath: 'expenseClasses',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getInnerRepeatableAcceptedValuesPath(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 1, index)}
                validation={noop}
                okapi={okapi}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />}
                name={getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 2, index)}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TypeToggle}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.type`} />}
                name={getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 3, index)}
                currency={currency}
              />
            </Col>
            <Col xs={2}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />}
                name={getInnerSubfieldName(mappingFieldIndex, mappingSubfieldIndex, mappingSubfieldFieldIndex, 4, index)}
                disabled
              />
            </Col>
          </Row>
        )}
      />
    );
  };

  const renderAdjustment = (field, index) => {
    const trashButton = (
      <IconButton
        data-test-repeatable-field-remove-item-button
        icon="trash"
        onClick={() => onRemove(index, adjustments, 15, onAdjustmentsClean, 'order')}
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

    const exportToAccountingCheckbox = mappingFields?.[15].subfields[index].fields[5].booleanFieldAction;

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
              name={getSubfieldName(15, 0, index)}
            />
          </Col>
          <Col xs={1}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />}
              name={getSubfieldName(15, 1, index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TypeToggle}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.type`} />}
              name={getSubfieldName(15, 2, index)}
              currency={currency}
            />
          </Col>
          <Col xs={2}>
            <AcceptedValuesField
              component={TextField}
              name={getSubfieldName(15, 3, index)}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.prorate`} />}
              optionValue="value"
              optionLabel="label"
              isRemoveValueAllowed
              wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
              acceptedValuesList={prorateList}
              onChange={handleProRateChange(index)}
              validation={validateQuotedString}
              okapi={okapi}
            />
          </Col>
          <Col xs={3}>
            <AcceptedValuesField
              component={TextField}
              name={getSubfieldName(15, 4, index)}
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
              name={getBoolSubfieldName(15, 5, index)}
              parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
              checked={exportToAccountingCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
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
            {renderFundDistributionFields(15, 6, index)}
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
        <Col
          xs={12}
        >
          <RepeatableField
            fields={adjustments}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.addLabel`} />}
            onAdd={() => {
              const updatedInitialFields = updateInitialFields(initialFields);

              onAdd(adjustments, 'adjustments', 15, updatedInitialFields, onAdjustmentAdd, 'order');
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
  adjustments: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

InvoiceAdjustments.defaultProps = { currency: '' };
