import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

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

import { getFieldName } from '../../utils';
import { okapiShape } from '../../../../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';

export const VendorInformation = ({
  setReferenceTables,
  filledVendorId,
  accountingCodeOptions,
  onSelectVendor,
  okapi,
}) => {
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
            name={getFieldName(16)}
          />
        </Col>
        <Col xs={4}>
          <FieldOrganization
            id={filledVendorId}
            setReferenceTables={setReferenceTables}
            name={getFieldName(17)}
            onSelect={onSelectVendor}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorName`} />}
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(18)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.accountingCode`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={accountingCodeOptions}
            disabled={!accountingCodeOptions.length}
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
  filledVendorId: PropTypes.string,
  accountingCodeOptions: PropTypes.arrayOf(PropTypes.object),
};

VendorInformation.defaultProps = {
  filledVendorId: '',
  accountingCodeOptions: [],
};
