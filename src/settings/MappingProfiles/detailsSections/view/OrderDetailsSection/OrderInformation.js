import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  TRANSLATION_ID_PREFIX,
  NOTES_VISIBLE_COLUMNS,
} from '../../constants';
import {
  getFieldValue,
  renderCheckbox,
  transformSubfieldsData,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';
import { useOrganizationValue } from '../../hooks';

const OrderInformation = ({
  mappingDetails,
  mutator,
  vendorId,
  userId,
  resources: {
    addresses,
    purchaseOrderLinesLimitSetting,
  },
}) => {
  const [poLinesLimit, setPoLinesLimit] = useState('"1"');
  const [billToAddress, setBillToAddress] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const { organization } = useOrganizationValue(vendorId);

  const userNameValue = !isEmpty(selectedUser) ? getFullName(selectedUser) : null;
  const billTo = getFieldValue(mappingDetails, 'billTo', 'value');
  const shipTo = getFieldValue(mappingDetails, 'shipTo', 'value');

  const purchaseOrderLinesLimitValue = useMemo(
    () => {
      if (purchaseOrderLinesLimitSetting.hasLoaded && !isEmpty(purchaseOrderLinesLimitSetting.records)) {
        return purchaseOrderLinesLimitSetting.records[0]?.configs[0]?.value;
      }

      return '';
    },
    [purchaseOrderLinesLimitSetting.hasLoaded, purchaseOrderLinesLimitSetting.records],
  );

  useEffect(() => {
    if (purchaseOrderLinesLimitValue) {
      setPoLinesLimit(`"${purchaseOrderLinesLimitValue}"`);
    }
  }, [purchaseOrderLinesLimitValue]);
  useEffect(() => {
    let addressesValue = [];

    if (addresses.hasLoaded) {
      addressesValue = [...addresses.records[0]?.configs.map(address => JSON.parse(address.value))];
    }

    if (billTo) {
      const billToAddressVal = addressesValue.find(value => {
        return value.name === billTo.replace(/"/g, '');
      })?.address;

      setBillToAddress(billToAddressVal ? `"${billToAddressVal}"` : '');
    }

    if (shipTo) {
      const shipToAddressVal = addressesValue.find(value => {
        return value.name === shipTo.replace(/"/g, '');
      })?.address;

      setShipToAddress(shipToAddressVal ? `"${shipToAddressVal}"` : '');
    }
  }, [addresses.hasLoaded, addresses.records, billTo, shipTo]);
  useEffect(() => {
    if (userId && selectedUser.id !== userId) {
      mutator.user.GET()
        .then(setSelectedUser);
    } else {
      setSelectedUser({});
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const { NOTE } = NOTES_VISIBLE_COLUMNS;

  const noValueElement = <NoValue />;
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const poStatus = getFieldValue(mappingDetails, 'workflowStatus', 'value');
  const approved = getFieldValue(mappingDetails, 'approved', 'booleanFieldAction');
  const overridePoLinesLimit = getFieldValue(mappingDetails, 'overridePoLinesLimit', 'value');
  const prefix = getFieldValue(mappingDetails, 'prefix', 'value');
  const poNumber = getFieldValue(mappingDetails, 'poNumber', 'value');
  const suffix = getFieldValue(mappingDetails, 'suffix', 'value');
  const orderType = getFieldValue(mappingDetails, 'orderType', 'value');
  const acqUnitIds = getFieldValue(mappingDetails, 'acqUnitIds', 'value');
  const manualPo = getFieldValue(mappingDetails, 'manualPo', 'booleanFieldAction');
  const reEncumber = getFieldValue(mappingDetails, 'reEncumber', 'value');
  const notes = getFieldValue(mappingDetails, 'notes', 'subfields');

  const manualCheckbox = renderCheckbox('order.orderInformation.manualPo', manualPo);
  const approvedCheckbox = renderCheckbox('order.orderInformation.approved', approved);

  const notesVisibleColumns = [NOTE];

  const notesMapping = {
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.note`} />
    ),
  };

  const notesFieldsMap = [
    {
      field: 'notes',
      key: 'value',
    }
  ];

  const notesFormatter = { note: note => note?.notes || noValueElement };

  const notesData = transformSubfieldsData(notes, notesFieldsMap);

  return (
    <Accordion
      id="view-order-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-po-status
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.poStatus`} />}
            value={poStatus}
          />
        </Col>
        <Col
          data-test-approved
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.approved`} />}
            value={approvedCheckbox}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-pol-limit
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.poLinesLimit`} />}
            value={poLinesLimit}
          />
        </Col>
        <Col
          data-test-override-pol-limit
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.overridePoLinesLimit`} />}
            value={overridePoLinesLimit}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-po-number-prefix
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.prefix`} />}
            value={prefix}
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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.suffix`} />}
            value={suffix}
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
            value={organization}
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
            value={userNameValue}
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
            value={billTo}
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
            value={shipTo}
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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.manualPo`} />}
            value={manualCheckbox}
          />
        </Col>
        <Col
          data-test-re-encumber
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.reEncumber`} />}
            value={reEncumber}
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

OrderInformation.propTypes = {
  resources: PropTypes.shape({
    addresses: PropTypes.object.isRequired,
    purchaseOrderLinesLimitSetting: PropTypes.object.isRequired,
  }).isRequired,
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  mutator: PropTypes.object.isRequired,
  vendorId: PropTypes.string,
  userId: PropTypes.string,
};

OrderInformation.manifest = Object.freeze({
  purchaseOrderLinesLimitSetting: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==ORDERS and configName==poLines-limit)',
  },
  user: {
    type: 'okapi',
    path: 'users/!{userId}',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
  addresses: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==TENANT and configName==tenant.addresses) sortBy value',
  },
});

export default stripesConnect(OrderInformation);
