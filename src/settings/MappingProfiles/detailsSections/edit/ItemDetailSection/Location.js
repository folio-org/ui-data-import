import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import { AcceptedValuesField } from '../../../../../components';

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  okapiShape,
} from '../../../../../utils';

export const Location = ({
  okapi,
  requestLimit,
}) => {
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
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(30)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.permanent`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('LOCATIONS', requestLimit),
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            optionTemplate="**name** (**code**)"
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-temporary
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(31)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.field.temporary`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: getWrapperSourceLink('LOCATIONS', requestLimit),
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            optionTemplate="**name** (**code**)"
            okapi={okapi}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = {
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
