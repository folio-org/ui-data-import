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

import { TRANSLATION_ID_PREFIX } from '../../constants';
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
      name: 'Vendor continuation reference number',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.internalNumber` }),
      name: 'Vendor internal number',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.orderRefNumber` }),
      name: 'Vendor order reference number',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.subscriptionRefNumber` }),
      name: 'Vendor subscription reference number',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.vendor.field.titleRefNumber` }),
      name: 'Vendor title number',
    },
  ];
  const accountNumbersOptions = accountNumbers.map(accountNo => ({
    label: accountNo,
    value: accountNo,
  }));

  return (
    <Accordion
      id="vendor"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.section`} />}
    >
      <RepeatableField
        fields={vendorRefNumbers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumbers.addLabel`} />}
        onAdd={() => onAdd(vendorRefNumbers, 'vendorDetail', 47, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, vendorRefNumbers, 47, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.vendor.field.vendorRefNumber`} />}
                name={getSubfieldName(47, 0, index)}
              />
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={getSubfieldName(47, 1, index)}
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
