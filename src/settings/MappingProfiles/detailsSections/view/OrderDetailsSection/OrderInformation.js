import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import { getFieldValue, renderCheckbox, transformSubfieldsData } from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

export const OrderInformation = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const workflowStatus = getFieldValue(mappingDetails, 'workflowStatus', 'value');
  const approved = getFieldValue(mappingDetails, 'approved', 'booleanFieldAction');
  const polLimitSetting = getFieldValue(mappingDetails, 'polLimitSetting', 'value');
  const overridePOLLimitSetting = getFieldValue(mappingDetails, 'overridePOLLimitSetting', 'value');
  const poNumber = getFieldValue(mappingDetails, 'poNumber', 'value');
  const poNumberPrefix = getFieldValue(mappingDetails, 'poNumberPrefix', 'value');
  const poNumberSuffix = getFieldValue(mappingDetails, 'poNumberSuffix', 'value');
  const vendor = getFieldValue(mappingDetails, 'vendor', 'value');
  const orderType = getFieldValue(mappingDetails, 'orderType', 'value');
  const acqUnitIds = mappingDetails.find(item => item.name === 'acqUnitIds')?.subfields[0]?.fields[0]?.value;
  const assignedTo = getFieldValue(mappingDetails, 'assignedTo', 'value');
  const billToName = getFieldValue(mappingDetails, 'billTo', 'value');
  const billToAddress = getFieldValue(mappingDetails, 'billToAddress', 'value');
  const shipToName = getFieldValue(mappingDetails, 'shipTo', 'value');
  const shipToAddress = getFieldValue(mappingDetails, 'shipToAddress', 'value');
  const manual = getFieldValue(mappingDetails, 'manualPo', 'booleanFieldAction');
  const reEncumber = getFieldValue(mappingDetails, 'reEncumber', 'booleanFieldAction');
  const notes = getFieldValue(mappingDetails, 'notes', 'subfields');

  const manualCheckbox = renderCheckbox('order.orderInformation.manual', manual);
  const reEncumberCheckbox = renderCheckbox('order.orderInformation.reEncumber', reEncumber);
  const approvedCheckbox = renderCheckbox('order.orderInformation.approved', approved);

  const notesVisibleColumns = ['note'];

  const notesMapping = {
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.note`} />
    ),
  };

  const notesFieldsMap = [
    {
      field: 'note',
      key: 'value',
    }
  ];

  const notesFormatter = { note: x => x?.note || noValueElement };

  const notesData = transformSubfieldsData(notes, notesFieldsMap);

  return (
    <Accordion
      id="view-order-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-workflow-status
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.workflowStatus`} />}
            value={workflowStatus}
          />
        </Col>
        <Col
          data-test-approved
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.approved`} />}
            value={approvedCheckbox}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-pol-limit-setting
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.polLimitSetting`} />}
            value={polLimitSetting || prohibitionIconElement('pol-limit-setting')}
          />
        </Col>
        <Col
          data-test-override-pol-limit-setting
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.overridePOLLimitSetting`} />}
            value={overridePOLLimitSetting}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-po-number-prefix
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.poNumberPrefix`} />}
            value={poNumberPrefix}
          />
        </Col>
        <Col
          data-test-po-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.poNumber`} />}
            value={poNumber}
          />
        </Col>
        <Col
          data-test-po-number-suffix
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.poNumberSuffix`} />}
            value={poNumberSuffix}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-vendor
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.vendor`} />}
            value={vendor}
          />
        </Col>
        <Col
          data-test-order-type
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.orderType`} />}
            value={orderType}
          />
        </Col>
        <Col
          data-test-acquisitions-units
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.acquisitionsUnits`} />}
            value={acqUnitIds}
          />
        </Col>
        <Col
          data-test-assigned-to
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.assignedTo`} />}
            value={assignedTo}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-bill-to
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.billTo`} />}
            value={billToName}
          />
        </Col>
        <Col
          data-test-bill-to-address
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.billToAddress`} />}
            value={billToAddress || prohibitionIconElement('bill-to-address')}
          />
        </Col>
        <Col
          data-test-ship-to
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.shipTo`} />}
            value={shipToName}
          />
        </Col>
        <Col
          data-test-ship-to-address
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.shipToAddress`} />}
            value={shipToAddress || prohibitionIconElement('ship-to-address')}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-manual-po
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.manual`} />}
            value={manualCheckbox}
          />
        </Col>
        <Col
          data-test-re-encumber
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.reEncumber`} />}
            value={reEncumberCheckbox}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-notes
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="notes"
            fieldData={notesData}
            visibleColumns={notesVisibleColumns}
            columnMapping={notesMapping}
            formatter={notesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.order.orderInformation.notes.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

OrderInformation.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
