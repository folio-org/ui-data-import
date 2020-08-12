import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components/ProhibitionIcon';

import { getFieldValue } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const Location = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const permanentLocation = getFieldValue(mappingDetails, 'permanentLocationId', 'value');
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
      id="holdings-location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-permanent
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.permanent`} />}
            value={permanentLocation || noValueElement}
          />
        </Col>
        <Col
          data-test-temporary
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.temporary`} />}
            value={temporaryLocation || noValueElement}
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
            value={shelvingOrder || <ProhibitionIcon />}
          />
        </Col>
        <Col
          data-test-shelving-title
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.location.field.shelvingTitle`} />}
            value={shelvingTitle || noValueElement}
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
            value={copyNumber || noValueElement}
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
            value={callNumberType || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
            value={callNumberPrefix || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
            value={callNumber || noValueElement}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
            value={callNumberSuffix || noValueElement}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
