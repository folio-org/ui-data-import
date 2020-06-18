import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import { AcceptedValuesField } from '../../../../../components';

import { getFieldName } from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { okapiShape } from '../../../../../utils';

export const ItemData = ({ okapi }) => {
  return (
    <Accordion
      id="item-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-material-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(7)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.materialType`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSourceLink="/material-types?limit=1000&query=cql.allRecords=1 sortby name"
            wrapperSourcePath="mtypes"
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-copy-number
          xs={6}
        >
          <Field
            component={TextField}
            name={getFieldName(8)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.copyNumber`} />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-call-number-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(9)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberType`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSourceLink="/call-number-types?limit=1000&query=cql.allRecords=1 sortby name"
            wrapperSourcePath="callNumberTypes"
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-call-number-prefix
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(10)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberPrefix`} />}
          />
        </Col>
        <Col
          data-test-call-number
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(11)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumber`} />}
          />
        </Col>
        <Col
          data-test-call-number-suffix
          xs={2}
        >
          <Field
            component={TextField}
            name={getFieldName(12)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.callNumberSuffix`} />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-number-of-pieces
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(13)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.numberOfPieces`} />}
          />
        </Col>
        <Col
          data-test-description-of-pieces
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(14)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemData.field.descriptionOfPieces`} />}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemData.propTypes = { okapi: okapiShape.isRequired };
