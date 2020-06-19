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
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  mappingProfileSubfieldShape,
  okapiShape,
} from '../../../../../utils';

export const HoldingsDetails = ({
  holdingStatements,
  holdingStatementsForSupplements,
  holdingStatementsForIndexes,
  initialFields,
  setReferenceTables,
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
          >
            <RepeatableField
              fields={holdingStatements}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement.addLabel`} />}
              onAdd={() => onAdd(holdingStatements, 'holdingStatements', 15, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, holdingStatements, 15, setReferenceTables, 'order')}
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
          >
            <RepeatableField
              fields={holdingStatementsForSupplements}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForSupplements.addLabel`} />}
              onAdd={() => onAdd(holdingStatementsForSupplements, 'holdingStatementsForSupplements', 16, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, holdingStatementsForSupplements, 16, setReferenceTables, 'order')}
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
          >
            <RepeatableField
              fields={holdingStatementsForIndexes}
              addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForIndexes.addLabel`} />}
              onAdd={() => onAdd(holdingStatementsForIndexes, 'holdingStatementsForIndexes', 17, initialFields, setReferenceTables, 'order')}
              onRemove={index => onRemove(index, holdingStatementsForIndexes, 17, setReferenceTables, 'order')}
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
            wrapperSourceLink="/ill-policies?limit=1000&query=cql.allRecords=1 sortby name"
            wrapperSourcePath="illPolicies"
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
          />
        </Col>
      </Row>
    </Accordion>
  );
};

HoldingsDetails.propTypes = {
  holdingStatements: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  holdingStatementsForSupplements: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  holdingStatementsForIndexes: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
};
