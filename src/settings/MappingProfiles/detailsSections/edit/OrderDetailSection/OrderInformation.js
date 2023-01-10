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

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Checkbox,
  Col,
  RepeatableField,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  FieldAssignedTo,
  FieldOrganization,
  WithValidation,
} from '../../../../../components';

import {
  boolAcceptedValuesOptions,
  getAcceptedValuesPath,
  getBoolFieldName,
  getFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import {
  FIELD_NAME_PREFIX,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  BOOLEAN_ACTIONS,
  validateRequiredField,
} from '../../../../../utils';

const OrderInformationComponent = ({
  approvedCheckbox,
  manualPOCheckbox,
  notes,
  filledVendorId,
  assignedToId,
  initialFields,
  setReferenceTables,
  onOrganizationSelect,
  resources: {
    purchaseOrderLinesLimitSetting,
    isApprovalRequired,
    userCanEditPONumber,
    addresses,
  },
  okapi,
}) => {
  const { formatMessage } = useIntl();

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

  const [isApprovedChecked, setIsApprovedChecked] = useState(false);
  const [billToAddress, setBillToAddress] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');

  useEffect(() => {
    if (purchaseOrderLinesLimitSetting.hasLoaded) {
      const purchaseOrderLinesLimitValue = purchaseOrderLinesLimitSetting.records[0]?.configs[0]?.value;
      setReferenceTables(`${FIELD_NAME_PREFIX}[2].value`, `"${purchaseOrderLinesLimitValue}"`);
    }
  }, [purchaseOrderLinesLimitSetting.hasLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

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
          value: 'Pending',
        }, {
          label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.orderInformation.field.open` }),
          value: 'Open',
        }];
      }

      return [];
    },
    [formatMessage, isApprovalRequiredValue, isApprovedChecked],
  );

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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.purchaseOrderStatus`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={purchaseOrderStatusOptions}
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
          <WithValidation>
            {validation => (
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.overridePurchaseOrderLinesLimitSetting`} />}
                name={ORDER_INFO_FIELDS_MAP.OVERRIDE_PO_LINES_LIMIT}
                validate={[validation]}
              />
            )}
          </WithValidation>
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.PREFIXES,
              wrapperSourcePath: 'prefixes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(ORDER_INFO_FIELDS_MAP.PREFIX)}
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.SUFFIXES,
              wrapperSourcePath: 'suffixes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(ORDER_INFO_FIELDS_MAP.SUFFIX)}
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
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.acquisitionUnits`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ACQUISITIONS_UNITS,
              wrapperSourcePath: 'acquisitionsUnits',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(ORDER_INFO_FIELDS_MAP.ACQ_UNITS)}
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ADDRESSES,
              wrapperSourcePath: 'configs',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(ORDER_INFO_FIELDS_MAP.BILL_TO_NAME)}
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
          <TextField
            value={billToAddress}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.billToAddress`} />}
            disabled
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.ADDRESSES,
              wrapperSourcePath: 'configs',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(ORDER_INFO_FIELDS_MAP.SHIP_TO_NAME)}
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
          <TextField
            value={shipToAddress}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.orderInformation.field.shipToAddress`} />}
            disabled
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
    purchaseOrderLinesLimitSetting: PropTypes.object.isRequired,
    isApprovalRequired: PropTypes.object.isRequired,
    userCanEditPONumber: PropTypes.object.isRequired,
    addresses: PropTypes.object.isRequired,
  }).isRequired,
  okapi: PropTypes.object.isRequired,
  approvedCheckbox: PropTypes.string,
  manualPOCheckbox: PropTypes.string,
  onOrganizationSelect: PropTypes.func,
  notes: PropTypes.arrayOf(PropTypes.object),
  filledVendorId: PropTypes.string,
  assignedToId: PropTypes.string,
};

OrderInformationComponent.defaultProps = {
  approvedCheckbox: null,
  manualPOCheckbox: null,
  onOrganizationSelect: null,
  notes: [],
  filledVendorId: null,
  assignedToId: null,
};

export const OrderInformation = stripesConnect(OrderInformationComponent);
