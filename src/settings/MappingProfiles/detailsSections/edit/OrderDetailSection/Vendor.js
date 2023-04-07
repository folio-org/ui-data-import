import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  RepeatableField,
  TextField,
  TextArea,
  Row,
  Col,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  WithValidation,
} from '../../../../../components';
import { useFieldMappingRefValues } from '../../hooks';

import {
  TRANSLATION_ID_PREFIX,
  VENDOR_REF_TYPES,
} from '../../constants';
import {
  getSubfieldName,
  getFieldName,
  onAdd,
  onRemove,
  getAcceptedValuesPath,
  getRepeatableFieldName,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
} from '../../utils';
import { VENDOR_DETAILS_FIELD } from '../../../../../utils';

export const Vendor = ({
  accountNumbers,
  setReferenceTables,
  initialFields,
  okapi,
}) => {
  const VENDOR_FIELDS_MAP = {
    VENDOR_REF_NUMBERS: 44,
    VENDOR_REF_NUMBER: index => getSubfieldName(VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, 0, index),
    VENDOR_REF_TYPE: index => getSubfieldName(VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, 1, index),
    ACCOUNT_NUMBER: 45,
    INSTRUCTION_TO_VENDOR: getFieldName(46),
  };

  const { formatMessage } = useIntl();

  const [vendorRefNumbers] = useFieldMappingRefValues([VENDOR_DETAILS_FIELD]);

  const vendorRefTypeOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.continuationRefNumber` }),
      name: VENDOR_REF_TYPES.CONTINUATION_REF_NUMBER,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.internalNumber` }),
      name: VENDOR_REF_TYPES.INTERNAL_NUMBER,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.orderRefNumber` }),
      name: VENDOR_REF_TYPES.ORDER_REF_NUMBER,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.subscriptionRefNumber` }),
      name: VENDOR_REF_TYPES.SUBSCRIPTION_REF_NUMBER,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.titleRefNumber` }),
      name: VENDOR_REF_TYPES.TITLE_NUMBER,
    },
  ];
  const accountNumbersOptions = accountNumbers.map(accountNo => ({
    label: accountNo,
    value: accountNo,
  }));

  const handleVendorNumbersAdd = useCallback(
    () => {
      const onVendorNumbersAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
      };

      return onAdd(vendorRefNumbers, 'vendorDetail', VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, initialFields, onVendorNumbersAdd, 'order');
    },
    [VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, initialFields, setReferenceTables, vendorRefNumbers],
  );

  const handleVendorNumbersClean = useCallback(
    index => {
      const onVendorNumbersClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
        const repeatableFieldActionPath = getRepeatableFieldName(fieldIndex);

        handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
      };

      return onRemove(index, vendorRefNumbers, VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, onVendorNumbersClean, 'order');
    },
    [VENDOR_FIELDS_MAP.VENDOR_REF_NUMBERS, setReferenceTables, vendorRefNumbers],
  );

  return (
    <Accordion
      id="vendor"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.section`} />}
    >
      <RepeatableField
        fields={vendorRefNumbers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumbers.addLabel`} />}
        onAdd={handleVendorNumbersAdd}
        onRemove={handleVendorNumbersClean}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <WithValidation>
                {validation => (
                  <Field
                    component={TextField}
                    label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumber`} />}
                    name={VENDOR_FIELDS_MAP.VENDOR_REF_NUMBER(index)}
                    validate={[validation]}
                  />
                )}
              </WithValidation>
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={VENDOR_FIELDS_MAP.VENDOR_REF_TYPE(index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefType`} />}
                optionValue="name"
                optionLabel="label"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                acceptedValuesList={vendorRefTypeOptions}
                okapi={okapi}
              />
            </Col>
          </Row>
        )}
      />
      <Row left="xs">
        <Col xs={6}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(VENDOR_FIELDS_MAP.ACCOUNT_NUMBER)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.accountNumber`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(VENDOR_FIELDS_MAP.ACCOUNT_NUMBER)}
            acceptedValuesList={accountNumbersOptions}
            okapi={okapi}
            hasLoaded
          />
        </Col>
        <Col xs={6}>
          <WithValidation>
            {validation => (
              <Field
                component={TextArea}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.instructionsToVendor`} />}
                name={VENDOR_FIELDS_MAP.INSTRUCTION_TO_VENDOR}
                validate={[validation]}
              />
            )}
          </WithValidation>
        </Col>
      </Row>
    </Accordion>
  );
};

Vendor.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  initialFields: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  accountNumbers: PropTypes.arrayOf(PropTypes.object),
};

Vendor.defaultProps = { accountNumbers: [] };
