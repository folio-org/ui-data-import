import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  getFieldValueFromDetails,
  renderAmountValue,
  transformSubfieldsData,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  FUND_DISTRIBUTION_VISIBLE_COLUMNS,
} from '../../constants';
import {
  CURRENCY_FIELD,
  mappingProfileFieldShape,
} from '../../../../../utils';

export const FundDistribution = ({ mappingDetails }) => {
  const {
    FUND_ID,
    EXPENSE_CLASS_ID,
    VALUE,
  } = FUND_DISTRIBUTION_VISIBLE_COLUMNS;

  const currency = getFieldValueFromDetails(mappingDetails, CURRENCY_FIELD, true);

  const noValueElement = <NoValue />;

  const fundDistributions = getFieldValue(mappingDetails, 'fundDistribution', 'subfields');

  const fundDistributionsVisibleColumns = [
    FUND_ID,
    EXPENSE_CLASS_ID,
    VALUE,
  ];

  const fundDistributionsMapping = {
    fundId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistributions.fundId`} />
    ),
    expenseClassId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistributions.expenseClassId`} />
    ),
    value: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistributions.value`} />
    ),
  };

  const fundDistributionsFormatter = {
    fundId: distribution => distribution?.fundId || noValueElement,
    expenseClassId: distribution => distribution?.expenseClassId || noValueElement,
    value: distribution => (
      distribution.value ? renderAmountValue(distribution.value, distribution.distributionType, currency) : noValueElement
    ),
  };

  const fundDistributionsFieldsMap = [
    {
      field: 'fundId',
      key: 'value',
    }, {
      field: 'expenseClassId',
      key: 'value',
    },
    {
      field: 'value',
      key: 'value',
    },
    {
      field: 'distributionType',
      key: 'value',
    },
  ];

  const fundDistributionsData = transformSubfieldsData(fundDistributions, fundDistributionsFieldsMap);

  return (
    <Accordion
      id="view-fund-distribution"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.fundDistributions.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-fund-distribution
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="fund-distribution"
            fieldData={fundDistributionsData}
            visibleColumns={fundDistributionsVisibleColumns}
            columnMapping={fundDistributionsMapping}
            formatter={fundDistributionsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

FundDistribution.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
