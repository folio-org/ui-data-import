import React, {
  useEffect,
  useState,
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

const OrderInformation = ({
  mappingDetails,
  mutator,
  vendorId,
  userId,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const vendorNameValue = selectedOrganization?.name;
  const userNameValue = !isEmpty(selectedUser) ? getFullName(selectedUser) : null;

  useEffect(() => {
    if (vendorId && selectedOrganization.id !== vendorId) {
      mutator.fieldOrganizationOrg.GET()
        .then(setSelectedOrganization);
    } else {
      setSelectedOrganization({});
    }
  }, [vendorId]); // eslint-disable-line react-hooks/exhaustive-deps
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

  const poStatus = getFieldValue(mappingDetails, 'poStatus', 'value');
  const approved = getFieldValue(mappingDetails, 'approved', 'booleanFieldAction');
  const poLinesLimit = getFieldValue(mappingDetails, 'poLinesLimit', 'value');
  const overridePoLinesLimit = getFieldValue(mappingDetails, 'overridePoLinesLimit', 'value');
  const prefix = getFieldValue(mappingDetails, 'prefix', 'value');
  const poNumber = getFieldValue(mappingDetails, 'poNumber', 'value');
  const suffix = getFieldValue(mappingDetails, 'suffix', 'value');
  const orderType = getFieldValue(mappingDetails, 'orderType', 'value');
  const acqUnitIds = getFieldValue(mappingDetails, 'acqUnitIds', 'value');
  const billTo = getFieldValue(mappingDetails, 'billTo', 'value');
  const billToAddress = getFieldValue(mappingDetails, 'billToAddress', 'value');
  const shipTo = getFieldValue(mappingDetails, 'shipTo', 'value');
  const shipToAddress = getFieldValue(mappingDetails, 'shipToAddress', 'value');
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
            value={poLinesLimit || prohibitionIconElement('pol-limit')}
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
            value={vendorNameValue}
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
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  mutator: PropTypes.object.isRequired,
  vendorId: PropTypes.string,
  userId: PropTypes.string,
};

OrderInformation.manifest = Object.freeze({
  fieldOrganizationOrg: {
    type: 'okapi',
    path: 'organizations/organizations/!{vendorId}',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
  user: {
    type: 'okapi',
    path: 'users/!{userId}',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(OrderInformation);
