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
  renderAmountValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const FundDistribution = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const fundDistributions = getFieldValue(mappingDetails, 'fundDistribution', 'subfields');

  const fundDistributionsVisibleColumns = ['fundId', 'expenseClassId', 'value'];

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
    fundId: x => x?.fundId || noValueElement,
    expenseClassId: x => x?.expenseClassId || noValueElement,
    value: x => (x.value ? renderAmountValue(x.value, x.distributionType) : noValueElement),
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
