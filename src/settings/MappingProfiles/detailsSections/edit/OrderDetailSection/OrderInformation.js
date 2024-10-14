import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';
import { isEmpty } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Checkbox,
  Col,
  RepeatableField,
  Row,
  TextArea,
  TextField,
  KeyValue,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  FieldAssignedTo,
  FieldOrganization,
  WithValidation,
} from '../../../../../components';
import {
  useFieldMappingBoolFieldValue,
  useFieldMappingFieldValue,
  useFieldMappingRefValues,
  useFieldMappingValueFromLookup,
} from '../../hooks';

import {
  boolAcceptedValuesOptions,
  getBoolFieldName,
  getFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
  renderFieldLabelWithInfo,
} from '../../utils';
import {
  DEFAULT_PO_LINES_LIMIT_VALUE,
  PO_STATUS,
  TRANSLATION_ID_PREFIX,
} from '../../constants';
import {
  getWrapperSourceLink,
  BOOLEAN_ACTIONS,
  validateRequiredField,
  validateIntegers,
  BILL_TO_FIELD,
  SHIP_TO_FIELD,
  ASSIGNED_TO_FIELD,
  APPROVED_FIELD,
  MANUAL_PO_FIELD,
  VENDOR_FIELD,
  NOTES_FIELD,
} from '../../../../../utils';

