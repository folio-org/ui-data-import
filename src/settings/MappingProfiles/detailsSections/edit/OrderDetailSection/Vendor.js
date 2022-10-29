import React from 'react';
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

import { AcceptedValuesField } from '../../../../../components';

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
} from '../../utils';

export const Vendor = ({
  vendorRefNumbers,
  accountNumbers,
  setReferenceTables,
  initialFields,
  okapi,
}) => {
  const { formatMessage } = useIntl();

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

  const vendorDetailFieldIndex = 47;

  return (
    <Accordion
      id="vendor"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.section`} />}
    >
      <RepeatableField
        fields={vendorRefNumbers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumbers.addLabel`} />}
        onAdd={() => onAdd(vendorRefNumbers, 'vendorDetail', vendorDetailFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, vendorRefNumbers, vendorDetailFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumber`} />}
                name={getSubfieldName(vendorDetailFieldIndex, 0, index)}
              />
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={getSubfieldName(vendorDetailFieldIndex, 1, index)}
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
            name={getFieldName(48)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.accountNumber`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(48)}
            acceptedValuesList={accountNumbersOptions}
            hasLoaded
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextArea}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.instructionsToVendor`} />}
            name={getFieldName(49)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Vendor.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  initialFields: PropTypes.object.isRequired,
  okapi: PropTypes.object.isRequired,
  vendorRefNumbers: PropTypes.arrayOf(PropTypes.object),
  accountNumbers: PropTypes.arrayOf(PropTypes.object),
};

Vendor.defaultProps = {
  vendorRefNumbers: [],
  accountNumbers: [],
};
