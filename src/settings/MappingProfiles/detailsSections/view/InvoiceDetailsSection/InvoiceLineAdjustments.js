import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  transformSubfieldsData,
  getFieldValueFromDetails,
  renderAmountValue,
  renderCheckbox,
} from '../../utils';
import {
  mappingProfileFieldShape,
  CURRENCY_FIELD,
} from '../../../../../utils';

export const InvoiceLineAdjustments = ({
  mappingDetails,
  invoiceLineMappingDetails,
}) => {
  const noValueElement = <NoValue />;

  const currency = getFieldValueFromDetails(mappingDetails, CURRENCY_FIELD);
  const lineAdjustments = getFieldValue(invoiceLineMappingDetails, 'lineAdjustments', 'subfields');

  const lineAdjustmentsVisibleColumns = ['description', 'value', 'relationToTotal', 'exportToAccounting'];
  const lineAdjustmentsMapping = {
    description: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.description`} />
    ),
    value: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />
    ),
    relationToTotal: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.relationToTotal`} />
    ),
    exportToAccounting: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.exportToAccounting`} />
    ),
  };
  const lineAdjustmentsFormatter = {
    description: x => x?.description || noValueElement,
    value: x => (x.value ? renderAmountValue(x.value, x.type, currency) : noValueElement),
    relationToTotal: x => x?.relationToTotal || noValueElement,
    exportToAccounting: x => renderCheckbox('invoice.invoiceAdjustments.field.exportToAccounting', x.exportToAccounting),
  };
  const lineAdjustmentsFieldsMap = [
    {
      field: 'description',
      key: 'value',
    }, {
      field: 'value',
      key: 'value',
    }, {
      field: 'type',
      key: 'value',
    }, {
      field: 'relationToTotal',
      key: 'value',
    }, {
      field: 'exportToAccounting',
      key: 'booleanFieldAction',
    },
  ];
  const lineAdjustmentsData = transformSubfieldsData(lineAdjustments, lineAdjustmentsFieldsMap);

  return (
    <Accordion
      id="invoice-line-adjustments"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineAdjustments.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-invoice-line-adjustments
          xs={12}
        >
          <ViewRepeatableField
            fieldData={lineAdjustmentsData}
            visibleColumns={lineAdjustmentsVisibleColumns}
            columnMapping={lineAdjustmentsMapping}
            formatter={lineAdjustmentsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineAdjustments.propTypes = {
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  invoiceLineMappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
};
