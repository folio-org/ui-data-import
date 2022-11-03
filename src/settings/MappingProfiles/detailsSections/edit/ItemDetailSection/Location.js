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

import {
  getAcceptedValuesPath,
  getFieldName,
} from '../../utils';
import {
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import { okapiShape } from '../../../../../utils';

export const Location = ({
  setReferenceTables,
  okapi,
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            optionTemplate="**name** (**code**)"
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(30)}
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
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.LOCATIONS,
              wrapperSourcePath: 'locations',
            }]}
            isRemoveValueAllowed
            optionTemplate="**name** (**code**)"
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(31)}
            okapi={okapi}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
