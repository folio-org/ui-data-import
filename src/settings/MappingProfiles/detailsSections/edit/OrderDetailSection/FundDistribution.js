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

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';

export const FundDistribution = ({
  fundDistributions,
  currency,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.section`} />}
    >
      <RepeatableField
        fields={fundDistributions}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundDistribution.addLabel`} />}
        onAdd={() => onAdd(fundDistributions, 'fundDistribution', 60, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, fundDistributions, 60, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={3}>
              <AcceptedValuesField
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.fundId`} />}
                name={getSubfieldName(60, 0, index)}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/finance/funds?limit=1000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'funds',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getRepeatableAcceptedValuesPath(60, 0, index)}
                okapi={okapi}
              />
            </Col>
            <Col xs={3}>
              <AcceptedValuesField
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.expenseClass`} />}
                name={getSubfieldName(60, 1, index)}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/finance/expense-classes?limit=2000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'expenseClasses',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getRepeatableAcceptedValuesPath(60, 1, index)}
                okapi={okapi}
              />
            </Col>
            <Col xs={3}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.value`} />}
                name={getSubfieldName(60, 2, index)}
                type="number"
              />
            </Col>
            <Col xs={3}>
              <Field
                component={TypeToggle}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistribution.field.type`} />}
                name={getSubfieldName(60, 3, index)}
                currency={currency}
              />
            </Col>
          </Row>
        )}
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