const OrderInformationComponent = ({
  initialFields,
  setReferenceTables,
  onOrganizationSelect = null,
  resources: {
    isApprovalRequired,
    userCanEditPONumber,
    addresses,
  },
  mutator,
  okapi,
  requestLimit,
}) => {
  const ORDER_INFO_FIELDS_MAP = {
    PO_STATUS: getFieldName(0),
    APPROVED: getBoolFieldName(1),
    PO_LINES_LIMIT: getFieldName(2),
    OVERRIDE_PO_LINES_LIMIT: getFieldName(3),
    PREFIX: 4,
    PO_NUMBER: getFieldName(5),
    SUFFIX: 6,
    VENDOR: getFieldName(7),
    ORDER_TYPE: getFieldName(8),
    ACQ_UNITS: 9,
    ASSIGNED_TO: getFieldName(10),
    BILL_TO_NAME: 11,
    SHIP_TO_NAME: 12,
    MANUAL: getBoolFieldName(13),
    RE_ENCUMBER: getFieldName(14),
    NOTES: 15,
    NOTE: index => getSubfieldName(ORDER_INFO_FIELDS_MAP.NOTES, 0, index),
  };

  const { formatMessage } = useIntl();

  const [
    assignedToId,
    billToValue,
    shipToValue,
  ] = useFieldMappingFieldValue([ASSIGNED_TO_FIELD, BILL_TO_FIELD, SHIP_TO_FIELD]);
  const [
    approvedCheckbox,
    manualPOCheckbox,
  ] = useFieldMappingBoolFieldValue([APPROVED_FIELD, MANUAL_PO_FIELD]);
  const [notes] = useFieldMappingRefValues([NOTES_FIELD]);
  const [filledVendorId, mappingValue] = useFieldMappingValueFromLookup(VENDOR_FIELD);

  const [isApprovedChecked, setIsApprovedChecked] = useState(false);
  const [billToAddress, setBillToAddress] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');

  useEffect(() => {
    mutator.purchaseOrderLinesLimitSetting.GET()
      .then(response => {
        let purchaseOrderLinesLimitValue = DEFAULT_PO_LINES_LIMIT_VALUE;

        if (!isEmpty(response.configs)) {
          purchaseOrderLinesLimitValue = response.configs[0]?.value;
        }

        setReferenceTables(ORDER_INFO_FIELDS_MAP.PO_LINES_LIMIT, `"${purchaseOrderLinesLimitValue}"`);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const purchaseOrderStatusLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.purchaseOrderStatus`,
    `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.purchaseOrderStatus.info`,
  );
  const acqUnitsLabel = renderFieldLabelWithInfo(
    `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.acquisitionsUnits`,
    `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.acquisitionUnits.info`,
  );

  const isApprovalRequiredValue = useMemo(
    () => {
      if (isApprovalRequired.hasLoaded && isApprovalRequired.records[0]?.configs[0]?.value) {
        const parsedIsApprovalRequired = JSON.parse(isApprovalRequired.records[0]?.configs[0]?.value);

        return parsedIsApprovalRequired.isApprovalRequired;
      }

      return false;
    },
    [isApprovalRequired.hasLoaded, isApprovalRequired.records],
  );
  const userCanEditPONumberValue = useMemo(
    () => {
      if (userCanEditPONumber.hasLoaded && userCanEditPONumber.records[0]?.configs[0]?.value) {
        const parsedUserCanEditPONumber = JSON.parse(userCanEditPONumber.records[0]?.configs[0]?.value);

        return parsedUserCanEditPONumber.canUserEditOrderNumber;
      }

      return false;
    },
    [userCanEditPONumber.hasLoaded, userCanEditPONumber.records],
  );
  const addressesValue = useMemo(
    () => {
      if (addresses.hasLoaded) {
        return addresses.records[0]?.configs.map(address => JSON.parse(address.value));
      }

      return [];
    },
    [addresses.hasLoaded, addresses.records],
  );
  const purchaseOrderStatusOptions = useMemo(
    () => {
      if (isApprovalRequiredValue && !isApprovedChecked) {
        return [{
          label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.pending` }),
          value: 'Pending',
        }];
      }

      if (!isApprovalRequiredValue || (isApprovalRequiredValue && isApprovedChecked)) {
        return [{
          label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.pending` }),
          value: PO_STATUS.PENDING,
        }, {
          label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.open` }),
          value: PO_STATUS.OPEN,
        }];
      }

      return [];
    },
    [formatMessage, isApprovalRequiredValue, isApprovedChecked],
  );

  useEffect(() => {
    const shipToAddressValue = shipToValue ? addressesValue.find(address => address.name === shipToValue)?.address : '';
    const billToAddressValue = billToValue ? addressesValue.find(address => address.name === billToValue)?.address : '';

    setBillToAddress(billToAddressValue ? `"${billToAddressValue}"` : '');
    setShipToAddress(shipToAddressValue ? `"${shipToAddressValue}"` : '');
  }, [addressesValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNotesAdd = useCallback(
    () => {
      return onAdd(notes, 'notes', ORDER_INFO_FIELDS_MAP.NOTES, initialFields, setReferenceTables, 'order');
    },
    [ORDER_INFO_FIELDS_MAP.NOTES, initialFields, notes, setReferenceTables],
  );

  const handleNotesClean = useCallback(
    index => {
      return onRemove(index, notes, ORDER_INFO_FIELDS_MAP.NOTES, setReferenceTables, 'order');
    },
    [ORDER_INFO_FIELDS_MAP.NOTES, notes, setReferenceTables],
  );

  return (
    <Accordion
      id="order-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={6}>
          <AcceptedValuesField
            component={TextField}
            name={ORDER_INFO_FIELDS_MAP.PO_STATUS}
            label={purchaseOrderStatusLabel}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={purchaseOrderStatusOptions}
            required
          />
        </Col>
        <Col xs={6}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.approved`} />}
            name={ORDER_INFO_FIELDS_MAP.APPROVED}
            onChange={e => {
              setIsApprovedChecked(!(e.target.value === BOOLEAN_ACTIONS.ALL_TRUE));
            }}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={approvedCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.purchaseOrderLinesLimitSetting`} />}
            name={ORDER_INFO_FIELDS_MAP.PO_LINES_LIMIT}
            disabled
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.overridePurchaseOrderLinesLimitSetting`} />}
            name={ORDER_INFO_FIELDS_MAP.OVERRIDE_PO_LINES_LIMIT}
            validate={[validateIntegers]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(ORDER_INFO_FIELDS_MAP.PREFIX)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.prefix`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('PREFIXES', requestLimit),
              wrapperSourcePath: 'prefixes',
            }]}
            okapi={okapi}
          />
        </Col>
        <Col xs={4}>
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.poNumber`} />}
                name={ORDER_INFO_FIELDS_MAP.PO_NUMBER}
                disabled={!userCanEditPONumberValue}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(ORDER_INFO_FIELDS_MAP.SUFFIX)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.suffix`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('SUFFIXES', requestLimit),
              wrapperSourcePath: 'suffixes',
            }]}
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <WithValidation>
            {validation => (
              <FieldOrganization
                id={filledVendorId}
                mappingValue={mappingValue}
                setReferenceTables={setReferenceTables}
                name={ORDER_INFO_FIELDS_MAP.VENDOR}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.vendor`} />}
                onSelect={onOrganizationSelect}
                validate={[validateRequiredField, validation]}
                required
              />
            )}
          </WithValidation>
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.orderType`} />}
            name={ORDER_INFO_FIELDS_MAP.ORDER_TYPE}
            disabled
            required
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(ORDER_INFO_FIELDS_MAP.ACQ_UNITS)}
            label={acqUnitsLabel}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('ACQUISITIONS_UNITS', requestLimit),
              wrapperSourcePath: 'acquisitionsUnits',
            }]}
            isMultiSelection
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <FieldAssignedTo
            id={assignedToId}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.assignedTo`} />}
            name={ORDER_INFO_FIELDS_MAP.ASSIGNED_TO}
            setReferenceTables={setReferenceTables}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(ORDER_INFO_FIELDS_MAP.BILL_TO_NAME)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.billToName`} />}
            optionValue="value"
            optionLabel="value"
            parsedOptionValue="name"
            parsedOptionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('ADDRESSES', requestLimit),
              wrapperSourcePath: 'configs',
            }]}
            okapi={okapi}
            onChange={billToNameValue => {
              const address = addressesValue.find(value => {
                return value.name === billToNameValue.replace(/"/g, '');
              })?.address;

              setBillToAddress(address ? `"${address}"` : '');
            }}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.billToAddress`} />}
            value={billToAddress}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(ORDER_INFO_FIELDS_MAP.SHIP_TO_NAME)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.shipToName`} />}
            optionValue="value"
            optionLabel="value"
            parsedOptionValue="name"
            parsedOptionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('ADDRESSES', requestLimit),
              wrapperSourcePath: 'configs',
            }]}
            okapi={okapi}
            onChange={shipToNameValue => {
              const address = addressesValue.find(value => {
                return value.name === shipToNameValue.replace(/"/g, '');
              })?.address;

              setShipToAddress(address ? `"${address}"` : '');
            }}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.shipToAddress`} />}
            value={shipToAddress}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={1}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.manual`} />}
            name={ORDER_INFO_FIELDS_MAP.MANUAL}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={manualPOCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={ORDER_INFO_FIELDS_MAP.RE_ENCUMBER}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.reEncumber`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={boolAcceptedValuesOptions(formatMessage)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <RepeatableField
        fields={notes}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.note.addLabel`} />}
        onAdd={handleNotesAdd}
        onRemove={handleNotesClean}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={12}>
              <WithValidation>
                {validation => (
                  <Field
                    component={TextArea}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.note`} />}
                    name={ORDER_INFO_FIELDS_MAP.NOTE(index)}
                    validate={[validation]}
                  />
                )}
              </WithValidation>
            </Col>
          </Row>
        )}
      />
    </Accordion>
  );
};

OrderInformationComponent.manifest = Object.freeze({
  purchaseOrderLinesLimitSetting: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==ORDERS and configName==poLines-limit)',
    accumulate: true,
  },
  isApprovalRequired: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==ORDERS and configName==approvals)',
  },
  userCanEditPONumber: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==ORDERS and configName==orderNumber)',
  },
  addresses: {
    type: 'okapi',
    path: 'configurations/entries?query=(module==TENANT and configName==tenant.addresses) sortBy value',
  },
});

OrderInformationComponent.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    isApprovalRequired: PropTypes.object.isRequired,
    userCanEditPONumber: PropTypes.object.isRequired,
    addresses: PropTypes.object.isRequired,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  onOrganizationSelect: PropTypes.func,
  requestLimit: PropTypes.number,
};

export const OrderInformation = stripesConnect(OrderInformationComponent);
