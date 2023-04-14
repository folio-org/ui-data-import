import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components/ProhibitionIcon';

import { getFieldValue } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const Location = ({ mappingDetails }) => {
  const permanentLocationSubfields = getFieldValue(mappingDetails, 'permanentLocationId', 'subfields');
  const permanentLocation = permanentLocationSubfields[0].fields[0].value;
  const temporaryLocation = getFieldValue(mappingDetails, 'temporaryLocationId', 'value');
  const shelvingOrder = getFieldValue(mappingDetails, 'shelvingOrder', 'value');
  const shelvingTitle = getFieldValue(mappingDetails, 'shelvingTitle', 'value');
  const copyNumber = getFieldValue(mappingDetails, 'copyNumber', 'value');
  const callNumberType = getFieldValue(mappingDetails, 'callNumberTypeId', 'value');
  const callNumberPrefix = getFieldValue(mappingDetails, 'callNumberPrefix', 'value');
  const callNumber = getFieldValue(mappingDetails, 'callNumber', 'value');
  const callNumberSuffix = getFieldValue(mappingDetails, 'callNumberSuffix', 'value');

  return (
    <Accordion
      id="view-holdings-location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-permanent
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.permanent`} />}
            value={permanentLocation}
          />
        </Col>
        <Col
          data-test-temporary
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.temporary`} />}
            value={temporaryLocation}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-shelving-order
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingOrder`} />}
            value={shelvingOrder || <ProhibitionIcon fieldName="shelving-order" />}
          />
        </Col>
        <Col
          data-test-shelving-title
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingTitle`} />}
            value={shelvingTitle}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-copy-number
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.copyNumber`} />}
            value={copyNumber}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-call-number-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            value={callNumberType}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
            value={callNumberPrefix}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
            value={callNumber}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
            value={callNumberSuffix}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
