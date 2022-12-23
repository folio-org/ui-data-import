import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  RepeatableField,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';

import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
  getSubfieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';

const FUND_DISTRIBUTION_FIELDS_MAP = {
  FUND_DISTRIBUTION: 56,
  FUND_ID: index => getSubfieldName(this.FUND_DISTRIBUTION, 0, index),
  EXPENSE_CLASS: index => getSubfieldName(this.FUND_DISTRIBUTION, 1, index),
  VALUE: index => getSubfieldName(this.FUND_DISTRIBUTION, 2, index),
  TYPE: index => getSubfieldName(this.FUND_DISTRIBUTION, 3, index),
};

export const FundDistribution = ({
  fundDistributions,
  currency,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const fundIdLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundId`,
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundId.info`,
  );
  const expenseClassLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.expenseClass`,
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.expenseClass.info`,
  );
  const valueLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.value`,
    `${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundId.info`,
  );

  const handleFundAdd = useCallback(
    () => {
      const onFundAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
      };

      return onAdd(fundDistributions, 'fundDistribution', FUND_DISTRIBUTION_FIELDS_MAP.FUND_DISTRIBUTION, initialFields, onFundAdd, 'order');
    },
    [fundDistributions, initialFields, setReferenceTables],
  );

  const handleFundClean = useCallback(
    index => {
      const onFundClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
      };

      return onRemove(index, fundDistributions, FUND_DISTRIBUTION_FIELDS_MAP.FUND_DISTRIBUTION, onFundClean, 'order');
    },
    [fundDistributions, setReferenceTables],
  );

  return (
    <Accordion
      id="fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.section`} />}
    >
      <RepeatableField
        fields={fundDistributions}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundDistribution.addLabel`} />}
        onAdd={handleFundAdd}
        onRemove={handleFundClean}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={3}>
                <AcceptedValuesField
                  component={TextField}
                  label={fundIdLabel}
                  name={FUND_DISTRIBUTION_FIELDS_MAP.FUND_ID(index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.FUNDS,
                    wrapperSourcePath: 'funds'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(FUND_DISTRIBUTION_FIELDS_MAP.FUND_DISTRIBUTION, 0, index)}
                  okapi={okapi}
                />
              </Col>
              <Col xs={3}>
                <AcceptedValuesField
                  component={TextField}
                  label={expenseClassLabel}
                  name={FUND_DISTRIBUTION_FIELDS_MAP.EXPENSE_CLASS(index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.EXPENSE_CLASSES,
                    wrapperSourcePath: 'expenseClasses'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(FUND_DISTRIBUTION_FIELDS_MAP.FUND_DISTRIBUTION, 1, index)}
                  okapi={okapi}
                />
              </Col>
              <Col xs={3}>
                <WithValidation>
                  {validation => (
                    <Field
                      component={TextField}
                      label={valueLabel}
                      name={FUND_DISTRIBUTION_FIELDS_MAP.VALUE(index)}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
              <Col xs={3}>
                <Field
                  component={TypeToggle}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.type`} />}
                  name={FUND_DISTRIBUTION_FIELDS_MAP.TYPE(index)}
                  currency={currency}
                />
              </Col>
            </Row>
          );
        }}
      />
    </Accordion>
  );
};

FundDistribution.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  initialFields: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  fundDistributions: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

FundDistribution.defaultProps = {
  fundDistributions: [],
  currency: null,
};
