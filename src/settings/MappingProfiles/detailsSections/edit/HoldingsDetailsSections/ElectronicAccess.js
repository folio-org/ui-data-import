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
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  AcceptedValuesField,
  RepeatableActionsField,
  WithValidation,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getRepeatableFieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getWrapperSourceLink,
  mappingProfileSubfieldShape,
  okapiShape,
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
      id="holdings-electronic-access"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-electronic-access
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(23)}
            repeatableFieldAction={getRepeatableFieldAction(23)}
            repeatableFieldIndex={23}
            hasRepeatableFields={!!electronicAccess.length}
            onRepeatableActionChange={setReferenceTables}
            recordType={FOLIO_RECORD_TYPES.HOLDINGS.type}
          >
            {isDisabled => (
              <RepeatableField
                fields={electronicAccess}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.EAccess.addLabel`} />}
                onAdd={() => onAdd(electronicAccess, 'electronicAccess', 23, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, electronicAccess, 23, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col
                      data-test-electronic-relationship
                      xs={4}
                    >
                      <AcceptedValuesField
                        component={TextField}
                        name={getSubfieldName(23, 0, index)}
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
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />}
                            name={getSubfieldName(23, 1, index)}
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
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />}
                            name={getSubfieldName(23, 2, index)}
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
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />}
                            name={getSubfieldName(23, 3, index)}
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
                            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />}
                            name={getSubfieldName(23, 4, index)}
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
