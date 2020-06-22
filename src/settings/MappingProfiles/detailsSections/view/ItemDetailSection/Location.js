import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import { getFieldValue } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const Location = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const permanentLocation = getFieldValue(mappingDetails, 'permanentLocation.id', 'value');
  const temporaryLocation = getFieldValue(mappingDetails, 'temporaryLocation.id', 'value');

  return (
    <Accordion
      id="item-location"
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
    </Accordion>
  );
};

Location.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
