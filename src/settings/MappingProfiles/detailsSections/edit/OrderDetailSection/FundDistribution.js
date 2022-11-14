import React from 'react';
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

import { AcceptedValuesField } from '../../../../../components';

import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';

export const FundDistribution = ({
  fundDistributions,
  currency,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const fundDistributionsFieldIndex = 60;
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

  return (
    <Accordion
      id="fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.section`} />}
    >
      <RepeatableField
        fields={fundDistributions}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundDistribution.addLabel`} />}
        onAdd={() => onAdd(fundDistributions, 'fundDistribution', fundDistributionsFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, fundDistributions, fundDistributionsFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={3}>
                <AcceptedValuesField
                  component={TextField}
                  label={fundIdLabel}
                  name={getSubfieldName(fundDistributionsFieldIndex, 0, index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.FUNDS,
                    wrapperSourcePath: 'funds'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(fundDistributionsFieldIndex, 0, index)}
                  okapi={okapi}
                />
              </Col>
              <Col xs={3}>
                <AcceptedValuesField
                  component={TextField}
                  label={expenseClassLabel}
                  name={getSubfieldName(fundDistributionsFieldIndex, 1, index)}
                  optionValue="name"
                  optionLabel="name"
                  wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                  wrapperSources={[{
                    wrapperSourceLink: WRAPPER_SOURCE_LINKS.EXPENSE_CLASSES,
                    wrapperSourcePath: 'expenseClasses'
                  }]}
                  setAcceptedValues={setReferenceTables}
                  acceptedValuesPath={getRepeatableAcceptedValuesPath(fundDistributionsFieldIndex, 1, index)}
                  okapi={okapi}
                />
              </Col>
              <Col xs={3}>
                <Field
                  component={TextField}
                  label={valueLabel}
                  name={getSubfieldName(fundDistributionsFieldIndex, 2, index)}
                  type="number"
                />
              </Col>
              <Col xs={3}>
                <Field
                  component={TypeToggle}
                  label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.type`} />}
                  name={getSubfieldName(fundDistributionsFieldIndex, 3, index)}
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
