import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getRepeatableAcceptedValuesPath,
  getRepeatableFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES,
  FUND_DISTRIBUTION_SOURCE,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const InvoiceLineFundDistribution = ({
  fundDistributions,
  initialFields,
  getRepeatableFieldAction,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="invoice-line-fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(40)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.field.fundDistributionSource.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(40)}
            repeatableFieldIndex={40}
            hasRepeatableFields={!!fundDistributions.length}
            onRepeatableActionChange={setReferenceTables}
            wrapperPlaceholder="ui-data-import.settings.mappingProfiles.map.wrapper.fundDistributionSource"
            actions={MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES}
            actionToClearFields={FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FROM_POL}
          >
            {isDisabled => (
              <RepeatableField
                fields={fundDistributions}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.addLabel`} />}
                onAdd={() => onAdd(fundDistributions, 'fundDistributions', 40, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, fundDistributions, 40, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(40, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.fundId`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: '/finance/funds',
                          wrapperSourcePath: 'funds',
                        }]}
                        optionTemplate="**name** (**code**)"
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(40, 0, index)}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={3}>
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(40, 1, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: '/finance/expense-classes',
                          wrapperSourcePath: 'expenseClasses',
                        }]}
                        setAcceptedValues={setReferenceTables}
                        acceptedValuesPath={getRepeatableAcceptedValuesPath(40, 1, index)}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />}
                        name={getSubfieldName(40, 2, index)}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TypeToggle}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.type`} />}
                        name={getSubfieldName(40, 3, index)}
                      />
                    </Col>
                    <Col xs={2}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />}
                        name={getSubfieldName(40, 4, index)}
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
  getRepeatableFieldAction: PropTypes.func.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
