import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  RepeatableField,
  TextField,
} from '@folio/stripes/components';

import {
  BooleanActionField,
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
  getBoolFieldName,
} from '../utils';
import { TRANSLATION_ID_PREFIX } from '../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const AdministrativeData = ({
  formerIds,
  statisticalCodeIds,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  return (
    <Accordion
      id="administrative-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-suppress-from-discovery
          xs={6}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            name={getBoolFieldName(0)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-holdings-hrid
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.hrid`} />}
            name={getFieldName(1)}
            disabled
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          id="section-former-ids"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getFieldName(2)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.legend`} />}
          >
            <RepeatableField
              fields={formerIds}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.addLabel`} />}
              onAdd={() => onAdd(formerIds, 'formerIds', 2, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, formerIds, 2, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId`} />}
                      name={getSubfieldName(2, 0, index)}
                    />
                  </Col>
                </Row>
              )}
            />
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-holdings-type
          xs={6}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(3)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.holdingsTypeId`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSourceLink="/holdings-types?limit=1000&query=cql.allRecords=1 sortby name"
            wrapperSourcePath="holdingsTypes"
            okapi={okapi}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          id="section-statistical-code-ids"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getFieldName(4)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />}
          >
            <RepeatableField
              fields={statisticalCodeIds}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.addLabel`} />}
              onAdd={() => onAdd(statisticalCodeIds, 'statisticalCodeIds', 4, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, statisticalCodeIds, 4, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-statistical-code
                    xs={12}
                  >
                    <AcceptedValuesField
                      component={TextField}
                      name={getSubfieldName(4, 0, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourceLink="/statistical-codes?limit=2000&query=cql.allRecords=1 sortby name"
                      wrapperSourcePath="statisticalCodes"
                      okapi={okapi}
                    />
                  </Col>
                </Row>
              )}
            />
          </RepeatableActionsField>
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = {
  formerIds: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired,
  statisticalCodeIds: PropTypes.arrayOf(PropTypes.shape(mappingProfileSubfieldShape)).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.shape(okapiShape).isRequired,
};
