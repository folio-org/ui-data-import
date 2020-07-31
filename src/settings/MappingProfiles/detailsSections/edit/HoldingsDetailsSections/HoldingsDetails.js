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
  AcceptedValuesField,
  RepeatableActionsField,
} from '../../../../../components';

import {
  onAdd,
  onRemove,
  getFieldName,
  getSubfieldName,
  getRepeatableFieldName,
  getAcceptedValuesPath,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  validateTextFieldRemoveValue,
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const HoldingsDetails = ({
  holdingsStatements,
  holdingsStatementsForSupplements,
  holdingsStatementsForIndexes,
  initialFields,
  setReferenceTables,
  getRepeatableFieldAction,
  okapi,
}) => {
  return (
    <Accordion
      id="holdings-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.details.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-number-of-items
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(14)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.details.field.numberOfItems`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements
          id="section-holding-statements"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(15)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(15)}
            repeatableFieldIndex={15}
            hasRepeatableFields={!!holdingsStatements.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={holdingsStatements}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement.addLabel`} />}
                onAdd={() => onAdd(holdingsStatements, 'holdingsStatements', 15, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, holdingsStatements, 15, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />}
                        name={getSubfieldName(15, 0, index)}
                      />
                    </Col>
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementNote`} />}
                        name={getSubfieldName(15, 1, index)}
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements-for-supplement
          id="section-holding-statements-for-supplements"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(16)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForSupplements.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(16)}
            repeatableFieldIndex={16}
            hasRepeatableFields={!!holdingsStatementsForSupplements.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={holdingsStatementsForSupplements}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForSupplements.addLabel`} />}
                onAdd={() => onAdd(holdingsStatementsForSupplements, 'holdingsStatementsForSupplements', 16, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, holdingsStatementsForSupplements, 16, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />}
                        name={getSubfieldName(16, 0, index)}
                      />
                    </Col>
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementNote`} />}
                        name={getSubfieldName(16, 1, index)}
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements-for-indexes
          id="section-holding-statements-for-indexes"
          xs={12}
        >
          <RepeatableActionsField
            wrapperFieldName={getRepeatableFieldName(17)}
            legend={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForIndexes.legend`} />}
            repeatableFieldAction={getRepeatableFieldAction(17)}
            repeatableFieldIndex={17}
            hasRepeatableFields={!!holdingsStatementsForIndexes.length}
            onRepeatableActionChange={setReferenceTables}
          >
            {isDisabled => (
              <RepeatableField
                fields={holdingsStatementsForIndexes}
                addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForIndexes.addLabel`} />}
                onAdd={() => onAdd(holdingsStatementsForIndexes, 'holdingsStatementsForIndexes', 17, initialFields, setReferenceTables, 'order')}
                onRemove={index => onRemove(index, holdingsStatementsForIndexes, 17, setReferenceTables, 'order')}
                canAdd={!isDisabled}
                renderField={(field, index) => (
                  <Row left="xs">
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />}
                        name={getSubfieldName(17, 0, index)}
                      />
                    </Col>
                    <Col xs={4}>
                      <Field
                        component={TextField}
                        label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementNote`} />}
                        name={getSubfieldName(17, 1, index)}
                      />
                    </Col>
                  </Row>
                )}
              />
            )}
          </RepeatableActionsField>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-ill-policy
          xs={4}
        >
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(18)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.illPolicy`} />}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/ill-policies?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'illPolicies',
            }]}
            isRemoveValueAllowed
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(18)}
            okapi={okapi}
          />
        </Col>
        <Col
          data-test-digitization-policy
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(19)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.digitizationPolicy`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
        <Col
          data-test-retention-policy
          xs={4}
        >
          <Field
            component={TextField}
            name={getFieldName(20)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.retentionPolicy`} />}
            validate={[validateTextFieldRemoveValue]}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

HoldingsDetails.propTypes = {
  holdingsStatements: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  holdingsStatementsForSupplements: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  holdingsStatementsForIndexes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  getRepeatableFieldAction: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
