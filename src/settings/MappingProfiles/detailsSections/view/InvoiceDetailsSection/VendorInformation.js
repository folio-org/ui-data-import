import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import { getFieldValue } from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

const VendorInformation = ({
  mappingDetails,
  vendorId,
  mutator,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  const vendorInvoiceNumberValue = getFieldValue(mappingDetails, 'vendorInvoiceNo', 'value');
  const vendorNameValue = selectedOrganization?.name;
  const accountingCodeValue = getFieldValue(mappingDetails, 'accountingCode', 'value');

  useEffect(() => {
    if (vendorId && selectedOrganization.id !== vendorId) {
      mutator.fieldOrganizationOrg.GET()
        .then(setSelectedOrganization);
    } else {
      setSelectedOrganization({});
    }
  }, [vendorId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Accordion
      id="vendor-information"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-vendor-invoice-number
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorInvoiceNumber`} />}
            value={vendorInvoiceNumberValue}
          />
        </Col>
        <Col
          data-test-vendor-name
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.vendorName`} />}
            value={vendorNameValue}
          />
        </Col>
        <Col
          data-test-accounting-code
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.vendorInformation.field.accountingCode`} />}
            value={accountingCodeValue}
          />
        </Col>
      </Row>

    </Accordion>
  );
};

VendorInformation.propTypes = {
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  mutator: PropTypes.object.isRequired,
  vendorId: PropTypes.string,
};

VendorInformation.manifest = {
  fieldOrganizationOrg: {
    type: 'okapi',
    path: 'organizations/organizations/!{vendorId}',
    throwErrors: false,
    perRequest: 1000,
    accumulate: true,
    fetch: false,
  },
};

export default stripesConnect(VendorInformation);
