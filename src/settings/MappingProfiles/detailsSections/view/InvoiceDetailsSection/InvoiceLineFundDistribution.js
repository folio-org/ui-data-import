import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  transformSubfieldsData,
  getFieldValueFromDetails,
  renderAmountValue,
} from '../../utils';
import {
  mappingProfileFieldShape,
  CURRENCY_FIELD,
  MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES,
  FUND_DISTRIBUTION_SOURCE,
} from '../../../../../utils';

export const InvoiceLineFundDistribution = ({
  mappingDetails,
  invoiceLineMappingDetails,
}) => {
  const noValueElement = <NoValue />;

  const currency = getFieldValueFromDetails(mappingDetails, CURRENCY_FIELD);
  const fundDistributions = getFieldValue(invoiceLineMappingDetails, 'fundDistributions', 'subfields');
  const fundDistributionsRepeatableAction = getFieldValue(invoiceLineMappingDetails, 'fundDistributions', 'value');

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
    value: x => (x.value ? renderAmountValue(x.value, x.distributionType, currency) : noValueElement),
    amount: x => x?.amount || <ProhibitionIcon fieldName={`invoice-line-fund-distributions-amount-${x.rowIndex}`} />,
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
      field: 'distributionType',
      key: 'value',
    }, {
      field: 'amount',
      key: 'value',
    },
  ];
  const fundDistributionsData = transformSubfieldsData(fundDistributions, fundDistributionsFieldsMap);

  return (
    <Accordion
      id="view-invoice-line-fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-invoice-line-fund-distribution
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="invoice-line-fund-distribution"
            repeatableAction={fundDistributionsRepeatableAction}
            repeatableFieldActions={MAPPING_FUND_DISTRIBUTION_FIELD_SOURCES}
            repeatableActionToDelete={FUND_DISTRIBUTION_SOURCE.USE_FUND_DISTRIBUTION_FROM_POL}
            fieldData={fundDistributionsData}
            visibleColumns={fundDistributionsVisibleColumns}
            columnMapping={fundDistributionsMapping}
            formatter={fundDistributionsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineFundDistribution.field.fundDistributionSource.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineFundDistribution.propTypes = {
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  invoiceLineMappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
};
