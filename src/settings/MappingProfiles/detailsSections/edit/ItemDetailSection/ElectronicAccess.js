import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  getRepeatableFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  okapiShape,
  mappingProfileSubfieldShape,
} from '../../../../../utils';

export const ElectronicAccess = ({
  electronicAccess,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
  requestLimit,
}) => {
  return (
    <Accordion
      id="item-electronic-access"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-electronic-access
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(32)}
            repeatableFieldAction={getRepeatableFieldAction(32)}
            repeatableFieldIndex={32}
            hasRepeatableFields={!!electronicAccess.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.ITEM.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={electronicAccess}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.EAccess.addLabel`} />}
                onAdd={() => onAdd(electronicAccess, 'electronicAccess', 32, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, electronicAccess, 32, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-electronic-relationship
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(32, 0, index)}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.relationship`} />}
                        optionValue="name"
                        optionLabel="name"
                        wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                        wrapperSources={[{
                          wrapperSourceLink: getWrapperSourceLink('ELECTRONIC_ACCESS', requestLimit),
                          wrapperSourcePath: 'electronicAccessRelationships',
                        }]}
                        okapi={okapi}
                      />
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(32, 1, index)}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(32, 2, index)}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(32, 3, index)}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                    <Col xs={2}>
                      <WithValidation>
                        {validation => (
                          <Field
                            component={TextField}
                            name={getSubfieldName(32, 4, index)}
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />}
                            validate={[validation]}
                          />
                        )}
                      </WithValidation>
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
    </Accordion>
  );
};

ElectronicAccess.propTypes = {
  electronicAccess: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  requestLimit: PropTypes.number,
};
