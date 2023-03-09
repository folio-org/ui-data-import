import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { isEmpty } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import {
  FieldOrganization,
  AcceptedValuesField,
} from '../../../../../components';

import {
  getFieldEnabled,
  getFieldName,
} from '../../utils';
import {
  okapiShape,
  validateRequiredField,
} from '../../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';

export const VendorInformation = ({
  setReferenceTables,
  filledVendorId,
  accountingCodeOptions,
  onSelectVendor,
  onClearVendor,
  okapi,
}) => {
  const VENDOR_INFO_FIELDS_MAP = {
    VENDOR_INVOICE_NUMBER: getFieldName(16),
    VENDOR_NAME: getFieldName(17),
    ACCOUNTING_CODE: 18,
  };

  const onAccountingCodeChange = value => {
    setReferenceTables(getFieldEnabled(VENDOR_INFO_FIELDS_MAP.ACCOUNTING_CODE), !isEmpty(value));
  };

  return (
    <Accordion
      id="vendor-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.section`} />}
    >
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorInvoiceNumber`} />}
            name={VENDOR_INFO_FIELDS_MAP.VENDOR_INVOICE_NUMBER}
            validate={validateRequiredField}
            required
          />
        </Col>
        <Col xs={4}>
          <FieldOrganization
            id={filledVendorId}
            setReferenceTables={setReferenceTables}
            name={VENDOR_INFO_FIELDS_MAP.VENDOR_NAME}
            onSelect={onSelectVendor}
            onClear={onClearVendor}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorName`} />}
            validate={validateRequiredField}
            required
            disabled
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(VENDOR_INFO_FIELDS_MAP.ACCOUNTING_CODE)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.accountingCode`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={accountingCodeOptions}
            disabled={!accountingCodeOptions.length}
            onChange={onAccountingCodeChange}
            okapi={okapi}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

VendorInformation.propTypes = {
  okapi: okapiShape.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  onSelectVendor: PropTypes.func.isRequired,
  onClearVendor: PropTypes.func,
  filledVendorId: PropTypes.string,
  accountingCodeOptions: PropTypes.arrayOf(PropTypes.object),
};

VendorInformation.defaultProps = {
  filledVendorId: '',
  accountingCodeOptions: [],
};
