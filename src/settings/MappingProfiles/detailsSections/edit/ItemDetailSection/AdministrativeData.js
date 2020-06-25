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
  getRepeatableFieldName,
  getRepeatableAcceptedValuesPath,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
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
          xs={4}
        >
          <BooleanActionField
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            name={getBoolFieldName(0)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-item-hrid
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.hrid`} />}
            name={getFieldName(1)}
            disabled
          />
        </Col>
        <Col
          data-test-barcode
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.barcode`} />}
            name={getFieldName(2)}
          />
        </Col>
        <Col
          data-test-accession-number
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.accessionNumber`} />}
            name={getFieldName(3)}
          />
        </Col>
        <Col
          data-test-item-identifier
          xs={3}
        >
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.itemIdentifier`} />}
            name={getFieldName(4)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-former-ids
          id="section-former-ids"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(5)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId.legend`} />}
          >
            <RepeatableField
              fields={formerIds}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId.addLabel`} />}
              onAdd={() => onAdd(formerIds, 'formerIds', 5, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, formerIds, 5, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col xs={12}>
                    <Field
                      component={TextField}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId`} />}
                      name={getSubfieldName(5, 0, index)}
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
          data-test-statistical-codes
          id="section-statistical-code-ids"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(6)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />}
          >
            <RepeatableField
              fields={statisticalCodeIds}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.addLabel`} />}
              onAdd={() => onAdd(statisticalCodeIds, 'statisticalCodeIds', 6, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, statisticalCodeIds, 6, setReferenceTables, 'order')}
              renderField={(field, index) => (
                <Row left="xs">
                  <Col
                    data-test-statistical-code
                    xs={12}
                  >
                    <AcceptedValuesField
                      component={TextField}
                      name={getSubfieldName(6, 0, index)}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />}
                      optionValue="name"
                      optionLabel="name"
                      wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                      wrapperSourcesFn="statisticalCodeTypeName"
                      wrapperSources={[{
                        wrapperSourceLink: '/statistical-codes?limit=2000&query=cql.allRecords=1 sortby name',
                        wrapperSourcePath: 'statisticalCodes',
                      }, {
                        wrapperSourceLink: '/statistical-code-types?limit=1000&query=cql.allRecords=1 sortby name',
                        wrapperSourcePath: 'statisticalCodeTypes',
                      }]}
                      optionTemplate="**statisticalCodeTypeName**: **code** - **name**"
                      setAcceptedValues={setReferenceTables}
                      acceptedValuesPath={getRepeatableAcceptedValuesPath(6, 0, index)}
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
  formerIds: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  statisticalCodeIds: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
