import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { isEmpty } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  Card,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  transformSubfieldsData,
  getFieldValueFromDetails,
  renderAmountValue,
  renderCheckbox,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  mappingProfileFieldShape,
  CURRENCY_FIELD,
} from '../../../../../utils';

export const InvoiceAdjustments = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const currency = getFieldValueFromDetails(mappingDetails, CURRENCY_FIELD);
  const adjustments = getFieldValue(mappingDetails, 'adjustments', 'subfields');

  const renderAdjustment = (adjustment, index) => {
    const fields = adjustment.fields;

    const headerTitle = (
      <FormattedMessage
        id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.sectionTitle`}
        values={{ index: index + 1 }}
      />
    );

    const descriptionValue = getFieldValue(fields, 'description', 'value');
    const amounValue = getFieldValue(fields, 'value', 'value');
    const amountType = getFieldValue(fields, 'type', 'value');
    const prorateValue = getFieldValue(fields, 'prorate', 'value');
    const relationToTotalValue = getFieldValue(fields, 'relationToTotal', 'value');
    const exportToAccountingValue = getFieldValue(fields, 'exportToAccounting', 'booleanFieldAction');
    const fundDistributions = getFieldValue(fields, 'fundDistributions', 'subfields');

    const fundDistributionsVisibleColumns = ['fundId', 'expenseClassId', 'value', 'amount'];
    const fundDistributionsMapping = {
      fundId: (
        <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.fundId`} />
      ),
      expenseClassId: (
        <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.expenseClass`} />
      ),
      value: (
        <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.value`} />
      ),
      amount: (
        <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.fundDistribution.field.amount`} />
      ),
    };
    const fundDistributionsFormatter = {
      fundId: x => x?.fundId || noValueElement,
      expenseClassId: x => x?.expenseClassId || noValueElement,
      distributionType: x => x.value,
      value: x => (x.value ? renderAmountValue(x.value, x.distributionType, currency) : noValueElement),
      amount: x => x?.amount || prohibitionIconElement('amount'),
    };
    const fundDistributionsFieldsMap = [
      {
        field: 'fundId',
        key: 'value',
      }, {
        field: 'expenseClassId',
        key: 'value',
      }, {
        field: 'value',
        key: 'value',
      }, {
        field: 'amount',
        key: 'value',
      }, {
        field: 'distributionType',
        key: 'value',
      },
    ];
    const fundDistributionsData = transformSubfieldsData(fundDistributions, fundDistributionsFieldsMap);

    return (
      <Card
        headerStart={headerTitle}
        key={index}
      >
        <Row left="xs">
          <Col
            data-test-invoice-adjustment-description
            xs={3}
          >
            <KeyValue
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.description`} />}
              value={descriptionValue}
            />
          </Col>
          <Col
            data-test-invoice-adjustment-amount
            xs={2}
          >
            <KeyValue
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />}
              value={renderAmountValue(amounValue, amountType, currency)}
            />
          </Col>
          <Col
            data-test-invoice-adjustment-prorate
            xs={2}
          >
            <KeyValue
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.prorate`} />}
              value={prorateValue}
            />
          </Col>
          <Col
            data-test-invoice-adjustment-relation-to-total
            xs={2}
          >
            <KeyValue
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.relationToTotal`} />}
              value={relationToTotalValue}
            />
          </Col>
          <Col
            data-test-invoice-adjustment-export-to-accounting
            xs={3}
          >
            <KeyValue
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.exportToAccounting`} />}
              value={renderCheckbox('invoice.invoiceAdjustments.field.exportToAccounting', exportToAccountingValue)}
            />
          </Col>
        </Row>
        {!isEmpty(fundDistributionsData) && (
          <Row left="xs">
            <Col
              data-test-invoice-adjustment-fund-distributions
              xs={12}
            >
              <ViewRepeatableField
                fieldData={fundDistributionsData}
                visibleColumns={fundDistributionsVisibleColumns}
                columnMapping={fundDistributionsMapping}
                formatter={fundDistributionsFormatter}
              />
            </Col>
          </Row>
        )}
      </Card>
    );
  };

  return (
    <Accordion
      id="invoice-adjustments"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.section`} />}
    >
      {!isEmpty(adjustments) && adjustments.map(renderAdjustment)}
    </Accordion>
  );
};

InvoiceAdjustments.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
